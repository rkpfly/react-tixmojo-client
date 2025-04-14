import React, { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Cleave from 'cleave.js/react';
import zxcvbn from 'zxcvbn';
import ISO31661a2 from 'iso-3166-1-alpha-2';
import creditCardType from 'credit-card-type';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { parsePhoneNumber } from 'libphonenumber-js';
import { getCountryCallingCode } from 'react-phone-number-input';
import ReactCountryFlag from 'react-country-flag';
// Import the new phone validation component
import PhoneInputWithValidation from './PhoneInputWithValidation';
// Import Stripe payment form
import StripePaymentFormDefault, { StripePaymentForm } from './StripePaymentForm';
// Use the default export, but fallback to named export if needed
const StripePaymentComponent = StripePaymentFormDefault || StripePaymentForm;
// Import Stripe service
import stripeService from '../../services/stripeService';
// Alternative payment service for dev mode
import paymentService from '../../services/paymentService';
// Import phone validation utilities
import { createPhoneValidationSchema } from '../../utils/phoneValidation';
// Import styles
import '../../Style/paymentPortal.css';

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

  // Use the phone validation schema from our utilities
  ...createPhoneValidationSchema('phone').fields
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

  // Mobile window width state
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Mobile cart popup state
  const [showCartPopup, setShowCartPopup] = useState(false);

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
    mode: 'onChange', // Change from onBlur to onChange to validate on every change
    reValidateMode: 'onChange',
    defaultValues: getDefaultValues(),
    context: {
      selectedCountry: selectedCountry,
      requireMobile: false, // Set to true if you want to require mobile phones only
      enforceCountryMatch: false // Set to true to enforce that the phone number matches the selected country
    }
  });

  // Update form values when currentUser changes
  useEffect(() => {
    if (isAuthenticated() && currentUser) {
      const defaultValues = getDefaultValues();

      // If we have a phone number from auth, try to detect country
      if (defaultValues.phone && defaultValues.phone.startsWith('+')) {
        try {
          const parsed = parsePhoneNumber(defaultValues.phone);
          if (parsed && parsed.country) {
            // Update selected country from the phone number
            setSelectedCountry({
              code: parsed.country,
              name: ISO31661a2.getCountry(parsed.country) || parsed.country
            });
            console.log(`Auto-detected country from auth: ${parsed.country}`);
          }
        } catch (err) {
          console.log("Could not parse country from auth phone number");
        }
      }

      // Reset form with new values and update context
      buyerInfoForm.reset(defaultValues, {
        keepValues: false,
        keepDirty: false,
        keepErrors: false,
        keepIsSubmitted: false,
        keepTouched: false,
        keepIsValid: false,
        keepSubmitCount: false,
        keepDirtyValues: false
      });

      // Update form context with current country
      buyerInfoForm.formState.context = {
        ...buyerInfoForm.formState.context,
        selectedCountry: selectedCountry
      };

      console.log("Updated form with user data:", defaultValues);

      // Validate only the fields that have values
      const validationTimer = setTimeout(() => {
        // Only validate fields that have values
        Object.keys(defaultValues).forEach(fieldName => {
          if (defaultValues[fieldName]) {
            buyerInfoForm.trigger(fieldName);
          }
        });
      }, 300);

      // Clean up the timer if component unmounts before timeout
      return () => {
        if (validationTimer) {
          clearTimeout(validationTimer);
        }
      };
    }
  }, [currentUser, isAuthenticated]);

  // Update form context when selected country changes
  useEffect(() => {
    try {
      if (buyerInfoForm) {
        // This updates the context for validation
        buyerInfoForm.formState.context = {
          ...buyerInfoForm.formState.context,
          selectedCountry: selectedCountry
        };

        // Re-validate phone field if it has a value
        const phoneValue = buyerInfoForm.getValues('phone');
        if (phoneValue) {
          buyerInfoForm.trigger('phone');
        }
      }
    } catch (err) {
      console.error("Error updating form context with new country:", err);
    }
  }, [selectedCountry.code]);

  // Window resize handler for responsive design
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    // Clean up
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Handle browser auto-fill detection
  useEffect(() => {
    // Initialize the timer variable
    let timer;

    // Set up listeners to detect browser auto-fill
    const phoneField = document.getElementById('phone');
    const emailField = document.getElementById('email');
    const firstNameField = document.getElementById('firstName');
    const lastNameField = document.getElementById('lastName');

    // Function to check if field was auto-filled and trigger validation
    const handleAutofill = (e) => {
      // Most browsers change background color on autofill
      const computedStyle = window.getComputedStyle(e.target);
      const isAutofilled = computedStyle.animationName === 'autofill' ||
        computedStyle.animationName === 'onAutoFillStart' ||
        (e.target.value && !e.target.dataset.userTyped);

      if (isAutofilled) {
        console.log("Detected browser autofill on:", e.target.id);

        // For phone numbers, try to extract country
        if (e.target.id === 'phone' && e.target.value && e.target.value.startsWith('+')) {
          try {
            const parsed = parsePhoneNumber(e.target.value);
            if (parsed && parsed.country) {
              // Update selected country from the phone number
              setSelectedCountry({
                code: parsed.country,
                name: ISO31661a2.getCountry(parsed.country) || parsed.country
              });
            }
          } catch (err) {
            // Could not parse country from auto-filled phone
          }
        }

        // Validate only this field after a short delay
        setTimeout(() => {
          buyerInfoForm.trigger(e.target.id);
        }, 100);
      }
    };

    // Track user typing to distinguish from autofill
    const trackUserTyping = (e) => {
      e.target.dataset.userTyped = 'true';
    };

    // Add listeners
    const fields = [phoneField, emailField, firstNameField, lastNameField];
    fields.forEach(field => {
      if (field) {
        field.addEventListener('input', handleAutofill);
        field.addEventListener('keydown', trackUserTyping);
        field.addEventListener('change', handleAutofill);

        // Animation-based autofill detection (works in Chrome)
        const animationStartListener = (e) => {
          if (e.animationName === 'onAutoFillStart') {
            handleAutofill({ target: field });
          }
        };
        field.addEventListener('animationstart', animationStartListener);
      }
    });

    // Clean up listeners on unmount
    return () => {
      if (timer) {
        clearTimeout(timer);
      }

      fields.forEach(field => {
        if (field) {
          field.removeEventListener('input', handleAutofill);
          field.removeEventListener('keydown', trackUserTyping);
          field.removeEventListener('change', handleAutofill);
          // Use a named function reference for animationstart to properly remove it
          field.removeEventListener('animationstart', handleAutofill);
        }
      });
    };
  }, []);

  // Check if Stripe is configured
  useEffect(() => {
    // Check if Stripe is configured
    const stripeConfigured = stripeService.isStripeConfigured();
    setIsStripeEnabled(stripeConfigured);

    // Initialize payment session
    const initSession = async () => {
      try {
        // Select the appropriate service based on whether Stripe is configured
        const service = stripeConfigured ? stripeService : paymentService;

        console.log("Initializing payment session with service:", stripeConfigured ? "Stripe" : "Alternative");

        // Call the appropriate service to initialize the payment session
        const response = await service.initializePaymentSession(cartItems, event);

        if (response && response.sessionId) {
          setSessionId(response.sessionId);
          console.log("Payment session initialized successfully:", response.sessionId);
        } else {
          console.error("Payment session initialization did not return a sessionId");
        }
      } catch (error) {
        console.error("Error initializing payment session:", error);

        // Let's give more useful error message for common issues
        if (error.message && error.message.includes("is not a function")) {
          console.error("API method error. Make sure the API service is properly configured with HTTP methods.");
        }

        // Provide debug info for the session initialization
        try {
          console.log("Debug info - cartItems:", cartItems);
          console.log("Debug info - event:", event?.id);
          console.log("Debug info - isStripeEnabled:", stripeConfigured);
        } catch (debugError) {
          console.error("Error logging debug info:", debugError);
        }
      }
    };

    // Only initialize if we have items and an event
    if (cartItems && cartItems.length > 0 && event) {
      initSession();
    } else {
      console.log("Skipping payment session initialization - missing cartItems or event");
    }
  }, [cartItems, event]);

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

  // State for payment session
  const [sessionId, setSessionId] = useState(null);

  // State to track if Stripe is configured
  const [isStripeEnabled, setIsStripeEnabled] = useState(false);

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
  const handleBuyerInfoSubmit = async (data, event) => {
    // React Hook Form passes data as first argument and event as second
    if (event && typeof event.preventDefault === 'function') {
      event.preventDefault();
    }

    if (isFormSubmitting) return;

    // Validate all fields at once before submission
    const isValid = await buyerInfoForm.trigger();

    if (!isValid) {
      console.log("Form validation failed");
      return;
    }

    setIsFormSubmitting(true);

    try {
      // Get the form data after validation
      const data = buyerInfoForm.getValues();

      // Try to extract country from phone number for better tracking
      let phoneCountry = selectedCountry.code;
      try {
        if (data.phone && data.phone.startsWith('+')) {
          const parsed = parsePhoneNumber(data.phone);
          if (parsed && parsed.country) {
            phoneCountry = parsed.country;

            // Update selected country if it changed
            if (phoneCountry !== selectedCountry.code) {
              setSelectedCountry({
                code: phoneCountry,
                name: ISO31661a2.getCountry(phoneCountry) || phoneCountry
              });
            }
          }
        }
      } catch (err) {
        console.warn("Could not extract country from phone number:", err);
      }

      // In a real app, this would call an API endpoint to validate buyer info
      // and store it securely on the server
      const buyerInfoData = {
        ...data,
        phoneCountry: phoneCountry
      };

      if (sessionId) {
        // Use the appropriate service based on whether Stripe is configured
        const service = isStripeEnabled ? stripeService : paymentService;

        // Call the API to validate buyer info
        await service.validateBuyerInfo(sessionId, buyerInfoData);

        console.log("Buyer info validated and stored with session:", sessionId);
      } else {
        // Simulate server-side validation if no session
        await new Promise(resolve => setTimeout(resolve, 800));
        console.log("Buyer info validated:", buyerInfoData);
      }

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

  // Handle form submission for payment info via Stripe
  const handlePaymentInfoSubmit = async (data) => {
    if (isFormSubmitting) return;

    setIsFormSubmitting(true);

    try {
      // Get buyer info from the first step
      const buyerInfo = buyerInfoForm.getValues();

      // This is now managed by the StripePaymentForm component
      console.log("Payment form ready for Stripe processing");

      // The Stripe form will handle payment processing and callbacks
    } catch (error) {
      console.error("Error processing payment:", error);
      paymentInfoForm.setError('root', {
        type: 'manual',
        message: 'Payment processing failed. Please try again.'
      });
      setIsFormSubmitting(false);
    }
  };

  // Handle successful payment from Stripe
  const handlePaymentSuccess = (paymentIntentId) => {
    console.log("Payment processed successfully with ID:", paymentIntentId);

    // Show success message or redirect
    alert('Payment processed successfully! In a real application, you would be redirected to a confirmation page.');

    setIsFormSubmitting(false);
  };

  // Handle payment error from Stripe
  const handlePaymentError = (errorMessage) => {
    console.error("Error processing payment:", errorMessage);

    paymentInfoForm.setError('root', {
      type: 'manual',
      message: errorMessage || 'Payment processing failed. Please try again.'
    });

    setIsFormSubmitting(false);
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

  // Toggle cart popup in mobile view
  const toggleCartPopup = () => {
    setShowCartPopup(!showCartPopup);
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
    <div className="payment-portal-container">
{window.width < 768 && (
  <div className="mobile-timer-banner">
    <div className="timer-label">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--purple-800)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 2h4a2 2 0 0 1 2 2v2H8V4a2 2 0 0 1 2-2z"></path>
        <path d="M8 4L6 7.5 8 10 6 13.5 8 16l-2 3.5 2 2.5"></path>
        <path d="M16 4l2 3.5-2 2.5 2 3.5-2 2.5 2 3.5-2 2.5"></path>
        <rect x="4" y="18" width="16" height="4" rx="2"></rect>
      </svg>
      <span style={{ fontSize: '16px', fontWeight: '700', color: 'var(--purple-800)' }}>
        Session Expires In
      </span>
    </div>

    <div className="timer-digits" style={{ animation: isAlmostExpired ? 'pulse 1.5s infinite' : 'none' }}>
      <span className="timer-digit">
        {String(timeLeft.minutes).padStart(2, '0')}
      </span>
      <span className="timer-separator">:</span>
      <span className="timer-digit">
        {String(timeLeft.seconds).padStart(2, '0')}
      </span>
    </div>
  </div>
)}
      {/* Back and cancel buttons */}
      <div className="payment-nav-buttons">
        <button className="back-button" onClick={handleBack}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5"></path>
            <path d="M12 19l-7-7 7-7"></path>
          </svg>
          Back
        </button>

        <button
          className="cancel-button"
          onClick={() => {
            // Call onCancel if available, otherwise refresh page
            if (typeof onCancel === 'function') {
              onCancel();
            } else {
              window.location.reload();
            }
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6L6 18"></path>
            <path d="M6 6l12 12"></path>
          </svg>
          Cancel Booking
        </button>
      </div>

      {/* Mobile timer - Only visible in mobile view */}
      {window.innerWidth < 768 && (
        <div className="mobile-timer-banner">
          <div className="timer-label">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--purple-800)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 2h4a2 2 0 0 1 2 2v2H8V4a2 2 0 0 1 2-2z"></path>
              <path d="M8 4L6 7.5 8 10 6 13.5 8 16l-2 3.5 2 2.5"></path>
            <path d="M16 4l2 3.5-2 2.5 2 3.5-2 2.5 2 3.5-2 2.5"></path>
            <rect x="4" y="18" width="16" height="4" rx="2"></rect>
          </svg>
          <span style={{ fontSize: '16px', fontWeight: '700', color: 'var(--purple-800)' }}>
            Session Expires In
          </span>
        </div>

        <div className="timer-digits" style={{ animation: isAlmostExpired ? 'pulse 1.5s infinite' : 'none' }}>
          <span className="timer-digit">
            {String(timeLeft.minutes).padStart(2, '0')}
          </span>
          <span className="timer-separator">:</span>
          <span className="timer-digit">
            {String(timeLeft.seconds).padStart(2, '0')}
          </span>
        </div>
      </div>
    )}

      {/* Main content container */}
      <div className="payment-content">
        {/* Left side - Payment form */}
        <div className="payment-form">
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
                gap: '4px',
                width: '55%'
              }}>
                <div style={{
                  width: '25px',
                  height: '25px',
                  borderRadius: '50%',
                  backgroundColor: currentStep === 'buyerInfo' ? 'var(--purple-600)' :
                    (currentStep === 'paymentInfo' ? 'var(--purple-300)' : '#e0e0e0'),
                  color: currentStep === 'buyerInfo' ? 'white' :
                    (currentStep === 'paymentInfo' ? 'white' : 'var(--neutral-600)'),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '700',
                  fontSize: '12px',
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
                    fontSize: '12px',
                    fontWeight: '600',
                    color: currentStep === 'buyerInfo' ? 'var(--purple-600)' :
                      (currentStep === 'paymentInfo' ? 'var(--purple-300)' : 'var(--neutral-600)'),
                    transition: 'color 0.3s ease'
                  }}>
                    BUYER INFORMATION
                  </span>
                  <span style={{
                    fontSize: '9px',
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
                gap: '4px',
                width: '45%'
              }}>
                <div style={{
                  width: '25px',
                  height: '25px',
                  borderRadius: '50%',
                  backgroundColor: currentStep === 'paymentInfo' ? 'var(--purple-600)' : '#e0e0e0',
                  color: currentStep === 'paymentInfo' ? 'white' : 'var(--neutral-600)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '700',
                  fontSize: '12px',
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
                    fontSize: '12px',
                    fontWeight: '600',
                    color: currentStep === 'paymentInfo' ? 'var(--purple-600)' : 'var(--neutral-600)',
                    transition: 'color 0.3s ease'
                  }}>
                    PAYMENT DETAILS
                  </span>
                  <span style={{
                    fontSize: '9px',
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
            <form onSubmit={buyerInfoForm.handleSubmit((data, event) => handleBuyerInfoSubmit(data, event))}>
              {/* First and Last Name */}
              <div className="form-row">
                <div className="form-group">
                  <label
                    htmlFor="firstName"
                    className="form-label"
                    style={{
                      color: buyerInfoForm.formState.errors.firstName ? 'var(--primary)' : 'var(--neutral-500)'
                    }}
                  >
                    First Name
                  </label>
                  <input
                    id="firstName"
                    {...buyerInfoForm.register('firstName')}
                    autoComplete="given-name"
                    placeholder="John"
                    className="form-input"
                    style={{
                      borderColor: buyerInfoForm.formState.errors.firstName ? 'var(--primary)' : 
                                   (buyerInfoForm.formState.touchedFields.firstName ? 'var(--purple-200)' : '#e0e0e0'),
                      backgroundColor: buyerInfoForm.formState.errors.firstName ? 'rgba(255, 0, 60, 0.03)' : 'transparent',
                      boxShadow: buyerInfoForm.formState.dirtyFields.firstName ? '0 0 0 3px rgba(111, 68, 255, 0.1)' : 'none'
                    }}
                  />
                  {buyerInfoForm.formState.errors.firstName && (
                    <p className="form-error">
                      {buyerInfoForm.formState.errors.firstName.message}
                    </p>
                  )}
                </div>

                <div className="form-group">
                  <label
                    htmlFor="lastName"
                    className="form-label"
                    style={{
                      color: buyerInfoForm.formState.errors.lastName ? 'var(--primary)' : 'var(--neutral-500)'
                    }}
                  >
                    Last Name
                  </label>
                  <input
                    id="lastName"
                    {...buyerInfoForm.register('lastName')}
                    autoComplete="family-name"
                    placeholder="Doe"
                    className="form-input"
                    style={{
                      borderColor: buyerInfoForm.formState.errors.lastName ? 'var(--primary)' : 
                                   (buyerInfoForm.formState.touchedFields.lastName ? 'var(--purple-200)' : '#e0e0e0'),
                      backgroundColor: buyerInfoForm.formState.errors.lastName ? 'rgba(255, 0, 60, 0.03)' : 'transparent',
                      boxShadow: buyerInfoForm.formState.dirtyFields.lastName ? '0 0 0 3px rgba(111, 68, 255, 0.1)' : 'none'
                    }}
                  />
                  {buyerInfoForm.formState.errors.lastName && (
                    <p className="form-error">
                      {buyerInfoForm.formState.errors.lastName.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Phone Number with PhoneInputWithValidation component */}
              <FormProvider {...buyerInfoForm}>
                <PhoneInputWithValidation
                  fieldName="phone"
                  defaultCountry={selectedCountry.code}
                  label="Phone Number"
                />
              </FormProvider>

              {/* Email */}
              <div className="form-group" style={{ marginBottom: '30px' }}>
                <label
                  htmlFor="email"
                  className="form-label"
                  style={{
                    color: buyerInfoForm.formState.errors.email ? 'var(--primary)' : 'var(--neutral-500)'
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
                  className="form-input"
                  style={{
                    borderColor: buyerInfoForm.formState.errors.email ? 'var(--primary)' : 
                               (buyerInfoForm.formState.touchedFields.email ? 'var(--purple-200)' : '#e0e0e0'),
                    backgroundColor: buyerInfoForm.formState.errors.email ? 'rgba(255, 0, 60, 0.03)' : 'transparent',
                    boxShadow: buyerInfoForm.formState.dirtyFields.email ? '0 0 0 3px rgba(111, 68, 255, 0.1)' : 'none'
                  }}
                />
                {buyerInfoForm.formState.errors.email && (
                  <p className="form-error">
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
                  padding: '12px 15px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  marginBottom: '20px',
                  textAlign: 'center'
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
                  className="submit-button"
                  disabled={isFormSubmitting ||
                    (Object.keys(buyerInfoForm.formState.errors).length > 0)}
                  style={{
                    backgroundColor: isFormSubmitting ||
                      (Object.keys(buyerInfoForm.formState.errors).length > 0) ?
                      'var(--neutral-200)' : 'var(--primary)',
                    cursor: isFormSubmitting ||
                      (Object.keys(buyerInfoForm.formState.errors).length > 0) ?
                      'not-allowed' : 'pointer',
                  }}
                  onMouseEnter={(e) => {
                    if (!isFormSubmitting && (Object.keys(buyerInfoForm.formState.errors).length === 0)) {
                      e.currentTarget.style.backgroundColor = '#e50036';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = isFormSubmitting ||
                      (Object.keys(buyerInfoForm.formState.errors).length > 0) ?
                      'var(--neutral-200)' : 'var(--primary)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  Continue to Payment
                  {isFormSubmitting ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ animation: 'spin 1s linear infinite' }}>
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" strokeDasharray="40 20" />
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
              <div className="form-notice">
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
              {/* Payment form with Stripe integration - Card element only */}
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

              {/* Stripe Payment Form - Only showing Stripe card element */}
              <div style={{ marginBottom: '30px' }}>
                <StripePaymentComponent
                  sessionId={sessionId}
                  buyerInfo={buyerInfoForm.getValues()}
                  onPaymentSuccess={handlePaymentSuccess}
                  onPaymentError={handlePaymentError}
                  isSubmitting={isFormSubmitting}
                  setIsSubmitting={setIsFormSubmitting}
                  amount={totalAmount + 10 - (totalAmount * discount)}
                />
              </div>

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
                Secure Payment | Powered by Stripe
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
        <div className="cart-summary">
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

      {/* Mobile cart toggle button */}
      <button
        className="cart-toggle-button"
        onClick={toggleCartPopup}
        aria-label="View cart"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="9" cy="21" r="1"></circle>
          <circle cx="20" cy="21" r="1"></circle>
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
        </svg>
      </button>

      {/* Mobile cart popup */}
      {showCartPopup && (
        <>
          <div 
            className="cart-popup-overlay" 
            onClick={toggleCartPopup}
            style={{ display: 'block' }}
          ></div>
          <div className="cart-popup"
            onClick={(e) => e.stopPropagation()} // Prevent clicks from closing when clicking on the cart
          >
            <div className="cart-popup-header">
              <div className="cart-popup-title">
                Your Cart
                <span className="cart-popup-badge">
                  {cartItems.reduce((total, item) => total + item.quantity, 0)}
                </span>
              </div>
              <button className="cart-popup-close" onClick={toggleCartPopup}>×</button>
            </div>

            {/* Cart items (same as desktop) */}
            <div style={{
              maxHeight: '40vh',
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
                fontSize: '18px',
                fontWeight: '700',
                marginTop: '15px',
                padding: '15px 0',
                borderTop: '1px solid var(--neutral-200)',
              }}>
                <span>Total</span>
                <span>
                  ${(totalAmount + 10 - (totalAmount * discount)).toFixed(2)}
                </span>
              </div>
            </div>

            {/* Done button */}
            <button
              onClick={(e) => {
                e.stopPropagation(); // Prevent event from reaching overlay
                toggleCartPopup();
              }}
              style={{
                width: '100%',
                backgroundColor: 'var(--purple-600)',
                color: 'white',
                border: 'none',
                padding: '12px',
                borderRadius: '8px',
                fontWeight: '600',
                fontSize: '16px',
                marginTop: '20px',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--purple-700)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--purple-600)';
              }}
            >
              Continue to Payment
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default PaymentPortal;