import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Cleave from 'cleave.js/react';
import zxcvbn from 'zxcvbn';
import ISO31661a2 from 'iso-3166-1-alpha-2';
import creditCardType from 'credit-card-type';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import PhoneInput, { getCountryCallingCode } from 'react-phone-number-input';
import { isValidPhoneNumber, parsePhoneNumber } from 'libphonenumber-js';
import 'react-phone-number-input/style.css';
// Import flag images
import ReactCountryFlag from 'react-country-flag';

// Buyer information validation schema
const buyerInfoSchema = yup.object({
  firstName: yup
    .string()
    .required('First name is required')
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name cannot exceed 50 characters')
    .matches(/^[a-zA-Z\s-']+$/, 'First name can only contain letters, spaces, hyphens, and apostrophes'),
  
  lastName: yup
    .string()
    .required('Last name is required')
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name cannot exceed 50 characters')
    .matches(/^[a-zA-Z\s-']+$/, 'Last name can only contain letters, spaces, hyphens, and apostrophes'),
  
  email: yup
    .string()
    .required('Email is required')
    .email('Please enter a valid email address')
    .max(100, 'Email address is too long'),
  
  phone: yup
    .string()
    .required('Phone number is required')
    .test('is-valid-phone', function(value) {
      // Allow validation to pass if value is empty (the required check will handle this)
      if (!value) return this.createError({ message: 'Phone number is required' });
      
      // For partial dial codes, consider it valid during typing
      if (value.match(/^\+\d{1,3}$/)) {
        return true;
      }
      
      // Try to validate if it looks like a valid number
      try {
        // Check if the number starts with +
        if (!value.startsWith('+')) {
          return this.createError({
            message: 'Phone number must include country code (e.g., +1 for US)'
          });
        }
        
        // Use libphonenumber-js to validate the phone number
        const isValid = isValidPhoneNumber(value);
        
        if (!isValid) {
          try {
            // Try to get the country to provide more specific error message
            const phoneInput = parsePhoneNumber(value) || { country: null };
            const country = phoneInput.country || 'unknown country';
            
            return this.createError({
              message: `Invalid phone number format for ${ISO31661a2.getCountry(country) || country}`
            });
          } catch (e) {
            return this.createError({
              message: 'Invalid phone number format. Please check and try again.'
            });
          }
        }
        
        return true;
      } catch (err) {
        return this.createError({
          message: 'Invalid phone number. Please enter a valid number with country code.'
        });
      }
    })
});

// Payment information validation schema
const paymentInfoSchema = yup.object({
  cardholderName: yup
    .string()
    .required('Cardholder name is required')
    .min(3, 'Cardholder name must be at least 3 characters')
    .max(100, 'Cardholder name is too long')
    .matches(/^[a-zA-Z\s-']+$/, 'Cardholder name can only contain letters, spaces, hyphens, and apostrophes'),
  
  cardNumber: yup
    .string()
    .required('Card number is required')
    .test('is-credit-card', 'Invalid credit card number', (value) => {
      // Remove all non-digits
      const digitsOnly = value ? value.replace(/\D/g, '') : '';
      
      // Basic card validation using credit-card-type
      const cardInfo = creditCardType(digitsOnly);
      if (cardInfo.length === 0) return false;
      
      // Check if the length matches expected length for the card type
      const { lengths } = cardInfo[0];
      return lengths.includes(digitsOnly.length);
    }),
  
  expiryDate: yup
    .string()
    .required('Expiry date is required')
    .test('expiry-date', 'Expiry date is invalid or expired', (value) => {
      if (!value) return false;
      
      // MM/YY format validation
      if (!/^\d{2}\/\d{2}$/.test(value)) return false;
      
      const [month, year] = value.split('/');
      const monthNum = parseInt(month, 10);
      const yearNum = parseInt(year, 10) + 2000; // Convert YY to 20YY
      
      if (monthNum < 1 || monthNum > 12) return false;
      
      const now = new Date();
      const currentMonth = now.getMonth() + 1; // 1-12
      const currentYear = now.getFullYear();
      
      // Check if the card is expired
      return (yearNum > currentYear || (yearNum === currentYear && monthNum >= currentMonth));
    }),
  
  cvv: yup
    .string()
    .required('CVV is required')
    .matches(/^\d{3,4}$/, 'CVV must be 3 or 4 digits'),
  
  zipCode: yup
    .string()
    .required('Postal/ZIP code is required')
    .min(3, 'Postal/ZIP code is too short')
    .max(10, 'Postal/ZIP code is too long')
});

// No longer needed, using direct formatting

// Helper to render country flag emoji from country code
const getCountryFlag = (countryCode) => {
  if (!countryCode || countryCode.length !== 2) return '🏳️';
  
  try {
    // Convert country code to regional indicator symbols (flag emoji)
    const offset = 127397; // Regional Indicator Symbol Letter A (127462) - 'A'.charCodeAt(0) (65)
    const firstLetter = countryCode.charCodeAt(0);
    const secondLetter = countryCode.charCodeAt(1);
    
    return String.fromCodePoint(firstLetter + offset, secondLetter + offset);
  } catch (error) {
    console.error("Error rendering flag:", error);
    return '🏳️';
  }
};

const PaymentPortal = ({ event, expiryTime, onExpire, cartItems, totalAmount, discount, onBack, onCancel }) => {
  const navigate = useNavigate();
  // Timer state from parent
  const [timeLeft, setTimeLeft] = useState({
    minutes: 0,
    seconds: 0
  });
  
  // Step state
  const [currentStep, setCurrentStep] = useState('buyerInfo'); // 'buyerInfo', 'paymentInfo'
  
  // Country state for phone input
  const [selectedCountry, setSelectedCountry] = useState({
    code: 'AU',
    name: 'Australia'
  });
  
  // Card type state
  const [cardType, setCardType] = useState('');
  
  // Form submission state
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);
  
  // Security indicator for card entry
  const [cardSecurityScore, setCardSecurityScore] = useState(0);
  
  // Get user from auth context
  const { currentUser, isAuthenticated } = useAuth();
  
  // Default values for form with enhanced Google data handling
  const getDefaultValues = () => {
    // If user is authenticated, use their data
    if (isAuthenticated() && currentUser) {
      // For Google auth, ensure we handle all available fields
      if (currentUser.provider === 'google') {
        // Format phone number if present using libphonenumber-js
        let formattedPhone = '';
        if (currentUser.phone) {
          try {
            // Try to parse and format the phone as E.164
            const parsedPhone = parsePhoneNumber(currentUser.phone, 'AU'); // Default to AU if no country code
            if (parsedPhone && parsedPhone.isValid()) {
              formattedPhone = parsedPhone.format('E.164');
              
              // Also update the selected country based on the phone
              if (parsedPhone.country) {
                setSelectedCountry({
                  code: parsedPhone.country,
                  name: ISO31661a2.getCountry(parsedPhone.country) || parsedPhone.country
                });
              }
            }
          } catch (error) {
            console.warn("Could not parse user phone:", error);
            formattedPhone = currentUser.phone;
          }
        }
        
        // Set default country code based on user locale if available and no phone country detected
        if (currentUser.locale && !formattedPhone) {
          const countryCodeMap = {
            'en-US': 'US',
            'en-GB': 'GB',
            'en-AU': 'AU', 
            'en-CA': 'CA',
            'ja-JP': 'JP'
          };
          
          const countryCode = countryCodeMap[currentUser.locale];
          if (countryCode) {
            setSelectedCountry({
              code: countryCode,
              name: ISO31661a2.getCountry(countryCode) || countryCode
            });
          }
        }
        
        return {
          firstName: currentUser.firstName || currentUser.given_name || '',
          lastName: currentUser.lastName || currentUser.family_name || '',
          email: currentUser.email || '',
          phone: formattedPhone
        };
      } else {
        // Standard user data
        return {
          firstName: currentUser.firstName || '',
          lastName: currentUser.lastName || '',
          email: currentUser.email || '',
          phone: currentUser.phone || ''
        };
      }
    }
    
    // Otherwise use empty values
    return {
      firstName: '',
      lastName: '',
      email: '',
      phone: ''
    };
  };
  
  // Form for buyer information
  const buyerInfoForm = useForm({
    resolver: yupResolver(buyerInfoSchema),
    mode: 'onBlur',
    defaultValues: getDefaultValues()
  });
  
  // Update form values when currentUser changes
  useEffect(() => {
    if (isAuthenticated() && currentUser) {
      const defaultValues = getDefaultValues();
      
      // Reset form with new values
      buyerInfoForm.reset(defaultValues);
      
      console.log("Updated form with user data:", defaultValues);
    }
  }, [currentUser, isAuthenticated]);
  
  // Form for payment information
  const paymentInfoForm = useForm({
    resolver: yupResolver(paymentInfoSchema),
    mode: 'onBlur',
    defaultValues: {
      cardholderName: '',
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      zipCode: ''
    }
  });
  
  // State to track if the timer is almost expired
  const [isAlmostExpired, setIsAlmostExpired] = useState(false);
  
  // Update timer every second
  useEffect(() => {
    if (!expiryTime) return;
    
    const updateTimer = () => {
      try {
        // Ensure expiryTime is a Date object
        const expiry = expiryTime instanceof Date ? expiryTime : new Date(expiryTime);
        const now = new Date();
        const difference = expiry.getTime() - now.getTime();
        
        if (difference <= 0) {
          setTimeLeft({ minutes: 0, seconds: 0 });
          setIsAlmostExpired(false);
          
          // Clear all form data when timer expires
          clearFormData();
          
          // Call the expiry handler from parent
          if (typeof onExpire === 'function') {
            console.log("Payment portal timer expired - calling parent handler");
            onExpire();
          }
          return;
        }
        
        // Calculate minutes and seconds
        const mins = Math.floor((difference / 1000 / 60) % 60);
        const secs = Math.floor((difference / 1000) % 60);
        
        setTimeLeft({ minutes: mins, seconds: secs });
        setIsAlmostExpired(difference < 120000); // Less than 2 minutes
      } catch (error) {
        console.error("Error in countdown timer:", error);
      }
    };
    
    // Initial update
    updateTimer();
    
    // Update every second
    const interval = setInterval(updateTimer, 1000);
    
    // Clean up
    return () => clearInterval(interval);
  }, [expiryTime, onExpire]);
  
  // Clear all form data - for security
  const clearFormData = () => {
    buyerInfoForm.reset();
    paymentInfoForm.reset();
    setCurrentStep('buyerInfo');
  };
  
  // Handle card type detection
  const handleCardNumberChange = (e) => {
    const cardNumber = e.target.value.replace(/\s/g, '');
    const detectedCards = creditCardType(cardNumber);
    
    if (detectedCards.length > 0) {
      const card = detectedCards[0];
      setCardType(card.type);
    } else {
      setCardType('');
    }
    
    // Calculate security score based on card number length
    if (cardNumber.length > 10) {
      const score = zxcvbn(cardNumber.substring(0, 6) + cardNumber.substring(cardNumber.length - 4));
      setCardSecurityScore(score.score); // 0-4 score from zxcvbn
    } else {
      setCardSecurityScore(0);
    }
  };
  
  // Handle form submission for buyer info
  const handleBuyerInfoSubmit = async (data) => {
    if (isFormSubmitting) return;
    
    setIsFormSubmitting(true);
    
    try {
      // Simulate server-side validation
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // The phone number is already in E.164 format from react-phone-number-input
      // which includes the country code, so we don't need to add it manually
      
      // In a real app, this would call an API endpoint
      console.log("Buyer info validated:", {
        ...data,
        // Show the selected country as well for tracking purposes
        phoneCountry: selectedCountry.code
      });
      
      // Move to payment info step
      setCurrentStep('paymentInfo');
    } catch (error) {
      console.error("Error validating buyer info:", error);
      buyerInfoForm.setError('root', { 
        type: 'manual',
        message: 'Server validation failed. Please try again.' 
      });
    } finally {
      setIsFormSubmitting(false);
    }
  };
  
  // Handle form submission for payment info
  const handlePaymentInfoSubmit = async (data) => {
    if (isFormSubmitting) return;
    
    setIsFormSubmitting(true);
    
    try {
      // Get buyer info from the first step
      const buyerInfo = buyerInfoForm.getValues();
      
      // Combine data from both forms
      const paymentData = {
        buyerInfo: {
          ...buyerInfo,
          // The phone is already in E.164 format with country code
          phoneCountry: selectedCountry.code,
          userId: currentUser?.id || null,
          authProvider: currentUser?.provider || null
        },
        paymentInfo: {
          ...data,
          // For security, we'd never send full card details to our server
          // We'd use a payment processor token instead
          cardNumber: data.cardNumber.replace(/\s/g, '').slice(-4).padStart(16, '*'),
          cardType: cardType || 'unknown'
        },
        ticketInfo: {
          tickets: cartItems,
          totalAmount,
          discount,
          finalAmount: (totalAmount + 10 - (totalAmount * discount))
        },
        eventId: event.id
      };
      
      // Log the payment data for debugging (remove in production)
      console.log("Processing payment with data:", paymentData);
      
      // Simulate server-side payment processing with different times based on auth method
      // Google auth is "faster" for demonstration purposes
      const processingTime = currentUser?.provider === 'google' ? 800 : 1500;
      await new Promise(resolve => setTimeout(resolve, processingTime));
      
      // In a real app, this would be handled by a payment processor
      console.log("Payment processed successfully");
      
      // Show success message or redirect
      alert('Payment processed successfully! In a real application, you would be redirected to a confirmation page.');
    } catch (error) {
      console.error("Error processing payment:", error);
      paymentInfoForm.setError('root', { 
        type: 'manual',
        message: 'Payment processing failed. Please try again.' 
      });
    } finally {
      setIsFormSubmitting(false);
    }
  };
  
  // Handle back button
  const handleBack = () => {
    // If on payment info step, go back to buyer info step
    if (currentStep === 'paymentInfo') {
      setCurrentStep('buyerInfo');
    } else {
      // If on buyer info step, go back to ticket selection
      // This will be handled by the parent component through onBack prop
      if (typeof onBack === 'function') {
        onBack();
      }
    }
  };
  
  // Get input style based on validation state
  const getInputStyle = (errors, touched, focused) => {
    const baseStyle = {
      width: '100%',
      padding: '15px',
      fontSize: '16px',
      borderRadius: '8px',
      border: '1px solid',
      outline: 'none',
      transition: 'all 0.2s ease',
    };
    
    if (errors) {
      return {
        ...baseStyle,
        borderColor: 'var(--primary)',
        backgroundColor: 'rgba(255, 0, 60, 0.03)',
      };
    }
    
    if (focused) {
      return {
        ...baseStyle,
        borderColor: 'var(--purple-400)',
        boxShadow: '0 0 0 3px rgba(111, 68, 255, 0.1)',
      };
    }
    
    if (touched) {
      return {
        ...baseStyle,
        borderColor: 'var(--purple-200)',
      };
    }
    
    return {
      ...baseStyle,
      borderColor: '#e0e0e0',
    };
  };
  
  // Get card icon based on detected card type
  const getCardIcon = () => {
    const icons = {
      'visa': '💳 Visa',
      'mastercard': '💳 Mastercard',
      'american-express': '💳 Amex',
      'discover': '💳 Discover',
      'diners-club': '💳 Diners',
      'jcb': '💳 JCB',
      'unionpay': '💳 UnionPay',
      'maestro': '💳 Maestro',
      'mir': '💳 Mir',
      'elo': '💳 Elo',
      'hiper': '💳 Hiper',
      'hipercard': '💳 Hipercard'
    };
    
    return cardType && icons[cardType] ? icons[cardType] : '💳 Card';
  };
  
  return (
    <div
      style={{
        borderRadius: '24px',
        padding: '30px',
        backgroundColor: 'var(--neutral-50)',
        marginTop: '50px',
        marginBottom: '50px',
        boxShadow: '0 10px 30px rgba(111, 68, 255, 0.1)',
        border: '1px solid var(--purple-100)',
        position: 'relative',
      }}
    >
      {/* Back and cancel buttons */}
      <div style={{ 
        display: 'flex',
        gap: '10px',
        marginBottom: '20px'
      }}>
        <button
          onClick={handleBack}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            padding: '8px 16px',
            backgroundColor: 'transparent',
            border: '1px solid var(--neutral-300)',
            borderRadius: '20px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--neutral-100)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5"></path>
            <path d="M12 19l-7-7 7-7"></path>
          </svg>
          Back
        </button>
        
        <button
          onClick={() => {
            // Call onCancel if available, otherwise refresh page
            if (typeof onCancel === 'function') {
              onCancel();
            } else {
              window.location.reload();
            }
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            padding: '8px 16px',
            backgroundColor: 'transparent',
            border: '1px solid var(--primary)',
            borderRadius: '20px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            color: 'var(--primary)',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255, 0, 60, 0.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6L6 18"></path>
            <path d="M6 6l12 12"></path>
          </svg>
          Cancel Booking
        </button>
      </div>
      
      {/* Main content container */}
      <div style={{ 
        display: 'flex',
        flexDirection: 'row',
        gap: '30px',
        flexWrap: 'wrap'
      }}>
        {/* Left side - Payment form */}
        <div style={{ 
          flex: '1',
          minWidth: '300px',
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: '30px',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)',
        }}>
          {/* Progress tabs */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            marginBottom: '30px',
            width: '100%',
            position: 'relative'
          }}>
            {/* Progress bar */}
            <div style={{
              height: '4px',
              backgroundColor: '#e0e0e0',
              borderRadius: '2px',
              width: '100%',
              marginBottom: '20px',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* Active progress */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                height: '100%',
                width: currentStep === 'buyerInfo' ? '50%' : '100%',
                backgroundColor: 'var(--purple-600)',
                borderRadius: '2px',
                transition: 'width 0.5s ease-in-out'
              }} />
            </div>
            
            {/* Step indicators */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              width: '100%'
            }}>
              {/* Step 1 */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                width: '48%'
              }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: currentStep === 'buyerInfo' ? 'var(--purple-600)' : 
                                  (currentStep === 'paymentInfo' ? 'var(--purple-300)' : '#e0e0e0'),
                  color: currentStep === 'buyerInfo' ? 'white' : 
                        (currentStep === 'paymentInfo' ? 'white' : 'var(--neutral-600)'),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '700',
                  fontSize: '16px',
                  marginRight: '12px',
                  transition: 'all 0.3s ease',
                  boxShadow: currentStep === 'buyerInfo' ? '0 2px 8px rgba(111, 68, 255, 0.3)' : 'none'
                }}>
                  1
                </div>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column'
                }}>
                  <span style={{
                    fontSize: '15px',
                    fontWeight: '600',
                    color: currentStep === 'buyerInfo' ? 'var(--purple-600)' : 
                          (currentStep === 'paymentInfo' ? 'var(--purple-300)' : 'var(--neutral-600)'),
                    transition: 'color 0.3s ease'
                  }}>
                    BUYER INFORMATION
                  </span>
                  <span style={{
                    fontSize: '12px',
                    color: 'var(--neutral-500)',
                    marginTop: '2px'
                  }}>
                    Personal details
                  </span>
                </div>
              </div>
              
              {/* Step 2 */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                width: '48%'
              }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: currentStep === 'paymentInfo' ? 'var(--purple-600)' : '#e0e0e0',
                  color: currentStep === 'paymentInfo' ? 'white' : 'var(--neutral-600)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '700',
                  fontSize: '16px',
                  marginRight: '12px',
                  transition: 'all 0.3s ease',
                  boxShadow: currentStep === 'paymentInfo' ? '0 2px 8px rgba(111, 68, 255, 0.3)' : 'none'
                }}>
                  2
                </div>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column'
                }}>
                  <span style={{
                    fontSize: '15px',
                    fontWeight: '600',
                    color: currentStep === 'paymentInfo' ? 'var(--purple-600)' : 'var(--neutral-600)',
                    transition: 'color 0.3s ease'
                  }}>
                    PAYMENT DETAILS
                  </span>
                  <span style={{
                    fontSize: '12px',
                    color: 'var(--neutral-500)',
                    marginTop: '2px'
                  }}>
                    Card information
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Form fields change based on current step */}
          {currentStep === 'buyerInfo' ? (
            <form onSubmit={buyerInfoForm.handleSubmit(handleBuyerInfoSubmit)}>
              {/* First and Last Name */}
              <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
                <div style={{ flex: 1 }}>
                  <label 
                    htmlFor="firstName" 
                    style={{
                      display: 'block',
                      fontSize: '14px',
                      color: buyerInfoForm.formState.errors.firstName ? 'var(--primary)' : 'var(--neutral-500)',
                      marginBottom: '5px',
                      fontWeight: '500',
                      transition: 'color 0.2s ease',
                    }}
                  >
                    First Name
                  </label>
                  <input
                    id="firstName"
                    {...buyerInfoForm.register('firstName')}
                    autoComplete="given-name"
                    placeholder="John"
                    style={getInputStyle(
                      buyerInfoForm.formState.errors.firstName,
                      buyerInfoForm.formState.touchedFields.firstName,
                      buyerInfoForm.formState.dirtyFields.firstName
                    )}
                  />
                  {buyerInfoForm.formState.errors.firstName && (
                    <p style={{ 
                      color: 'var(--primary)', 
                      fontSize: '12px', 
                      marginTop: '5px',
                      fontWeight: '500'
                    }}>
                      {buyerInfoForm.formState.errors.firstName.message}
                    </p>
                  )}
                </div>
                
                <div style={{ flex: 1 }}>
                  <label 
                    htmlFor="lastName" 
                    style={{
                      display: 'block',
                      fontSize: '14px',
                      color: buyerInfoForm.formState.errors.lastName ? 'var(--primary)' : 'var(--neutral-500)',
                      marginBottom: '5px',
                      fontWeight: '500',
                      transition: 'color 0.2s ease',
                    }}
                  >
                    Last Name
                  </label>
                  <input
                    id="lastName"
                    {...buyerInfoForm.register('lastName')}
                    autoComplete="family-name"
                    placeholder="Doe"
                    style={getInputStyle(
                      buyerInfoForm.formState.errors.lastName,
                      buyerInfoForm.formState.touchedFields.lastName,
                      buyerInfoForm.formState.dirtyFields.lastName
                    )}
                  />
                  {buyerInfoForm.formState.errors.lastName && (
                    <p style={{ 
                      color: 'var(--primary)', 
                      fontSize: '12px', 
                      marginTop: '5px',
                      fontWeight: '500'
                    }}>
                      {buyerInfoForm.formState.errors.lastName.message}
                    </p>
                  )}
                </div>
              </div>
              
              {/* Phone Number with Country Code */}
              <div style={{ marginBottom: '20px' }}>
                <label 
                  htmlFor="phone" 
                  style={{
                    display: 'block',
                    fontSize: '14px',
                    color: buyerInfoForm.formState.errors.phone ? 'var(--primary)' : 'var(--neutral-500)',
                    marginBottom: '5px',
                    fontWeight: '500',
                    transition: 'color 0.2s ease',
                  }}
                >
                  Phone Number
                </label>
                <div style={{
                  border: `1px solid ${buyerInfoForm.formState.errors.phone ? 'var(--primary)' : '#e0e0e0'}`,
                  borderRadius: '8px',
                  overflow: 'hidden',
                  backgroundColor: buyerInfoForm.formState.errors.phone ? 'rgba(255, 0, 60, 0.03)' : 'white',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  {/* Country dropdown - Shows Flag + Country Code (e.g., 🇮🇳 IN) */}
                  <div 
                    className="country-select-wrapper"
                    style={{
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                      backgroundColor: '#f9f9f9',
                      borderRight: '1px solid #e0e0e0',
                      height: '50px',
                      width: '100px',
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '0 8px',
                      width: '100%',
                      height: '100%',
                      justifyContent: 'center'
                    }}>
                      {/* Flag */}
                      <span style={{ fontSize: '25px' }}>
                        <ReactCountryFlag 
                          countryCode={selectedCountry.code} 
                          svg 
                          style={{ 
                            width: '1.2em', 
                            height: '1.2em' 
                          }}
                          title={selectedCountry.name}
                        />
                      </span>
                      
                      {/* Country Code */}
                      <span style={{
                        fontSize: '18px',
                        color: 'var(--neutral-600)',
                        fontWeight: '500'
                      }}>
                        {selectedCountry.code}
                      </span>
                      
                      {/* Dropdown arrow */}
                      <svg 
                        width="10" 
                        height="10" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="var(--neutral-600)" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                        style={{
                          width: '1.2em', 
                          height: '1.2em'
                        }}
                      >
                        <path d="M6 9l6 6 6-6"></path>
                      </svg>
                    </div>
                    
                    {/* Hidden select element with full country names and dialing codes */}
                    <select
                      id="country-select" 
                      aria-label="Select country"
                      className="country-select"
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        height: '100%',
                        width: '100%',
                        opacity: 0,
                        cursor: 'pointer',
                        zIndex: 2
                      }}
                      value={selectedCountry.code}
                      onChange={(e) => {
                        const countryCode = e.target.value;
                        setSelectedCountry({
                          code: countryCode,
                          name: ISO31661a2.getCountry(countryCode) || countryCode
                        });
                        
                        // Update phone with new country code
                        try {
                          // Get current phone number (if any)
                          const currentPhone = buyerInfoForm.watch('phone') || '';
                          const dialCode = `+${getCountryCallingCode(countryCode)}`;
                          
                          if (currentPhone) {
                            // If we have an existing phone number, try to preserve the national part
                            try {
                              const parsed = parsePhoneNumber(currentPhone);
                              if (parsed && parsed.nationalNumber) {
                                // Create new phone number with selected country + existing national number
                                const newPhone = `${dialCode}${parsed.nationalNumber}`;
                                buyerInfoForm.setValue('phone', newPhone, { shouldValidate: true });
                              } else {
                                // If can't parse, just set the dial code
                                buyerInfoForm.setValue('phone', dialCode, { shouldValidate: true });
                              }
                            } catch (err) {
                              // If parsing fails, just set the dial code
                              buyerInfoForm.setValue('phone', dialCode, { shouldValidate: true });
                            }
                          } else {
                            // If no phone, initialize with the country's dial code
                            buyerInfoForm.setValue('phone', dialCode, { shouldValidate: true });
                          }
                        } catch (err) {
                          console.error("Error updating phone with new country code:", err);
                        }
                      }}
                    >
                      {/* Common countries first */}
                      <option value="AU">Australia, +61</option>
                      <option value="US">United States, +1</option>
                      <option value="GB">United Kingdom, +44</option>
                      <option value="CA">Canada, +1</option>
                      <option value="NZ">New Zealand, +64</option>
                      <option value="IN">India, +91</option>
                      <option value="SG">Singapore, +65</option>
                      <option value="DE">Germany, +49</option>
                      <option value="FR">France, +33</option>
                      <option value="JP">Japan, +81</option>
                      
                      {/* Other countries alphabetically */}
                      <option value="AF">Afghanistan, +93</option>
                      <option value="AL">Albania, +355</option>
                      <option value="DZ">Algeria, +213</option>
                      <option value="AR">Argentina, +54</option>
                      <option value="AT">Austria, +43</option>
                      <option value="BH">Bahrain, +973</option>
                      <option value="BD">Bangladesh, +880</option>
                      <option value="BE">Belgium, +32</option>
                      <option value="BR">Brazil, +55</option>
                      <option value="BG">Bulgaria, +359</option>
                      <option value="KH">Cambodia, +855</option>
                      <option value="CL">Chile, +56</option>
                      <option value="CN">China, +86</option>
                      <option value="CO">Colombia, +57</option>
                      <option value="HR">Croatia, +385</option>
                      <option value="CY">Cyprus, +357</option>
                      <option value="CZ">Czech Republic, +420</option>
                      <option value="DK">Denmark, +45</option>
                      <option value="EG">Egypt, +20</option>
                      <option value="EE">Estonia, +372</option>
                      <option value="FI">Finland, +358</option>
                      <option value="GR">Greece, +30</option>
                      <option value="HK">Hong Kong, +852</option>
                      <option value="HU">Hungary, +36</option>
                      <option value="IS">Iceland, +354</option>
                      <option value="ID">Indonesia, +62</option>
                      <option value="IE">Ireland, +353</option>
                      <option value="IL">Israel, +972</option>
                      <option value="IT">Italy, +39</option>
                      <option value="JO">Jordan, +962</option>
                      <option value="KE">Kenya, +254</option>
                      <option value="KW">Kuwait, +965</option>
                      <option value="LV">Latvia, +371</option>
                      <option value="LB">Lebanon, +961</option>
                      <option value="LT">Lithuania, +370</option>
                      <option value="LU">Luxembourg, +352</option>
                      <option value="MY">Malaysia, +60</option>
                      <option value="MV">Maldives, +960</option>
                      <option value="MT">Malta, +356</option>
                      <option value="MX">Mexico, +52</option>
                      <option value="MA">Morocco, +212</option>
                      <option value="NL">Netherlands, +31</option>
                      <option value="NG">Nigeria, +234</option>
                      <option value="NO">Norway, +47</option>
                      <option value="OM">Oman, +968</option>
                      <option value="PK">Pakistan, +92</option>
                      <option value="PH">Philippines, +63</option>
                      <option value="PL">Poland, +48</option>
                      <option value="PT">Portugal, +351</option>
                      <option value="QA">Qatar, +974</option>
                      <option value="RO">Romania, +40</option>
                      <option value="RU">Russian Federation, +7</option>
                      <option value="SA">Saudi Arabia, +966</option>
                      <option value="RS">Serbia, +381</option>
                      <option value="ZA">South Africa, +27</option>
                      <option value="ES">Spain, +34</option>
                      <option value="LK">Sri Lanka, +94</option>
                      <option value="SE">Sweden, +46</option>
                      <option value="CH">Switzerland, +41</option>
                      <option value="TW">Taiwan, +886</option>
                      <option value="TH">Thailand, +66</option>
                      <option value="TR">Turkey, +90</option>
                      <option value="UA">Ukraine, +380</option>
                      <option value="AE">United Arab Emirates, +971</option>
                      <option value="VN">Vietnam, +84</option>
                    </select>
                  </div>
                  
                  {/* Phone input - without country select */}
                  <input
                    id="phone"
                    type="tel"
                    {...buyerInfoForm.register('phone')}
                    autoComplete="tel"
                    placeholder="Enter phone number"
                    style={{
                      flex: 1,
                      border: 'none',
                      fontSize: '16px',
                      padding: '15px',
                      outline: 'none',
                      width: '100%',
                      height: '50px',
                      backgroundColor: 'transparent',
                    }}
                  />
                </div>
                {buyerInfoForm.formState.errors.phone && (
                  <p style={{ 
                    color: 'var(--primary)', 
                    fontSize: '12px', 
                    marginTop: '5px',
                    fontWeight: '500'
                  }}>
                    {buyerInfoForm.formState.errors.phone.message}
                  </p>
                )}
                <p style={{
                  fontSize: '12px',
                  color: 'var(--neutral-600)',
                  marginTop: '4px',
                }}>
                  Format example: {selectedCountry.code 
                    ? `+${getCountryCallingCode(selectedCountry.code)} XXX XXX XXXX` 
                    : '+61 XXX XXX XXX'
                  }
                </p>
              </div>
              
              {/* Email */}
              <div style={{ marginBottom: '30px' }}>
                <label 
                  htmlFor="email" 
                  style={{
                    display: 'block',
                    fontSize: '14px',
                    color: buyerInfoForm.formState.errors.email ? 'var(--primary)' : 'var(--neutral-500)',
                    marginBottom: '5px',
                    fontWeight: '500',
                    transition: 'color 0.2s ease',
                  }}
                >
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  {...buyerInfoForm.register('email')}
                  autoComplete="email"
                  placeholder="your.email@example.com"
                  style={getInputStyle(
                    buyerInfoForm.formState.errors.email,
                    buyerInfoForm.formState.touchedFields.email,
                    buyerInfoForm.formState.dirtyFields.email
                  )}
                />
                {buyerInfoForm.formState.errors.email && (
                  <p style={{ 
                    color: 'var(--primary)', 
                    fontSize: '12px', 
                    marginTop: '5px',
                    fontWeight: '500'
                  }}>
                    {buyerInfoForm.formState.errors.email.message}
                  </p>
                )}
              </div>
              
              {/* Form error */}
              {buyerInfoForm.formState.errors.root && (
                <div style={{
                  backgroundColor: 'rgba(255, 0, 60, 0.05)',
                  border: '1px solid var(--primary)',
                  color: 'var(--primary)',
                  padding: '10px 15px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  marginBottom: '20px',
                }}>
                  {buyerInfoForm.formState.errors.root.message}
                </div>
              )}
              
              {/* Login prompt for non-authenticated users */}
              {!isAuthenticated() && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '25px',
                  padding: '10px 15px',
                  backgroundColor: 'var(--purple-50)',
                  border: '1px dashed var(--purple-200)',
                  borderRadius: '10px',
                }}>
                  <div style={{ flex: 1 }}>
                    <p style={{ 
                      margin: '0 0 5px 0',
                      fontWeight: '600',
                      color: 'var(--purple-700)',
                      fontSize: '14px'
                    }}>
                      You're not logged in
                    </p>
                    <p style={{ 
                      margin: 0,
                      color: 'var(--neutral-600)',
                      fontSize: '14px'
                    }}>
                      Login for faster checkout and to save your ticket history
                    </p>
                  </div>
                  <button
                    onClick={() => navigate('/login', { state: { from: `/events/${event.id}` } })}
                    style={{
                      backgroundColor: 'var(--purple-600)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '8px 16px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--purple-700)';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--purple-600)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    Login
                  </button>
                </div>
              )}
              
              {/* Show message if data was pre-filled from Google login */}
              {isAuthenticated() && currentUser && currentUser.provider === 'google' && (
                <div style={{
                  backgroundColor: 'rgba(52, 168, 83, 0.05)',
                  border: '1px solid #34A853',
                  color: '#34A853',
                  padding: '10px 15px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  marginBottom: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                  <span>Your information was pre-filled from your Google account</span>
                </div>
              )}
              
              {/* Show message if user is not authenticated through Google */}
              {isAuthenticated() && currentUser && currentUser.provider !== 'google' && (
                <div style={{
                  backgroundColor: 'rgba(111, 68, 255, 0.05)',
                  border: '1px solid var(--purple-300)',
                  color: 'var(--purple-700)',
                  padding: '10px 15px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  marginBottom: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                  <span>Your information was pre-filled from your TixMojo account</span>
                </div>
              )}
              
              {/* Next button */}
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  type="submit"
                  disabled={isFormSubmitting || !buyerInfoForm.formState.isValid}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    backgroundColor: isFormSubmitting || !buyerInfoForm.formState.isValid ? 'var(--neutral-200)' : 'var(--primary)',
                    color: 'white',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    fontWeight: '600',
                    fontSize: '16px',
                    cursor: isFormSubmitting || !buyerInfoForm.formState.isValid ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    if (!isFormSubmitting && buyerInfoForm.formState.isValid) {
                      e.currentTarget.style.backgroundColor = '#e50036';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = isFormSubmitting || !buyerInfoForm.formState.isValid ? 'var(--neutral-200)' : 'var(--primary)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  Continue to Payment
                  {isFormSubmitting ? (
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
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14"></path>
                      <path d="M12 5l7 7-7 7"></path>
                    </svg>
                  )}
                </button>
              </div>
              
              {/* Data protection notice */}
              <div style={{
                marginTop: '25px',
                padding: '15px',
                backgroundColor: 'var(--neutral-50)',
                borderRadius: '8px',
                fontSize: '13px',
                color: 'var(--neutral-600)',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px',
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: '2px' }}>
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
                <span>
                  Your personal details are protected and will only be used to process your ticket purchase. 
                  We use bank-level encryption and never store your full payment details.
                </span>
              </div>
            </form>
          ) : (
            <form onSubmit={paymentInfoForm.handleSubmit(handlePaymentInfoSubmit)}>
              {/* Cardholder Name */}
              <div style={{ marginBottom: '20px' }}>
                <label 
                  htmlFor="cardholderName" 
                  style={{
                    display: 'block',
                    fontSize: '14px',
                    color: paymentInfoForm.formState.errors.cardholderName ? 'var(--primary)' : 'var(--neutral-500)',
                    marginBottom: '5px',
                    fontWeight: '500',
                    transition: 'color 0.2s ease',
                  }}
                >
                  Cardholder Name
                </label>
                <input
                  id="cardholderName"
                  {...paymentInfoForm.register('cardholderName')}
                  autoComplete="cc-name"
                  placeholder="Name on card"
                  style={getInputStyle(
                    paymentInfoForm.formState.errors.cardholderName,
                    paymentInfoForm.formState.touchedFields.cardholderName,
                    paymentInfoForm.formState.dirtyFields.cardholderName
                  )}
                />
                {paymentInfoForm.formState.errors.cardholderName && (
                  <p style={{ 
                    color: 'var(--primary)', 
                    fontSize: '12px', 
                    marginTop: '5px',
                    fontWeight: '500'
                  }}>
                    {paymentInfoForm.formState.errors.cardholderName.message}
                  </p>
                )}
              </div>
              
              {/* Card Number */}
              <div style={{ marginBottom: '20px' }}>
                <label 
                  htmlFor="cardNumber" 
                  style={{
                    display: 'block',
                    fontSize: '14px',
                    color: paymentInfoForm.formState.errors.cardNumber ? 'var(--primary)' : 'var(--neutral-500)',
                    marginBottom: '5px',
                    fontWeight: '500',
                    transition: 'color 0.2s ease',
                  }}
                >
                  Card Number
                </label>
                <div style={{
                  position: 'relative',
                }}>
                  <Cleave
                    id="cardNumber"
                    options={{
                      creditCard: true,
                      delimiter: ' ',
                    }}
                    placeholder="1234 5678 9012 3456"
                    autoComplete="cc-number"
                    {...paymentInfoForm.register('cardNumber')}
                    onChange={(e) => {
                      paymentInfoForm.setValue('cardNumber', e.target.value);
                      handleCardNumberChange(e);
                    }}
                    style={{
                      ...getInputStyle(
                        paymentInfoForm.formState.errors.cardNumber,
                        paymentInfoForm.formState.touchedFields.cardNumber,
                        paymentInfoForm.formState.dirtyFields.cardNumber
                      ),
                      paddingRight: '60px', // Space for the card icon
                    }}
                  />
                  <div style={{
                    position: 'absolute',
                    right: '15px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--neutral-500)',
                    fontSize: '14px',
                    pointerEvents: 'none',
                  }}>
                    {cardType && getCardIcon()}
                  </div>
                </div>
                {paymentInfoForm.formState.errors.cardNumber && (
                  <p style={{ 
                    color: 'var(--primary)', 
                    fontSize: '12px', 
                    marginTop: '5px',
                    fontWeight: '500'
                  }}>
                    {paymentInfoForm.formState.errors.cardNumber.message}
                  </p>
                )}
                
                {/* Security score indicator (only show once some digits are entered) */}
                {paymentInfoForm.watch('cardNumber') && paymentInfoForm.watch('cardNumber').length > 8 && (
                  <div style={{ 
                    marginTop: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                  }}>
                    <div style={{
                      height: '4px',
                      flex: 1,
                      backgroundColor: '#e0e0e0',
                      borderRadius: '2px',
                      overflow: 'hidden',
                    }}>
                      <div 
                        style={{
                          height: '100%',
                          width: `${cardSecurityScore * 25}%`,
                          backgroundColor: cardSecurityScore < 2 ? '#ff5757' : 
                                          cardSecurityScore < 3 ? '#ffb347' : 
                                          cardSecurityScore < 4 ? '#4caf50' : '#2e7d32',
                          transition: 'width 0.3s ease, background-color 0.3s ease',
                        }}
                      />
                    </div>
                    <span style={{
                      fontSize: '12px',
                      fontWeight: '500',
                      color: cardSecurityScore < 2 ? '#ff5757' : 
                              cardSecurityScore < 3 ? '#ffb347' : 
                              cardSecurityScore < 4 ? '#4caf50' : '#2e7d32',
                    }}>
                      {cardSecurityScore < 2 ? 'Weak' : 
                      cardSecurityScore < 3 ? 'OK' : 
                      cardSecurityScore < 4 ? 'Good' : 'Strong'}
                    </span>
                  </div>
                )}
              </div>
              
              {/* Expiry Date and CVV */}
              <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
                <div style={{ flex: 1 }}>
                  <label 
                    htmlFor="expiryDate" 
                    style={{
                      display: 'block',
                      fontSize: '14px',
                      color: paymentInfoForm.formState.errors.expiryDate ? 'var(--primary)' : 'var(--neutral-500)',
                      marginBottom: '5px',
                      fontWeight: '500',
                      transition: 'color 0.2s ease',
                    }}
                  >
                    Expiry Date
                  </label>
                  <Cleave
                    id="expiryDate"
                    options={{
                      date: true,
                      datePattern: ['m', 'y'],
                      delimiter: '/',
                    }}
                    placeholder="MM/YY"
                    autoComplete="cc-exp"
                    {...paymentInfoForm.register('expiryDate')}
                    onChange={(e) => {
                      paymentInfoForm.setValue('expiryDate', e.target.value);
                    }}
                    style={getInputStyle(
                      paymentInfoForm.formState.errors.expiryDate,
                      paymentInfoForm.formState.touchedFields.expiryDate,
                      paymentInfoForm.formState.dirtyFields.expiryDate
                    )}
                  />
                  {paymentInfoForm.formState.errors.expiryDate && (
                    <p style={{ 
                      color: 'var(--primary)', 
                      fontSize: '12px', 
                      marginTop: '5px',
                      fontWeight: '500'
                    }}>
                      {paymentInfoForm.formState.errors.expiryDate.message}
                    </p>
                  )}
                </div>
                
                <div style={{ flex: 1 }}>
                  <label 
                    htmlFor="cvv" 
                    style={{
                      display: 'block',
                      fontSize: '14px',
                      color: paymentInfoForm.formState.errors.cvv ? 'var(--primary)' : 'var(--neutral-500)',
                      marginBottom: '5px',
                      fontWeight: '500',
                      transition: 'color 0.2s ease',
                    }}
                  >
                    CVV / CVC
                  </label>
                  <Cleave
                    id="cvv"
                    options={{
                      blocks: [3],
                      numericOnly: true,
                    }}
                    placeholder="123"
                    autoComplete="cc-csc"
                    {...paymentInfoForm.register('cvv')}
                    onChange={(e) => {
                      paymentInfoForm.setValue('cvv', e.target.value);
                    }}
                    style={getInputStyle(
                      paymentInfoForm.formState.errors.cvv,
                      paymentInfoForm.formState.touchedFields.cvv,
                      paymentInfoForm.formState.dirtyFields.cvv
                    )}
                  />
                  {paymentInfoForm.formState.errors.cvv && (
                    <p style={{ 
                      color: 'var(--primary)', 
                      fontSize: '12px', 
                      marginTop: '5px',
                      fontWeight: '500'
                    }}>
                      {paymentInfoForm.formState.errors.cvv.message}
                    </p>
                  )}
                </div>
              </div>
              
              {/* ZIP/Postal Code */}
              <div style={{ marginBottom: '30px' }}>
                <label 
                  htmlFor="zipCode" 
                  style={{
                    display: 'block',
                    fontSize: '14px',
                    color: paymentInfoForm.formState.errors.zipCode ? 'var(--primary)' : 'var(--neutral-500)',
                    marginBottom: '5px',
                    fontWeight: '500',
                    transition: 'color 0.2s ease',
                  }}
                >
                  ZIP / Postal Code
                </label>
                <input
                  id="zipCode"
                  {...paymentInfoForm.register('zipCode')}
                  autoComplete="postal-code"
                  placeholder="ZIP / Postal Code"
                  style={getInputStyle(
                    paymentInfoForm.formState.errors.zipCode,
                    paymentInfoForm.formState.touchedFields.zipCode,
                    paymentInfoForm.formState.dirtyFields.zipCode
                  )}
                />
                {paymentInfoForm.formState.errors.zipCode && (
                  <p style={{ 
                    color: 'var(--primary)', 
                    fontSize: '12px', 
                    marginTop: '5px',
                    fontWeight: '500'
                  }}>
                    {paymentInfoForm.formState.errors.zipCode.message}
                  </p>
                )}
              </div>
              
              {/* Form error */}
              {paymentInfoForm.formState.errors.root && (
                <div style={{
                  backgroundColor: 'rgba(255, 0, 60, 0.05)',
                  border: '1px solid var(--primary)',
                  color: 'var(--primary)',
                  padding: '10px 15px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  marginBottom: '20px',
                }}>
                  {paymentInfoForm.formState.errors.root.message}
                </div>
              )}
              
              {/* Payment button */}
              <button
                type="submit"
                disabled={isFormSubmitting || !paymentInfoForm.formState.isValid}
                style={{
                  width: '100%',
                  backgroundColor: isFormSubmitting || !paymentInfoForm.formState.isValid ? 'var(--neutral-200)' : 'var(--primary)',
                  color: 'white',
                  padding: '16px',
                  borderRadius: '8px',
                  border: 'none',
                  fontSize: '16px',
                  fontWeight: '700',
                  cursor: isFormSubmitting || !paymentInfoForm.formState.isValid ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                }}
                onMouseEnter={(e) => {
                  if (!isFormSubmitting && paymentInfoForm.formState.isValid) {
                    e.currentTarget.style.backgroundColor = '#e50036';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(255, 0, 60, 0.25)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = isFormSubmitting || !paymentInfoForm.formState.isValid ? 'var(--neutral-200)' : 'var(--primary)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {isFormSubmitting ? (
                  <>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ animation: 'spin 1s linear infinite' }}>
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" strokeDasharray="40 20" />
                    </svg>
                    Processing Payment...
                  </>
                ) : (
                  <>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                      <line x1="1" y1="10" x2="23" y2="10"></line>
                    </svg>
                    Pay ${(totalAmount + 10 - (totalAmount * discount)).toFixed(2)}
                  </>
                )}
              </button>
              
              {/* Secure payment notice */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                marginTop: '15px',
                color: 'var(--neutral-500)',
                fontSize: '13px',
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
                Secure Payment | SSL Encrypted
              </div>
              
              {/* Supported payment methods */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                marginTop: '20px',
                flexWrap: 'wrap',
              }}>
                <span style={{ color: 'var(--neutral-400)', fontSize: '24px' }}>💳</span>
                <span style={{ color: 'var(--neutral-400)', fontSize: '24px' }}>💳</span>
                <span style={{ color: 'var(--neutral-400)', fontSize: '24px' }}>💳</span>
                <span style={{ color: 'var(--neutral-400)', fontSize: '24px' }}>💳</span>
                <span style={{ color: 'var(--neutral-400)', fontSize: '24px' }}>💳</span>
              </div>
            </form>
          )}
          
          {/* Terms and conditions */}
          <div style={{ 
            marginTop: '30px',
            textAlign: 'center',
            fontSize: '14px',
            color: 'var(--neutral-600)'
          }}>
            By clicking 'BOOK', you agree to TixMojo's <a href="#" style={{ 
              color: 'var(--primary)',
              textDecoration: 'none',
              fontWeight: '500'
            }}>Terms of Service</a>.
          </div>
        </div>
        
        {/* Right side - Order summary */}
        <div style={{ 
          width: '300px',
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: '20px',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)',
          height: 'fit-content',
        }}>
          {/* Timer display - Using same design as TicketSelection */}
          <div style={{
            position: 'relative',
            width: '100%',
            zIndex: 5,
            background: 'linear-gradient(135deg, var(--purple-100), var(--purple-200))',
            borderRadius: '10px',
            padding: '10px 15px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
            marginBottom: '20px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--purple-800)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10 2h4a2 2 0 0 1 2 2v2H8V4a2 2 0 0 1 2-2z"></path>
                <path d="M8 4L6 7.5 8 10 6 13.5 8 16l-2 3.5 2 2.5"></path>
                <path d="M16 4l2 3.5-2 2.5 2 3.5-2 2.5 2 3.5-2 2.5"></path>
                <rect x="4" y="18" width="16" height="4" rx="2"></rect>
              </svg>
              <span style={{
                fontSize: '16px',
                fontWeight: '700',
                color: 'var(--purple-800)'
              }}>
                Session Expires In
              </span>
            </div>
            
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              fontFamily: 'var(--font-heading)',
              animation: isAlmostExpired ? 'pulse 1.5s infinite' : 'none'
            }}>
              <span style={{
                background: 'var(--purple-600)',
                color: 'white',
                borderRadius: '6px',
                padding: '5px 8px',
                fontSize: '18px',
                fontWeight: '700',
                minWidth: '36px',
                textAlign: 'center',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}>
                {String(timeLeft.minutes).padStart(2, '0')}
              </span>
              <span style={{ 
                color: 'var(--purple-900)', 
                fontWeight: '700',
                fontSize: '18px'
              }}>:</span>
              <span style={{
                background: 'var(--purple-600)',
                color: 'white',
                borderRadius: '6px',
                padding: '5px 8px',
                fontSize: '18px',
                fontWeight: '700',
                minWidth: '36px',
                textAlign: 'center',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}>
                {String(timeLeft.seconds).padStart(2, '0')}
              </span>
            </div>
          </div>
          
          {/* Cart items */}
          <div style={{
            maxHeight: '300px',
            overflowY: 'auto',
            marginBottom: '20px',
            borderBottom: '1px solid var(--neutral-200)',
            paddingBottom: '10px',
          }}>
            {cartItems.map((item, index) => (
              <div key={index} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '10px 0',
                borderBottom: index !== cartItems.length - 1 ? '1px solid var(--neutral-100)' : 'none',
              }}>
                <div>
                  <div style={{ fontWeight: '500', marginBottom: '2px' }}>
                    {item.ticket.name} - {item.quantity > 1 ? `${item.quantity} ENTRIES` : '1 ENTRY'}
                  </div>
                  <div style={{ 
                    fontSize: '14px',
                    color: 'var(--neutral-600)',
                  }}>
                    {parseFloat(item.ticket.price).toFixed(2)} {item.ticket.currency}
                    <span style={{ 
                      color: 'var(--primary)',
                      marginLeft: '5px',
                      fontWeight: '500'
                    }}>
                      × {item.quantity}
                    </span>
                  </div>
                </div>
                
                <button
                  disabled={true} // Disabled in payment view
                  style={{
                    backgroundColor: 'transparent',
                    border: 'none',
                    color: 'var(--primary)',
                    cursor: 'not-allowed',
                    opacity: 0.5,
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 6L6 18"></path>
                    <path d="M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
            ))}
          </div>
          
          {/* Order summary */}
          <div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '14px',
              marginBottom: '8px',
            }}>
              <span>Tickets Selected</span>
              <span style={{ fontWeight: '600' }}>
                {cartItems.reduce((total, item) => total + item.quantity, 0)}
              </span>
            </div>
            
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '14px',
              marginBottom: '8px',
            }}>
              <span>Subtotal</span>
              <span style={{ fontWeight: '600' }}>
                ${totalAmount.toFixed(2)}
              </span>
            </div>
            
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '14px',
              marginBottom: '8px',
            }}>
              <span>Service Fee <span style={{ opacity: 0.7 }}>ⓘ</span></span>
              <span style={{ fontWeight: '600' }}>
                $10.00
              </span>
            </div>
            
            {discount > 0 && (
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '14px',
                marginBottom: '8px',
                color: 'var(--primary)',
              }}>
                <span>Discount</span>
                <span style={{ fontWeight: '600' }}>
                  -${(totalAmount * discount).toFixed(2)}
                </span>
              </div>
            )}
            
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '16px',
              fontWeight: '700',
              marginTop: '15px',
              padding: '10px 0',
              borderTop: '1px solid var(--neutral-200)',
            }}>
              <span>Total</span>
              <span>
                ${(totalAmount + 10 - (totalAmount * discount)).toFixed(2)}
              </span>
            </div>
          </div>
          
          {/* Secure checkout badge */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            marginTop: '20px',
            fontSize: '12px',
            color: 'var(--neutral-500)',
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
            Secure Checkout
          </div>
        </div>
      </div>
      
      {/* Animation keyframes and custom styles */}
      <style>
        {`
          @keyframes spin {
            100% {
              transform: rotate(360deg);
            }
          }
          
          @keyframes slideIn {
            0% {
              opacity: 0;
              transform: translateY(10px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes fadeIn {
            0% {
              opacity: 0;
            }
            100% {
              opacity: 1;
            }
          }
          
          @keyframes pulse {
            0% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.9; transform: scale(1.02); }
            100% { opacity: 1; transform: scale(1); }
          }
          
          /* Custom styles for react-phone-number-input */
          .PhoneInput {
            display: flex;
            align-items: center;
          }
          
          .PhoneInputCountry {
            position: relative;
            display: flex;
            align-items: center;
            padding: 0 15px;
            background-color: #f9f9f9;
            border-right: 1px solid #e0e0e0;
            min-width: 90px;
          }
          
          .PhoneInputCountryIcon {
            margin-right: 0;
            display: flex;
            align-items: center;
            gap: 4px;
          }
          
          .PhoneInputCountrySelectArrow {
            margin-left: 6px;
            opacity: 0.7;
          }
          
          .PhoneInputInput {
            flex: 1;
            border: none;
            padding: 15px;
            font-size: 16px;
            outline: none;
            background-color: transparent;
          }
          
          .PhoneInputInput:focus {
            outline: none;
          }
          
          .PhoneInputInput:focus ~ .PhoneInputCountry {
            background-color: var(--purple-50);
          }
          
          /* Styles for our custom country select */
          .country-select-wrapper {
            position: relative;
            z-index: 1;
            transition: background-color 0.2s ease;
          }
          
          .country-select-wrapper:hover {
            background-color: #f0f0f0;
          }
          
          .country-select-wrapper:focus-within {
            background-color: var(--purple-50);
          }
          
          .country-select {
            font-family: var(--font-body, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif);
            font-size: 14px;
          }
          
          .country-select option {
            padding: 8px;
            font-size: 14px;
          }
          
          /* Mobile optimizations */
          @media (max-width: 768px) {
            .country-select-wrapper {
              min-width: 70px;
              max-width: 70px;
            }
          }
        `}
      </style>
    </div>
  );
};

export default PaymentPortal;