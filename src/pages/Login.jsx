import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import LoginToggle from '../Components/Auth/LoginToggle';
import OrDivider from '../Components/Auth/OrDivider';
import GoogleLoginButton from '../Components/Auth/GoogleLoginButton';
import GoogleAuthStatus from '../Components/Auth/GoogleAuthStatus';
import { useAuth } from '../context/AuthContext';
import { fetchUserPhoneNumbers, extractBestPhoneNumber } from '../services/googlePeopleService';
import { ScrollAnimation } from '../utils/ScrollAnimation.jsx';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, currentUser, isAuthenticated } = useAuth();
  const [usePhoneNumber, setUsePhoneNumber] = useState(false);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // If the user came from a protected route, redirect them back after login
  // Track whether we came from an event page to handle returning to ticket selection
  const from = location.state?.from || '/';
  const isFromEventPage = from.includes && from.includes('/events/');

  // Pre-fill phone input when user is authenticated from Google OAuth
  useEffect(() => {
    if (isAuthenticated() && currentUser?.phone && currentUser?.provider === 'google') {
      console.log("Pre-filling phone input in Login component:", currentUser.phone);
      setPhone(currentUser.phone);
      setUsePhoneNumber(true); // Switch to phone mode automatically
    }
  }, [currentUser, isAuthenticated]);

  const handleEmailLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Please enter email and password');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // In a real app, this would be an API call to authenticate
      // For demo purposes, we'll simulate a successful login
      await new Promise(resolve => setTimeout(resolve, 800));

      // Simulate user data from backend
      const userData = {
        id: '123',
        email: email,
        firstName: 'Demo',
        lastName: 'User',
        isAuthenticated: true
      };

      // Log the user in
      login(userData);

      // Navigate back to the previous page or home
      if (isFromEventPage) {
        // Add a parameter to indicate we should show the ticket selection on return
        const redirectPath = typeof from === 'string' ?
          `${from}?showTickets=true` : from;

        navigate(redirectPath, { replace: true });
      } else {
        navigate(from, { replace: true });
      }
    } catch (error) {
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneLogin = async (e) => {
    e.preventDefault();

    if (!phone || !password) {
      setError('Please enter phone number and password');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // In a real app, this would be an API call to authenticate
      // For demo purposes, we'll simulate a successful login
      await new Promise(resolve => setTimeout(resolve, 800));

      // Simulate user data from backend
      const userData = {
        id: '456',
        phone: phone,
        firstName: 'Phone',
        lastName: 'User',
        isAuthenticated: true
      };

      // Log the user in
      login(userData);

      // Navigate back to the previous page or home
      navigate(from, { replace: true });
    } catch (error) {
      setError('Invalid phone or password');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLoginSuccess = async (credentialResponse) => {
    setLoading(true);
    setError('');

    try {
      console.log("Google login success:", credentialResponse);

      // Handle different credential formats
      let payload;
      
      if (credentialResponse.credential === 'custom-login' && credentialResponse.userInfo) {
        // For our custom login flow, use the user info directly
        console.log("Using custom login flow user info");
        payload = credentialResponse.userInfo;
      } else if (credentialResponse.credential) {
        // For standard Google login, decode the JWT token
        console.log("Decoding standard JWT token");
        const token = credentialResponse.credential;
        const tokenParts = token.split('.');
        payload = JSON.parse(atob(tokenParts[1]));
      } else {
        throw new Error("Invalid credential response format");
      }

      console.log("Decoded token:", payload);

      // Try to fetch phone numbers from Google People API if scope was granted
      let phoneNumber = '';
      try {
        // Check if the access token is available from the credential response
        if (credentialResponse.access_token) {
          console.log("Access token available, fetching phone numbers from Google People API");
          const phoneNumbers = await fetchUserPhoneNumbers(credentialResponse.access_token);
          console.log("Phone numbers from Google People API:", phoneNumbers);
          
          if (phoneNumbers && phoneNumbers.length > 0) {
            phoneNumber = extractBestPhoneNumber(phoneNumbers);
            console.log("Phone number fetched from Google People API:", phoneNumber);
            
            // Set the phone number in the form for easy access on return to ticket page
            if (phoneValue && phoneValue !== phoneNumber) {
              console.log(`Updating phone number from Google People API: ${phoneValue} → ${phoneNumber}`);
              setPhone(phoneNumber);
            }
          } else {
            console.log("No phone numbers found in Google People API response");
          }
        } else {
          console.log("No access token available for Google People API");
        }
      } catch (peopleApiError) {
        console.error("Error fetching phone number from Google People API:", peopleApiError);
      }

      // Fallback to simulating a phone number if we couldn't get one from People API
      if (!phoneNumber) {
        // Generate a consistent phone number from the user ID
        if (payload.sub) {
          // Use last 10 digits or pad with zeros
          let digits = payload.sub.replace(/\D/g, '');
          if (digits.length > 10) {
            digits = digits.slice(-10);
          } else if (digits.length < 10) {
            digits = digits.padStart(10, '0');
          }
          phoneNumber = `+1${digits}`;
        } else {
          phoneNumber = '+12025550198'; // Default fallback
        }
        console.log("Using simulated phone number:", phoneNumber);
      }

      // Create user data object
      const userData = {
        id: payload.sub,
        sub: payload.sub,
        email: payload.email,
        firstName: payload.given_name || payload.name?.split(' ')[0] || 'Google',
        lastName: payload.family_name || payload.name?.split(' ').slice(1).join(' ') || 'User',
        picture: payload.picture || 'https://via.placeholder.com/150',
        profilePicture: payload.picture || 'https://via.placeholder.com/150',
        provider: 'google',
        locale: payload.locale,
        // Use the phone number from Google People API or the fallback
        phone: phoneNumber,
        isAuthenticated: true,
        // Store the access token for future use
        access_token: credentialResponse.access_token
      };

      console.log("Generated user data:", userData);

      // Log the user in
      login(userData);

      // Navigate back to the previous page or home
      if (isFromEventPage) {
        // Add a parameter to indicate we should show the ticket selection on return
        const redirectPath = typeof from === 'string' ?
          `${from}?showTickets=true` : from;

        console.log("Redirecting to event page with ticket selection:", redirectPath);
        navigate(redirectPath, { replace: true });
      } else {
        navigate(from, { replace: true });
      }
    } catch (error) {
      console.error("Google login processing error:", error);
      setError('Failed to process Google login');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLoginError = (error) => {
    console.error("Google login failed:", error);

    // Check if the error message contains "redirect_uri_mismatch"
    const isRedirectUriMismatch = error &&
      typeof error === 'string' &&
      error.includes('redirect_uri_mismatch');

    if (isRedirectUriMismatch) {
      setError(
        'OAuth configuration error: redirect_uri_mismatch. Please set up Google OAuth credentials properly. ' +
        'See README.md for instructions.'
      );
    } else {
      setError('Google login failed. Please try another method.');
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: 'calc(100vh - 90px)', // Accounting for navbar
      padding: '20px',
    }}>
      <ScrollAnimation direction="up">
        <div style={{
          backgroundColor: 'white',
          borderRadius: '20px',
          padding: '30px',
          width: '100%',
          maxWidth: '400px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        }}>
          <h1 style={{
            textAlign: 'center',
            marginBottom: '30px',
            fontSize: '24px',
            fontWeight: '700',
          }}>
            Welcome to TixMojo
          </h1>

          {/* Social login buttons */}
          <div style={{ marginBottom: '20px' }}>
            <GoogleLoginButton
              onSuccess={handleGoogleLoginSuccess}
              onError={handleGoogleLoginError}
            />
            
            {/* Display Google Auth status when in development or when there's an error */}
            {(import.meta.env.DEV || error.includes('OAuth')) && (
              <GoogleAuthStatus />
            )}
          </div>

          <OrDivider />

          {/* Login toggle */}
          <LoginToggle
            usePhoneNumber={usePhoneNumber}
            setUsePhoneNumber={setUsePhoneNumber}
          />

          {/* Login form */}
          <form onSubmit={usePhoneNumber ? handlePhoneLogin : handleEmailLogin}>
            {usePhoneNumber ? (
              <>
                <div style={{ marginBottom: '15px' }}>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Phone Number"
                    style={{
                      width: '100%',
                      padding: '12px 15px',
                      borderRadius: '20px',
                      border: '1px solid var(--neutral-200)',
                      fontSize: '14px',
                      backgroundColor: isAuthenticated() && currentUser?.phone ? 'rgba(52, 168, 83, 0.05)' : 'white',
                    }}
                  />
                </div>
                {/* Show message when phone is pre-filled from Google */}
                {isAuthenticated() && currentUser?.phone && currentUser?.provider === 'google' && (
                  <div style={{
                    backgroundColor: 'rgba(52, 168, 83, 0.05)',
                    border: '1px solid rgba(52, 168, 83, 0.3)',
                    borderRadius: '10px',
                    padding: '8px 12px',
                    fontSize: '13px',
                    marginBottom: '15px',
                    color: '#34A853',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                    Phone number pre-filled from your Google account
                  </div>
                )}
              </>
            ) : (
              <div style={{
                marginBottom: '15px',
                position: 'relative',
              }}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  style={{
                    width: '100%',
                    padding: '12px 15px 12px 40px',
                    borderRadius: '20px',
                    border: '1px solid var(--neutral-200)',
                    fontSize: '14px',
                  }}
                />
                <div style={{
                  position: 'absolute',
                  left: '15px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--neutral-400)',
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                </div>
              </div>
            )}

            <div style={{ marginBottom: '20px' }}>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                style={{
                  width: '100%',
                  padding: '12px 15px',
                  borderRadius: '20px',
                  border: '1px solid var(--neutral-200)',
                  fontSize: '14px',
                }}
              />
            </div>

            {error && (
              <div style={{
                color: 'var(--primary)',
                marginBottom: '15px',
                fontSize: '14px',
                textAlign: 'center',
              }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: 'var(--primary)',
                color: 'white',
                border: 'none',
                borderRadius: '20px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              {loading ? (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'spin 1s linear infinite' }}>
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0z"></path>
                    <style>{`
                      @keyframes spin {
                        100% {
                          transform: rotate(360deg);
                        }
                      }
                    `}</style>
                  </svg>
                  <span>Logging in...</span>
                </>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                    <polyline points="10 17 15 12 10 7"></polyline>
                    <line x1="15" y1="12" x2="3" y2="12"></line>
                  </svg>
                  <span>Login</span>
                </>
              )}
            </button>
          </form>

          <div style={{
            marginTop: '20px',
            textAlign: 'center',
            fontSize: '14px',
          }}>
            Don't have an account? <a
              href="/signup"
              style={{
                color: 'var(--purple-600)',
                textDecoration: 'none',
                fontWeight: '500',
              }}
            >
              Sign up
            </a>
          </div>
        </div>
      </ScrollAnimation>
    </div>
  );
};

export default Login;