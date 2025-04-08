import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const LoginButton = () => {
  const { currentUser, logout, isAuthenticated } = useAuth();
  
  return isAuthenticated() ? (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
    }}>
      <div style={{
        fontSize: '14px',
        fontWeight: '500',
      }}>
        {currentUser.firstName || 'User'}
      </div>
      <button
        onClick={logout}
        style={{
          backgroundColor: 'transparent',
          border: 'none',
          cursor: 'pointer',
          fontSize: '14px',
          color: 'var(--primary)',
          padding: '5px 10px',
          borderRadius: '4px',
        }}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = 'rgba(255, 0, 60, 0.05)';
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = 'transparent';
        }}
      >
        Logout
      </button>
    </div>
  ) : (
    <Link
      to="/login"
      style={{
        padding: '8px 16px',
        backgroundColor: 'var(--primary)',
        color: 'white',
        borderRadius: '20px',
        textDecoration: 'none',
        fontSize: '14px',
        fontWeight: '600',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
      }}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
        <polyline points="10 17 15 12 10 7"></polyline>
        <line x1="15" y1="12" x2="3" y2="12"></line>
      </svg>
      <span>Login</span>
    </Link>
  );
};

export default LoginButton;