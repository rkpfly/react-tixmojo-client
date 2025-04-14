import React, { useState, useEffect } from 'react';
import { GoogleLogin, useGoogleLogin } from '@react-oauth/google';

const GoogleLoginButton = ({ onSuccess, onError }) => {
  const [googleConfigured, setGoogleConfigured] = useState(true);
  
  // Check if Google OAuth is properly configured
  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    
    // Basic check for a valid-looking Google client ID
    const validClientId = clientId && 
      clientId.includes('.apps.googleusercontent.com') && 
      clientId.length > 30 &&
      !clientId.includes('your-client-id-goes-here');
      
    setGoogleConfigured(validClientId);
  }, []);
  
  // If Google OAuth is not configured, show a button that looks similar but shows an error
  if (!googleConfigured) {
    return (
      <div style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: '15px'
      }}>
        <button
          onClick={() => onError('Google OAuth not configured properly. See README.md for setup instructions.')}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            padding: '10px 20px',
            backgroundColor: 'white',
            border: '1px solid var(--neutral-200)',
            borderRadius: '20px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.2s',
            width: '280px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path
              d="M12.0003 4.75C13.7703 4.75 15.3553 5.36 16.6053 6.47L20.0303 3.25C17.9502 1.26 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.28027 6.63L5.27028 9.5C6.21525 6.76 8.87028 4.75 12.0003 4.75Z"
              fill="#EA4335"
            />
            <path
              d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 20.925C22.2 18.81 23.49 15.8 23.49 12.275Z"
              fill="#4285F4"
            />
            <path
              d="M5.26498 14.5C5.02498 13.73 4.88501 12.91 4.88501 12C4.88501 11.09 5.01998 10.27 5.26998 9.5L1.275 6.63C0.465 8.27 0 10.08 0 12C0 13.94 0.47503 15.76 1.28503 17.38L5.26498 14.5Z"
              fill="#FBBC05"
            />
            <path
              d="M12.0002 24C15.2452 24 17.9752 22.93 19.9452 20.93L16.0802 18.1C15.0152 18.82 13.6252 19.25 12.0002 19.25C8.86516 19.25 6.21016 17.23 5.26516 14.5L1.27516 17.38C3.25016 21.31 7.31018 24 12.0002 24Z"
              fill="#34A853"
            />
          </svg>
          <span>Continue with Google</span>
        </button>
        <div style={{
          fontSize: '12px',
          color: 'var(--neutral-500)',
          textAlign: 'center',
          marginTop: '8px',
          maxWidth: '280px'
        }}>
          (Google OAuth not configured - See README.md)
        </div>
      </div>
    );
  }
  
  // Use useGoogleLogin hook for direct access to tokens
  const login = useGoogleLogin({
    onSuccess: tokenResponse => {
      console.log('Google Login token response:', tokenResponse);
      
      // Now we need to get user info from Google
      const fetchUserInfo = async () => {
        try {
          // Get user profile with the access token
          const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: {
              Authorization: `Bearer ${tokenResponse.access_token}`
            }
          });
          
          const userInfo = await response.json();
          console.log('Google user info:', userInfo);
          
          // Call onSuccess with combined token and user info
          onSuccess({
            ...tokenResponse,
            credential: 'custom-login', // Mark as custom login flow
            userInfo // Add the user info
          });
        } catch (error) {
          console.error('Error fetching user info:', error);
          onError(error);
        }
      };
      
      fetchUserInfo();
    },
    onError,
    scope: 'email profile https://www.googleapis.com/auth/user.phonenumbers.read',
    flow: 'implicit'
  });

  // Normal Google login button
  return (
    <div style={{
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      marginBottom: '15px'
    }}>
      <button
        onClick={() => login()}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
          padding: '10px 20px',
          backgroundColor: 'white',
          border: '1px solid var(--neutral-200)',
          borderRadius: '20px',
          fontSize: '14px',
          fontWeight: '500',
          cursor: 'pointer',
          transition: 'all 0.2s',
          width: '280px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'var(--neutral-50)';
          e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'white';
          e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.08)';
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24">
          <path
            d="M22.5608 9.93666H21.6V9.9H12V14.1H18.2194C17.3374 16.5885 14.9049 18.3 12 18.3C8.4645 18.3 5.7 15.5355 5.7 12C5.7 8.4645 8.4645 5.7 12 5.7C13.6002 5.7 15.0592 6.27909 16.1722 7.23023L19.2022 4.20024C17.3962 2.49774 14.8404 1.5 12 1.5C6.14754 1.5 1.5 6.14754 1.5 12C1.5 17.8525 6.14754 22.5 12 22.5C17.8525 22.5 22.5 17.8525 22.5 12C22.5 11.2945 22.4381 10.6053 22.5608 9.93666Z"
            fill="#4285F4"
          />
          <path
            d="M3.08477 7.33832L6.55731 9.85969C7.47893 7.43754 9.56782 5.7 12 5.7C13.6002 5.7 15.0592 6.27909 16.1722 7.23023L19.2022 4.20024C17.3962 2.49774 14.8405 1.5 12 1.5C8.16262 1.5 4.81601 3.89531 3.08477 7.33832Z"
            fill="#EA4335"
          />
          <path
            d="M12.0002 22.5C14.7758 22.5 17.2709 21.5566 19.0708 19.923L15.7448 17.1C14.6608 17.9005 13.3595 18.3 12.0002 18.3C9.10442 18.3 6.67934 16.5998 5.78684 14.1292L2.30742 16.8698C4.01903 20.3665 7.73261 22.5 12.0002 22.5Z"
            fill="#34A853"
          />
          <path
            d="M22.5608 9.93661H21.6V9.89996H12V14.1H18.2194C17.8003 15.3128 17.0359 16.3621 16.0421 17.1L16.0436 17.0991L19.3695 19.9219C19.1397 20.1328 22.5 17.4 22.5 12C22.5 11.2945 22.4381 10.6052 22.5608 9.93661Z"
            fill="#4285F4"
          />
          <path
            d="M5.78658 14.129C5.59496 13.4502 5.70012 11.8714 5.70012 12C5.70012 11.8714 5.59496 10.5498 5.78658 9.87096L5.78435 9.8421L2.27789 7.29175L2.30715 7.1302C1.5335 8.58491 1.5 10.2323 1.5 12C1.5 13.7677 1.5335 15.4151 2.30715 16.8698L5.78658 14.129Z"
            fill="#FBBC05"
          />
        </svg>
        <span>Continue with Google</span>
      </button>
    </div>
  );
};

export default GoogleLoginButton;