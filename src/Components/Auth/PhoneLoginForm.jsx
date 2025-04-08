import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';
import ISO31661a2 from 'iso-3166-1-alpha-2';
import { useAuth } from '../../context/AuthContext';

// Phone login validation schema
const schema = yup.object({
  phone: yup
    .string()
    .required('Phone number is required')
    .matches(/^\d{5,15}$/, 'Phone number must contain 5-15 digits'),
  password: yup
    .string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters')
});

// Helper function to get dial code based on country code
function getDialCode(countryCode) {
  const codes = {
    'US': '+1', 'CA': '+1', 'GB': '+44', 'AU': '+61', 
    'NZ': '+64', 'IN': '+91', 'DE': '+49', 'FR': '+33',
    'IT': '+39', 'ES': '+34', 'JP': '+81', 'CN': '+86',
    'RU': '+7', 'BR': '+55', 'MX': '+52', 'ZA': '+27'
  };
  
  return codes[countryCode] || '';
}

// Country data
const countryOptions = ISO31661a2.getCountries()
  .map(country => ({
    code: ISO31661a2.getCode(country),
    name: country,
    dialCode: getDialCode(ISO31661a2.getCode(country))
  }))
  .filter(country => country.code && country.dialCode)
  .sort((a, b) => a.name.localeCompare(b.name));

// Popular countries to show at the top
const popularCountries = ['US', 'GB', 'CA', 'AU', 'NZ', 'IN'];
const sortedCountries = [
  ...countryOptions.filter(c => popularCountries.includes(c.code)),
  ...countryOptions.filter(c => !popularCountries.includes(c.code))
];

// Function to extract country code from phone number
const extractCountryFromPhone = (phone) => {
  if (!phone) return null;
  
  // Check for common formats
  if (phone.startsWith('+1')) return 'US'; // North America
  if (phone.startsWith('+44')) return 'GB'; // UK
  if (phone.startsWith('+61')) return 'AU'; // Australia
  if (phone.startsWith('+64')) return 'NZ'; // New Zealand
  if (phone.startsWith('+91')) return 'IN'; // India
  
  // Try to match other countries
  for (const country of countryOptions) {
    if (phone.startsWith(country.dialCode)) {
      return country.code;
    }
  }
  
  return null;
};

// Function to extract national number from phone with country code
const extractNationalNumber = (phone, dialCode) => {
  if (!phone || !dialCode || !phone.startsWith(dialCode)) {
    return '';
  }
  
  // Remove the dial code from the phone number
  return phone.substring(dialCode.length);
};

const PhoneLoginForm = ({ onSubmit, loading }) => {
  const { t } = useTranslation();
  const { currentUser, isAuthenticated } = useAuth();
  const [selectedCountry, setSelectedCountry] = useState({
    code: 'AU',
    name: 'Australia',
    dialCode: '+61'
  });
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [nationalNumber, setNationalNumber] = useState('');
  
  const { register, handleSubmit, formState: { errors, isValid }, setValue, reset } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange'
  });

  // Pre-fill with user's phone number if available from Google OAuth
  useEffect(() => {
    if (isAuthenticated() && currentUser?.phone) {
      console.log("Pre-filling phone input with:", currentUser.phone);
      
      // Extract country code
      const countryCode = extractCountryFromPhone(currentUser.phone);
      
      if (countryCode) {
        // Find the country object
        const foundCountry = countryOptions.find(c => c.code === countryCode);
        if (foundCountry) {
          setSelectedCountry(foundCountry);
          
          // Extract and set national number
          const nationalNum = extractNationalNumber(currentUser.phone, foundCountry.dialCode);
          setNationalNumber(nationalNum);
          setValue('phone', nationalNum, { shouldValidate: true });
        }
      } else {
        // If no country code detected, use the full number
        setNationalNumber(currentUser.phone);
        setValue('phone', currentUser.phone, { shouldValidate: true });
      }
    }
  }, [currentUser, isAuthenticated, setValue]);
  
  // Add a debug effect to log when component mounts or auth changes
  useEffect(() => {
    console.log("PhoneLoginForm auth state:", { 
      isAuthenticated: isAuthenticated(),
      currentUser,
      hasPhone: Boolean(currentUser?.phone)
    });
  }, [isAuthenticated, currentUser]);

  // Handle form submission
  const handleFormSubmit = (data) => {
    // Add country code to the phone number
    const fullPhoneNumber = `${selectedCountry.dialCode}${data.phone}`;
    onSubmit({ ...data, phone: fullPhoneNumber });
  };

  // Handle country change
  const handleCountryChange = (country) => {
    setSelectedCountry(country);
    setShowCountryDropdown(false);
    
    // If we have a national number, keep it when changing country
    if (nationalNumber) {
      setValue('phone', nationalNumber, { shouldValidate: true });
    }
  };

  // Input field style based on validation
  const getInputStyle = (fieldName) => {
    const baseStyle = {
      width: '100%',
      padding: '15px',
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
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      {/* Phone number field */}
      <div style={{ position: 'relative', marginBottom: '20px' }}>
        <div style={{ 
          display: 'flex',
          alignItems: 'center',
          borderRadius: '20px',
          border: `1px solid ${errors.phone ? 'var(--primary)' : 'var(--neutral-200)'}`,
          overflow: 'hidden',
          backgroundColor: errors.phone ? 'rgba(255, 0, 60, 0.02)' : 'white',
          position: 'relative',
        }}>
          {/* Country code dropdown */}
          <div 
            onClick={() => setShowCountryDropdown(!showCountryDropdown)}
            style={{ 
              padding: '15px',
              backgroundColor: 'var(--neutral-50)',
              borderRight: '1px solid var(--neutral-200)',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              color: 'var(--neutral-600)',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              minWidth: '90px',
              userSelect: 'none',
            }}
          >
            {selectedCountry.dialCode}
            <svg 
              width="12" 
              height="12" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              style={{
                transition: 'transform 0.2s ease',
                transform: showCountryDropdown ? 'rotate(180deg)' : 'rotate(0)',
              }}
            >
              <path d="M6 9l6 6 6-6"></path>
            </svg>
          </div>
          
          {/* Phone input */}
          <input
            id="phone"
            type="tel"
            placeholder={t('Phone Number')}
            autoComplete="tel"
            {...register('phone')}
            onChange={(e) => {
              setNationalNumber(e.target.value);
              register('phone').onChange(e);
            }}
            style={{
              flex: 1,
              border: 'none',
              padding: '15px',
              fontSize: '16px',
              outline: 'none',
              backgroundColor: 'transparent',
            }}
          />
          
          {/* Country dropdown */}
          {showCountryDropdown && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              backgroundColor: 'white',
              border: '1px solid var(--neutral-200)',
              borderRadius: '8px',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
              width: '300px',
              maxHeight: '300px',
              overflowY: 'auto',
              zIndex: 10,
              marginTop: '5px',
            }}>
              <div style={{ padding: '10px', borderBottom: '1px solid #f0f0f0' }}>
                <input
                  type="text"
                  placeholder={t("Search countries...")}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #e0e0e0',
                    borderRadius: '4px',
                    fontSize: '14px',
                  }}
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) => {
                    // Filter countries (would implement in a real app)
                  }}
                />
              </div>
              
              {sortedCountries.map((country) => (
                <div
                  key={country.code}
                  onClick={() => handleCountryChange(country)}
                  style={{
                    padding: '8px 12px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderBottom: '1px solid #f5f5f5',
                    backgroundColor: selectedCountry.code === country.code ? '#f5f5f5' : 'transparent',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#f9f9f9';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = selectedCountry.code === country.code ? '#f5f5f5' : 'transparent';
                  }}
                >
                  <span>{country.name}</span>
                  <span style={{ color: 'var(--neutral-600)', fontSize: '14px' }}>
                    {country.dialCode}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {errors.phone && (
          <div style={{ color: 'var(--primary)', fontSize: '12px', marginTop: '5px', paddingLeft: '15px' }}>
            {errors.phone.message}
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
      
      {/* Google data message */}
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

export default PhoneLoginForm;