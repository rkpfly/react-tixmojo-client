import React, { useState, useEffect } from 'react';
import { GoogleLogin } from '@react-oauth/google';

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
  
  // Normal Google login button
  return (
    <div style={{
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      marginBottom: '15px'
    }}>
      <GoogleLogin
        onSuccess={onSuccess}
        onError={onError}
        useOneTap={false}
        theme="outline"
        size="large"
        logo_alignment="center"
        text="continue_with"
        shape="pill"
        width="280px"
        auto_select={false}
        ux_mode="popup"
        /* Request additional scopes when available */
        scope="profile email"
      />
    </div>
  );
};

export default GoogleLoginButton;