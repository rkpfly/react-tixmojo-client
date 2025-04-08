import React, { useEffect, useState } from 'react';

/**
 * Component that displays Google OAuth configuration status
 * Useful for debugging and showing developers if OAuth is properly configured
 */
const GoogleAuthStatus = () => {
  const [status, setStatus] = useState({
    configured: false,
    clientId: '',
    message: 'Checking Google OAuth configuration...'
  });

  useEffect(() => {
    // Get the client ID from environment variables
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';
    
    // Check if it looks like a valid Google OAuth client ID
    const isValid = clientId && 
      clientId.includes('.apps.googleusercontent.com') && 
      clientId.length > 30 &&
      !clientId.includes('your-client-id-goes-here');
    
    // Set the status with appropriate message
    if (isValid) {
      setStatus({
        configured: true,
        clientId: clientId,
        message: 'Google OAuth is properly configured'
      });
    } else if (!clientId) {
      setStatus({
        configured: false,
        clientId: '',
        message: 'VITE_GOOGLE_CLIENT_ID is missing in your .env file'
      });
    } else {
      setStatus({
        configured: false,
        clientId: clientId,
        message: 'VITE_GOOGLE_CLIENT_ID does not look like a valid Google OAuth client ID'
      });
    }
  }, []);

  // Define styles based on configuration status
  const styles = {
    container: {
      padding: '12px 16px',
      borderRadius: '8px',
      marginBottom: '15px',
      fontSize: '14px',
      display: 'flex',
      flexDirection: 'column',
      gap: '5px',
      backgroundColor: status.configured ? 'rgba(52, 168, 83, 0.05)' : 'rgba(234, 67, 53, 0.05)',
      border: `1px solid ${status.configured ? 'rgba(52, 168, 83, 0.3)' : 'rgba(234, 67, 53, 0.3)'}`,
      color: status.configured ? '#2E7D32' : '#C62828',
    },
    title: {
      fontWeight: '600',
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
    },
    details: {
      fontSize: '13px',
      color: status.configured ? 'rgba(46, 125, 50, 0.8)' : 'rgba(198, 40, 40, 0.8)',
      marginTop: '3px',
    },
    clientId: {
      fontSize: '12px',
      fontFamily: 'monospace',
      backgroundColor: status.configured ? 'rgba(52, 168, 83, 0.1)' : 'rgba(234, 67, 53, 0.1)',
      padding: '4px 8px',
      borderRadius: '4px',
      marginTop: '5px',
      wordBreak: 'break-all',
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.title}>
        {status.configured ? (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
        )}
        {status.configured ? 'Google OAuth Configured' : 'Google OAuth Configuration Issue'}
      </div>
      <div style={styles.details}>{status.message}</div>
      {status.clientId && (
        <div style={styles.clientId}>
          {status.clientId.substring(0, 8)}...{status.clientId.substring(status.clientId.length - 12)}
        </div>
      )}
      {!status.configured && (
        <div style={styles.details}>
          <a 
            href="https://github.com/your-repo/TixMojo-Personalized#google-oauth-setup" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{
              color: '#C62828',
              textDecoration: 'underline',
            }}
          >
            See README for setup instructions
          </a>
        </div>
      )}
    </div>
  );
};

export default GoogleAuthStatus;