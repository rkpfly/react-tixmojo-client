import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';

// Email login validation schema
const schema = yup.object({
  email: yup
    .string()
    .required('Email is required')
    .email('Please enter a valid email address'),
  password: yup
    .string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters')
});

const LoginForm = ({ onSubmit, loading }) => {
  const { t } = useTranslation();
  const { register, handleSubmit, formState: { errors, isValid, touchedFields } } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange'
  });

  // Input field style based on validation
  const getInputStyle = (fieldName) => {
    const baseStyle = {
      width: '100%',
      padding: '15px',
      paddingLeft: fieldName === 'email' ? '40px' : '15px',
      fontSize: '16px',
      borderRadius: '20px',
      border: '1px solid',
      borderColor: errors[fieldName] ? 'var(--primary)' : 'var(--neutral-200)',
      backgroundColor: errors[fieldName] ? 'rgba(255, 0, 60, 0.02)' : 'white',
      outline: 'none',
      transition: 'all 0.2s',
    };
    return baseStyle;
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Email field */}
      <div style={{ position: 'relative', marginBottom: '20px' }}>
        {/* Email icon */}
        <div 
          style={{
            position: 'absolute',
            left: '15px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: errors.email ? 'var(--primary)' : 'var(--neutral-400)',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
            <polyline points="22,6 12,13 2,6"></polyline>
          </svg>
        </div>
        
        <input
          type="email"
          placeholder={t('Email')}
          autoComplete="email"
          {...register('email')}
          style={getInputStyle('email')}
        />
        
        {errors.email && (
          <div style={{ color: 'var(--primary)', fontSize: '12px', marginTop: '5px', paddingLeft: '15px' }}>
            {errors.email.message}
          </div>
        )}
      </div>
      
      {/* Password field */}
      <div style={{ position: 'relative', marginBottom: '15px' }}>
        <input
          type="password"
          placeholder={t('Password')}
          autoComplete="current-password"
          {...register('password')}
          style={getInputStyle('password')}
        />
        
        {errors.password && (
          <div style={{ color: 'var(--primary)', fontSize: '12px', marginTop: '5px', paddingLeft: '15px' }}>
            {errors.password.message}
          </div>
        )}
      </div>
      
      {/* Forgot password link */}
      <div style={{ 
        textAlign: 'right', 
        marginBottom: '20px',
        fontSize: '14px'
      }}>
        <a 
          href="/forgot-password" 
          style={{
            color: 'var(--purple-600)',
            textDecoration: 'none',
          }}
        >
          {t('Forgot Password?')}
        </a>
      </div>
      
      {/* Login button */}
      <button
        type="submit"
        disabled={loading || !isValid}
        style={{
          width: '100%',
          padding: '15px',
          backgroundColor: loading || !isValid ? 'var(--neutral-300)' : 'var(--primary)',
          color: 'white',
          border: 'none',
          borderRadius: '20px',
          fontSize: '16px',
          fontWeight: '600',
          cursor: loading || !isValid ? 'not-allowed' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
          transition: 'all 0.2s',
        }}
      >
        {loading ? (
          <>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ animation: 'spin 1s linear infinite' }}>
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" strokeDasharray="40 20" />
              <style>{`
                @keyframes spin {
                  100% {
                    transform: rotate(360deg);
                  }
                }
              `}</style>
            </svg>
            {t('Logging in...')}
          </>
        ) : (
          <>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
            {t('Login')}
          </>
        )}
      </button>
    </form>
  );
};

export default LoginForm;