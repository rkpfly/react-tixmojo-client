import React, { useState, useEffect, useRef } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  CardElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import stripeService from '../../services/stripeService';

// Enhanced appearance options for Stripe Elements
const stripeElementsOptions = {
  appearance: {
    theme: 'stripe',
    variables: {
      colorPrimary: '#6f44ff',
      colorBackground: '#ffffff',
      colorText: '#424770',
      colorDanger: '#ff0056',
      fontFamily: 'Raleway, system-ui, sans-serif',
      borderRadius: '8px',
      fontSizeBase: '16px'
    },
    rules: {
      '.Input': {
        borderColor: '#e0e0e0',
        boxShadow: 'none',
        transition: 'all 0.2s ease'
      },
      '.Input:focus': {
        borderColor: '#6f44ff',
        boxShadow: '0 0 0 3px rgba(111, 68, 255, 0.1)'
      },
      '.Input--invalid': {
        borderColor: '#ff0056',
        backgroundColor: 'rgba(255, 0, 86, 0.03)'
      },
      '.Label': {
        fontSize: '14px',
        fontWeight: '500',
        color: '#6f44ff'
      },
      '.Error': {
        color: '#ff0056',
        fontSize: '12px',
        fontWeight: '500'
      }
    }
  }
};

// Card element specific styles for more control
const cardElementOptions = {
  style: {
    base: {
      color: '#424770',
      fontFamily: 'Raleway, system-ui, sans-serif',
      fontSmoothing: 'antialiased',
      fontSize: '16px',
      '::placeholder': {
        color: '#aab7c4',
      },
      ':focus': {
        color: '#424770',
      },
    },
    invalid: {
      color: '#ff0056',
      iconColor: '#ff0056',
    },
  },
  hidePostalCode: true, // We'll collect this separately
};

// Stripe form component
const CheckoutForm = ({ 
  sessionId, 
  buyerInfo, 
  onPaymentSuccess, 
  onPaymentError,
  isSubmitting,
  setIsSubmitting,
  amount,
  clientSecret,
  isSimulationMode
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [paymentError, setPaymentError] = useState(null);
  const [cardComplete, setCardComplete] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  // Only keep postal code in the billing details - name and email are provided by parent component
  const [billingDetails, setBillingDetails] = useState({
    address: {
      postal_code: '',
      country: 'US'
    }
  });

  // Validation patterns for inputs - only postal code now
  const patterns = {
    postalCode: /^\d{5}(-\d{4})?$/ // US postal code pattern (5 digits or 5+4)
  };

  // Update billing details from form inputs - only postal code
  const handleBillingChange = (e) => {
    const { name, value } = e.target;
    
    // Only handle postal_code field
    if (name === 'postal_code') {
      // Format the postal code as it's being typed
      const formattedValue = formatPostalCodeInput(value);
      
      setBillingDetails({
        ...billingDetails,
        address: {
          ...billingDetails.address,
          [name]: formattedValue
        }
      });
      
      // Validate postal code field
      validatePostalCode(formattedValue);
    }
  };

  // Format real postal code input
  const formatPostalCodeInput = (value) => {
    // Remove all non-digits and hyphens
    const cleaned = value.replace(/[^\d-]/g, '');
    
    // Format as ZIP+4 if possible
    if (cleaned.includes('-')) {
      const parts = cleaned.split('-');
      const firstPart = parts[0].substring(0, 5);
      const secondPart = parts[1].substring(0, 4);
      
      if (firstPart.length === 5) {
        return secondPart ? `${firstPart}-${secondPart}` : firstPart;
      }
      return firstPart;
    } else {
      // Basic formatting for 5-digit codes
      const digits = cleaned.substring(0, 9);
      if (digits.length > 5) {
        return `${digits.substring(0, 5)}-${digits.substring(5)}`;
      }
      return digits;
    }
  };

  // Validate postal code with enhanced validation
  const validatePostalCode = (value) => {
    let errors = { ...validationErrors };
    
    if (!value.trim()) {
      errors.postal_code = 'Postal code is required';
    } else if (!patterns.postalCode.test(value) && billingDetails.address.country === 'US') {
      // Check specific validation rules for US ZIP codes
      if (value.length < 5) {
        errors.postal_code = 'US ZIP code must have at least 5 digits';
      } else if (value.includes('-') && value.split('-')[1].length < 4) {
        errors.postal_code = 'ZIP+4 requires 4 digits after the hyphen';
      } else {
        errors.postal_code = 'Please enter a valid postal code';
      }
    } else {
      delete errors.postal_code;
    }
    
    setValidationErrors(errors);
    return !errors.postal_code;
  };

  // Validate the form - simpler now with just postal code
  const validateForm = () => {
    return validatePostalCode(billingDetails.address.postal_code);
  };

  // Handle card element change
  const handleCardChange = (event) => {
    setCardComplete(event.complete);
    if (event.error) {
      setPaymentError(event.error.message);
    } else {
      setPaymentError(null);
    }
  };

  // Simplified simulation mode form data for testing - removed name and email
  const [simulationFormData, setSimulationFormData] = useState({
    cardNumber: '',
    cardExpiry: '',
    cardCvc: '',
    billingZip: ''
  });
  const [simulationFormComplete, setSimulationFormComplete] = useState(false);
  const [simulationErrors, setSimulationErrors] = useState({});
  
  // Format credit card number with spaces after every 4 digits
  const formatCardNumber = (value) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');
    
    // Limit to 16 digits
    const truncated = digits.substring(0, 16);
    
    // Add spaces after every 4 digits
    const formatted = truncated.replace(/(\d{4})(?=\d)/g, '$1 ');
    
    return formatted;
  };

  // Format expiry date to MM/YY format
  const formatExpiryDate = (value) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');
    
    // Limit to 4 digits
    const truncated = digits.substring(0, 4);
    
    // Format as MM/YY
    if (truncated.length > 2) {
      return `${truncated.substring(0, 2)}/${truncated.substring(2)}`;
    } else {
      return truncated;
    }
  };

  // Format CVC to allow only 3-4 digits
  const formatCVC = (value) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');
    
    // Limit to 4 digits
    return digits.substring(0, 4);
  };

  // Format postal code to only allow digits, limit to 5 or 9 digits (with hyphen)
  const formatPostalCode = (value) => {
    // Check if the value already contains a hyphen
    if (value.includes('-')) {
      const parts = value.split('-');
      // Make sure first part is 5 digits, second part is up to 4 digits
      const firstPart = parts[0].replace(/\D/g, '').substring(0, 5);
      const secondPart = parts[1].replace(/\D/g, '').substring(0, 4);
      
      if (firstPart.length === 5 && secondPart.length > 0) {
        return `${firstPart}-${secondPart}`;
      } else {
        return firstPart;
      }
    } else {
      // No hyphen, so just digits up to 5
      const digits = value.replace(/\D/g, '');
      return digits.substring(0, 5);
    }
  };

  // References for input elements to manage cursor position
  const cardNumberRef = useRef(null);
  const cardExpiryRef = useRef(null);
  
  // Handle simulation form input changes with enhanced validation and formatting
  const handleSimulationInputChange = (e) => {
    const { name, value, selectionStart } = e.target;
    let formattedValue = value;
    let cursorPosition = selectionStart;
    
    // Format input based on field type
    switch (name) {
      case 'cardNumber':
        const prevCardNumber = simulationFormData.cardNumber;
        formattedValue = formatCardNumber(value);
        
        // Adjust cursor position if we added a space
        if (formattedValue.length > prevCardNumber.length && 
            formattedValue[cursorPosition - 1] === ' ') {
          cursorPosition++;
        }
        break;
      case 'cardExpiry':
        const prevExpiry = simulationFormData.cardExpiry;
        formattedValue = formatExpiryDate(value);
        
        // Adjust cursor position if we added a slash
        if (formattedValue.length > prevExpiry.length && 
            formattedValue[cursorPosition - 1] === '/') {
          cursorPosition++;
        }
        break;
      case 'cardCvc':
        formattedValue = formatCVC(value);
        break;
      case 'billingZip':
        formattedValue = formatPostalCode(value);
        break;
      default:
        break;
    }
    
    // Update form data with formatted value
    setSimulationFormData({
      ...simulationFormData,
      [name]: formattedValue
    });
    
    // For card number and expiry date, we need to ensure cursor position
    // is maintained despite auto-formatting
    setTimeout(() => {
      if (name === 'cardNumber' && cardNumberRef.current) {
        cardNumberRef.current.setSelectionRange(cursorPosition, cursorPosition);
      } else if (name === 'cardExpiry' && cardExpiryRef.current) {
        cardExpiryRef.current.setSelectionRange(cursorPosition, cursorPosition);
      }
    }, 0);
    
    // Validate simulation form fields
    let errors = { ...simulationErrors };
    
    switch (name) {
      case 'cardNumber':
        if (!formattedValue) {
          errors.cardNumber = 'Card number is required';
        } else if (formattedValue.replace(/\s/g, '').length < 16) {
          errors.cardNumber = 'Card number must be 16 digits';
        } else {
          // Check Luhn algorithm for card validation
          const digits = formattedValue.replace(/\s/g, '');
          let sum = 0;
          let shouldDouble = false;
          
          // Loop through values starting from the rightmost side
          for (let i = digits.length - 1; i >= 0; i--) {
            let digit = parseInt(digits.charAt(i));
            
            if (shouldDouble) {
              digit *= 2;
              if (digit > 9) digit -= 9;
            }
            
            sum += digit;
            shouldDouble = !shouldDouble;
          }
          
          if (sum % 10 !== 0) {
            errors.cardNumber = 'Invalid card number';
          } else {
            delete errors.cardNumber;
          }
        }
        break;
      case 'cardExpiry':
        if (!formattedValue) {
          errors.cardExpiry = 'Expiry date is required';
        } else if (!/^\d{2}\/\d{2}$/.test(formattedValue)) {
          errors.cardExpiry = 'Use format MM/YY';
        } else {
          // Check if date is in the future and is valid
          const [month, year] = formattedValue.split('/');
          const monthNum = parseInt(month, 10);
          
          // Check month is between 1-12
          if (monthNum < 1 || monthNum > 12) {
            errors.cardExpiry = 'Invalid month';
          } else {
            const currentYear = new Date().getFullYear() % 100; // Get last 2 digits
            const currentMonth = new Date().getMonth() + 1; // 1-12
            const yearNum = parseInt(year, 10);
            
            // Check if card is expired
            if (yearNum < currentYear || (yearNum === currentYear && monthNum < currentMonth)) {
              errors.cardExpiry = 'Card has expired';
            } else {
              delete errors.cardExpiry;
            }
          }
        }
        break;
      case 'cardCvc':
        if (!formattedValue) {
          errors.cardCvc = 'CVC is required';
        } else if (formattedValue.length < 3) {
          errors.cardCvc = 'CVC must be 3 or 4 digits';
        } else {
          delete errors.cardCvc;
        }
        break;
      case 'billingZip':
        if (!formattedValue) {
          errors.billingZip = 'Postal code is required';
        } else if (!/^\d{5}(-\d{1,4})?$/.test(formattedValue)) {
          errors.billingZip = 'Enter a valid postal code';
        } else {
          delete errors.billingZip;
        }
        break;
      default:
        break;
    }
    
    setSimulationErrors(errors);
    
    // Check if all fields are valid and filled
    const updatedData = { ...simulationFormData, [name]: formattedValue };
    const cardDigits = updatedData.cardNumber.replace(/\s/g, '');
    
    const isComplete = 
      cardDigits.length === 16 && 
      updatedData.cardExpiry.length === 5 &&
      updatedData.cardCvc.length >= 3 &&
      updatedData.billingZip.length >= 5 &&
      Object.keys(errors).length === 0;
    
    setSimulationFormComplete(isComplete);
  };

  // Handle form submission with enhanced validation
  const handleSubmit = async (event) => {
    if (event && event.preventDefault) {
      event.preventDefault();
    }

    if (!clientSecret) {
      setPaymentError('Payment not initialized. Please refresh the page and try again.');
      return;
    }

    if (isProcessing || isSubmitting) {
      return;
    }

    // Clear previous errors
    setPaymentError(null);
    
    // Validate form before submission
    if (!isSimulationMode && !validateForm()) {
      setPaymentError('Please complete all required fields correctly.');
      return;
    }

    setIsProcessing(true);
    setIsSubmitting(true);

    try {
      // Check if we're in simulation mode
      if (isSimulationMode) {
        // Validate simulation form fields
        if (Object.keys(simulationErrors).length > 0) {
          setPaymentError('Please correct the errors in the form before proceeding.');
          setIsProcessing(false);
          setIsSubmitting(false);
          return;
        }
        
        // Simulate payment processing
        console.log('Simulating Stripe payment processing...');
        
        // Introduce a delay to simulate payment processing
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Extract payment intent ID from the client secret (simulated)
        const simulatedPaymentIntentId = clientSecret.split('_secret_')[0];
        
        // Confirm payment success on the server
        await stripeService.confirmPaymentSuccess(sessionId, simulatedPaymentIntentId);
        
        // Call the success callback
        onPaymentSuccess(simulatedPaymentIntentId);
      } else {
        // Real Stripe payment processing
        if (!stripe || !elements) {
          throw new Error('Stripe.js has not loaded yet');
        }
        
        // Get the card element
        const cardElement = elements.getElement(CardElement);
        
        // Validate billing details
        if (!billingDetails.name.trim()) {
          setPaymentError('Cardholder name is required');
          setIsProcessing(false);
          setIsSubmitting(false);
          return;
        }
        
        if (!billingDetails.address.postal_code.trim()) {
          setPaymentError('Postal code is required');
          setIsProcessing(false);
          setIsSubmitting(false);
          return;
        }
        
        // Create payment method with billing details (now just postal code)
        const { error: createPaymentMethodError, paymentMethod } = await stripe.createPaymentMethod({
          type: 'card',
          card: cardElement,
          billing_details: {
            name: buyerInfo ? `${buyerInfo.firstName} ${buyerInfo.lastName}` : '',
            email: buyerInfo?.email || '',
            phone: buyerInfo?.phone || '',
            address: billingDetails.address
          }
        });
        
        if (createPaymentMethodError) {
          setPaymentError(createPaymentMethodError.message);
          setIsProcessing(false);
          setIsSubmitting(false);
          return;
        }
        
        // Process the payment with billing details
        const result = await stripe.confirmCardPayment(clientSecret, {
          payment_method: paymentMethod.id,
          receipt_email: buyerInfo?.email,
          shipping: buyerInfo ? {
            name: `${buyerInfo.firstName} ${buyerInfo.lastName}`,
            phone: buyerInfo.phone,
            address: {
              line1: buyerInfo.address || '',
              city: buyerInfo.city || '',
              postal_code: billingDetails.address.postal_code,
              country: billingDetails.address.country,
            }
          } : undefined
        });

        if (result.error) {
          // Identify and display specific error types
          if (result.error.type === 'card_error') {
            setPaymentError(`Card error: ${result.error.message}`);
          } else if (result.error.type === 'validation_error') {
            setPaymentError(`Validation error: ${result.error.message}`);
          } else {
            setPaymentError(result.error.message);
          }
          onPaymentError(result.error.message);
        } else if (result.paymentIntent.status === 'succeeded') {
          // Payment was successful
          console.log('Payment succeeded with ID:', result.paymentIntent.id);
          
          // Confirm payment success on the server
          await stripeService.confirmPaymentSuccess(sessionId, result.paymentIntent.id);
          
          // Call the success callback
          onPaymentSuccess(result.paymentIntent.id);
        } else if (result.paymentIntent.status === 'requires_action') {
          // Handle 3D Secure authentication
          const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(clientSecret);
          
          if (confirmError) {
            setPaymentError(`Authentication failed: ${confirmError.message}`);
            onPaymentError(confirmError.message);
          } else if (paymentIntent.status === 'succeeded') {
            // 3D Secure authentication successful
            await stripeService.confirmPaymentSuccess(sessionId, paymentIntent.id);
            onPaymentSuccess(paymentIntent.id);
          } else {
            setPaymentError(`Payment failed with status: ${paymentIntent.status}`);
            onPaymentError(`Payment failed with status: ${paymentIntent.status}`);
          }
        } else {
          // Unexpected status
          setPaymentError(`Payment status: ${result.paymentIntent.status}`);
          onPaymentError(`Unexpected payment status: ${result.paymentIntent.status}`);
        }
      }
    } catch (error) {
      console.error('Payment confirmation error:', error);
      setPaymentError(error.message || 'Error processing payment. Please try again.');
      onPaymentError(error.message || 'Error processing payment. Please try again.');
    } finally {
      setIsProcessing(false);
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ width: '100%' }}>
      {/* Show simulation mode notice if in simulation mode */}
      {isSimulationMode && (
        <div style={{
          backgroundColor: 'rgba(111, 68, 255, 0.05)',
          borderRadius: '8px',
          border: '1px solid var(--purple-200)',
          padding: '10px 15px',
          marginBottom: '15px',
          fontSize: '14px',
          color: 'var(--purple-800)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '5px' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
              <line x1="1" y1="10" x2="23" y2="10"></line>
            </svg>
            <strong>Demo Payment Mode</strong>
          </div>
          <p style={{ margin: 0 }}>
            This is a demo payment form. No actual charges will be made, and no real card data is processed.
            Enter any card number (like 4242 4242 4242 4242), any future expiry date, and any CVC.
          </p>
        </div>
      )}

      <div style={{ marginBottom: '20px' }}>
        {/* Show Stripe Card Element only */}
        <div
          style={{
            marginBottom: '10px',
            transition: 'all 0.2s ease',
            borderRadius: '8px'
          }}
        >
          {isSimulationMode ? (
            /* Simplified simulation card form - only card details and zip */
            <div>              
              {/* Card Details */}
              <div style={{ 
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                padding: '16px',
                marginBottom: '16px',
                backgroundColor: '#ffffff',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
              }}>
                <div style={{ 
                  fontSize: '14px',
                  marginBottom: '12px',
                  color: 'var(--neutral-600)',
                  fontWeight: '500'
                }}>
                  Card Details
                </div>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px'
                }}>
                  {/* Card Number */}
                  <div>
                    <input
                      ref={cardNumberRef}
                      id="cardNumber"
                      name="cardNumber"
                      placeholder="1234 1234 1234 1234"
                      value={simulationFormData.cardNumber}
                      onChange={handleSimulationInputChange}
                      onKeyDown={(e) => {
                        // Allow only digits, navigation keys, backspace, delete, tab
                        const allowedKeys = ['Backspace', 'Delete', 'Tab', 'Enter', 'ArrowLeft', 'ArrowRight', 'Home', 'End'];
                        if (!/^\d$/.test(e.key) && !allowedKeys.includes(e.key)) {
                          e.preventDefault();
                        }
                        
                        // Auto-advance to next field when complete
                        if (simulationFormData.cardNumber.replace(/\s/g, '').length >= 15 && /^\d$/.test(e.key) && !e.metaKey && !e.ctrlKey) {
                          setTimeout(() => {
                            cardExpiryRef.current?.focus();
                          }, 10);
                        }
                      }}
                      autoComplete="cc-number"
                      inputMode="numeric"
                      style={{
                        width: '100%',
                        padding: '16px',
                        fontSize: '16px',
                        borderRadius: '8px',
                        border: `1px solid ${simulationErrors.cardNumber ? 'var(--primary)' : '#e0e0e0'}`,
                        backgroundColor: simulationErrors.cardNumber ? 'rgba(255, 0, 60, 0.03)' : 'white',
                        outline: 'none',
                        transition: 'all 0.2s ease',
                        boxShadow: 'none',
                        letterSpacing: '0.5px'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = simulationErrors.cardNumber ? 'var(--primary)' : 'var(--purple-600)';
                        e.target.style.boxShadow = '0 0 0 3px rgba(111, 68, 255, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = simulationErrors.cardNumber ? 'var(--primary)' : '#e0e0e0';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                    {simulationErrors.cardNumber && (
                      <p style={{
                        color: 'var(--primary)',
                        fontSize: '12px',
                        marginTop: '4px',
                        marginBottom: '0'
                      }}>
                        {simulationErrors.cardNumber}
                      </p>
                    )}
                    {simulationFormData.cardNumber.length > 0 && !simulationErrors.cardNumber && (
                      <div style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        alignItems: 'center',
                        gap: '5px',
                        fontSize: '11px',
                        color: 'var(--neutral-500)',
                        margin: '4px 0 0 0'
                      }}>
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                          <polyline points="22 4 12 14.01 9 11.01"></polyline>
                        </svg>
                        <span>
                          {simulationFormData.cardNumber.replace(/\s/g, '').length}/16 digits
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div style={{ display: 'flex', gap: '16px' }}>
                    {/* Expiry Date */}
                    <div style={{ flex: 1 }}>
                      <input
                        ref={cardExpiryRef}
                        id="cardExpiry"
                        name="cardExpiry"
                        placeholder="MM / YY"
                        value={simulationFormData.cardExpiry}
                        onChange={handleSimulationInputChange}
                        onKeyDown={(e) => {
                          // Allow only digits, navigation keys, backspace, delete, tab
                          const allowedKeys = ['Backspace', 'Delete', 'Tab', 'Enter', 'ArrowLeft', 'ArrowRight', 'Home', 'End'];
                          if (!/^\d$/.test(e.key) && !allowedKeys.includes(e.key)) {
                            e.preventDefault();
                          }
                          
                          // Auto-advance to next field when complete
                          if (simulationFormData.cardExpiry.length >= 4 && /^\d$/.test(e.key) && !e.metaKey && !e.ctrlKey) {
                            setTimeout(() => {
                              document.getElementById('cardCvc')?.focus();
                            }, 10);
                          }
                        }}
                        autoComplete="cc-exp"
                        inputMode="numeric"
                        style={{
                          width: '100%',
                          padding: '16px',
                          fontSize: '16px',
                          borderRadius: '8px',
                          border: `1px solid ${simulationErrors.cardExpiry ? 'var(--primary)' : '#e0e0e0'}`,
                          backgroundColor: simulationErrors.cardExpiry ? 'rgba(255, 0, 60, 0.03)' : 'white',
                          outline: 'none',
                          transition: 'all 0.2s ease',
                          boxShadow: 'none',
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = simulationErrors.cardExpiry ? 'var(--primary)' : 'var(--purple-600)';
                          e.target.style.boxShadow = '0 0 0 3px rgba(111, 68, 255, 0.1)';
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = simulationErrors.cardExpiry ? 'var(--primary)' : '#e0e0e0';
                          e.target.style.boxShadow = 'none';
                        }}
                      />
                      {simulationErrors.cardExpiry && (
                        <p style={{
                          color: 'var(--primary)',
                          fontSize: '12px',
                          marginTop: '4px',
                          marginBottom: '0'
                        }}>
                          {simulationErrors.cardExpiry}
                        </p>
                      )}
                    </div>
                    
                    {/* CVC */}
                    <div style={{ flex: 1 }}>
                      <input
                        id="cardCvc"
                        name="cardCvc"
                        placeholder="CVC"
                        value={simulationFormData.cardCvc}
                        onChange={handleSimulationInputChange}
                        onKeyDown={(e) => {
                          // Allow only digits, navigation keys, backspace, delete, tab
                          const allowedKeys = ['Backspace', 'Delete', 'Tab', 'Enter', 'ArrowLeft', 'ArrowRight', 'Home', 'End'];
                          if (!/^\d$/.test(e.key) && !allowedKeys.includes(e.key)) {
                            e.preventDefault();
                          }
                          
                          // Auto-advance to next field when complete
                          if (simulationFormData.cardCvc.length >= 2 && /^\d$/.test(e.key) && !e.metaKey && !e.ctrlKey) {
                            setTimeout(() => {
                              document.getElementById('billingZip')?.focus();
                            }, 10);
                          }
                        }}
                        autoComplete="cc-csc"
                        inputMode="numeric"
                        maxLength={4}
                        style={{
                          width: '100%',
                          padding: '16px',
                          fontSize: '16px',
                          borderRadius: '8px',
                          border: `1px solid ${simulationErrors.cardCvc ? 'var(--primary)' : '#e0e0e0'}`,
                          backgroundColor: simulationErrors.cardCvc ? 'rgba(255, 0, 60, 0.03)' : 'white',
                          outline: 'none',
                          transition: 'all 0.2s ease',
                          boxShadow: 'none',
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = simulationErrors.cardCvc ? 'var(--primary)' : 'var(--purple-600)';
                          e.target.style.boxShadow = '0 0 0 3px rgba(111, 68, 255, 0.1)';
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = simulationErrors.cardCvc ? 'var(--primary)' : '#e0e0e0';
                          e.target.style.boxShadow = 'none';
                        }}
                      />
                      {simulationErrors.cardCvc && (
                        <p style={{
                          color: 'var(--primary)',
                          fontSize: '12px',
                          marginTop: '4px',
                          marginBottom: '0'
                        }}>
                          {simulationErrors.cardCvc}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Zip Code */}
              <div style={{ marginBottom: '16px' }}>
                <label 
                  htmlFor="billingZip"
                  style={{
                    display: 'block',
                    fontSize: '14px',
                    color: simulationErrors.billingZip ? 'var(--primary)' : 'var(--neutral-600)',
                    marginBottom: '8px',
                    fontWeight: '500'
                  }}
                >
                  Postal Code
                </label>
                <input
                  id="billingZip"
                  name="billingZip"
                  placeholder="12345"
                  value={simulationFormData.billingZip}
                  onChange={handleSimulationInputChange}
                  onKeyDown={(e) => {
                    // Allow digits, hyphen, and special keys
                    const allowedKeys = ['Backspace', 'Delete', 'Tab', 'Enter', 'ArrowLeft', 'ArrowRight', 'Home', 'End', '-'];
                    if (!/^\d$/.test(e.key) && !allowedKeys.includes(e.key)) {
                      e.preventDefault();
                    }
                    
                    // Allow hyphen only at position 5
                    if (e.key === '-' && e.target.selectionStart !== 5) {
                      e.preventDefault();
                    }
                  }}
                  autoComplete="postal-code"
                  inputMode="numeric"
                  style={{
                    width: '100%',
                    padding: '16px',
                    fontSize: '16px',
                    borderRadius: '8px',
                    border: `1px solid ${simulationErrors.billingZip ? 'var(--primary)' : '#e0e0e0'}`,
                    backgroundColor: simulationErrors.billingZip ? 'rgba(255, 0, 60, 0.03)' : 'white',
                    outline: 'none',
                    transition: 'all 0.2s ease',
                    boxShadow: 'none',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = simulationErrors.billingZip ? 'var(--primary)' : 'var(--purple-600)';
                    e.target.style.boxShadow = '0 0 0 3px rgba(111, 68, 255, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = simulationErrors.billingZip ? 'var(--primary)' : '#e0e0e0';
                    e.target.style.boxShadow = 'none';
                    
                    // Ensure ZIP has valid format on blur
                    if (e.target.value.length === 5 && !e.target.value.includes('-')) {
                      // Valid 5-digit code
                    } else if (e.target.value.length > 5 && !e.target.value.includes('-')) {
                      // Format as ZIP+4 if longer than 5 digits
                      const digits = e.target.value.replace(/\D/g, '');
                      if (digits.length > 5) {
                        const formatted = `${digits.substring(0, 5)}-${digits.substring(5, 9)}`;
                        setSimulationFormData({
                          ...simulationFormData,
                          billingZip: formatted
                        });
                      }
                    }
                  }}
                />
                {simulationErrors.billingZip && (
                  <p style={{
                    color: 'var(--primary)',
                    fontSize: '12px',
                    marginTop: '4px',
                    marginBottom: '0'
                  }}>
                    {simulationErrors.billingZip}
                  </p>
                )}
                
                {/* Format hint */}
                <div style={{
                  fontSize: '11px',
                  color: 'var(--neutral-500)',
                  marginTop: '4px',
                }}>
                  Use format 12345 or 12345-6789
                </div>
              </div>
            
              {/* Simulation test card tip */}
              <div style={{
                padding: '10px 12px',
                backgroundColor: 'rgba(111, 68, 255, 0.05)',
                border: '1px solid var(--purple-100)',
                borderRadius: '8px',
                fontSize: '13px',
                color: 'var(--purple-800)',
                marginBottom: '15px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="16" x2="12" y2="12"></line>
                  <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
                <span>Test card: <strong>4242 4242 4242 4242</strong> | Exp: <strong>Any future date</strong> | CVC: <strong>Any 3 digits</strong></span>
              </div>
            </div>
          ) : (
            /* Real Stripe Payment - simplified with just card and postal code */
            <div>
              {/* Stripe Card Element */}
              <div style={{ marginBottom: '16px' }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '14px',
                    color: 'var(--neutral-600)',
                    marginBottom: '8px',
                    fontWeight: '500'
                  }}
                >
                  Card Details
                </label>
                <div
                  style={{
                    padding: '16px',
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    backgroundColor: 'white',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
                  }}
                >
                  <CardElement
                    options={cardElementOptions}
                    onChange={handleCardChange}
                  />
                </div>
              </div>
              
              {/* Postal Code */}
              <div style={{ marginBottom: '16px' }}>
                <label 
                  htmlFor="postal_code"
                  style={{
                    display: 'block',
                    fontSize: '14px',
                    color: validationErrors.postal_code ? 'var(--primary)' : 'var(--neutral-600)',
                    marginBottom: '8px',
                    fontWeight: '500'
                  }}
                >
                  Postal Code
                </label>
                <input
                  id="postal_code"
                  name="postal_code"
                  placeholder="12345"
                  value={billingDetails.address.postal_code}
                  onChange={handleBillingChange}
                  onKeyDown={(e) => {
                    // Allow digits, hyphen, and special keys
                    const allowedKeys = ['Backspace', 'Delete', 'Tab', 'Enter', 'ArrowLeft', 'ArrowRight', 'Home', 'End', '-'];
                    if (!/^\d$/.test(e.key) && !allowedKeys.includes(e.key)) {
                      e.preventDefault();
                    }
                    
                    // Allow hyphen only at position 5
                    if (e.key === '-' && e.target.selectionStart !== 5) {
                      e.preventDefault();
                    }
                  }}
                  autoComplete="postal-code"
                  inputMode="numeric"
                  style={{
                    width: '100%',
                    padding: '16px',
                    fontSize: '16px',
                    borderRadius: '8px',
                    border: `1px solid ${validationErrors.postal_code ? 'var(--primary)' : '#e0e0e0'}`,
                    backgroundColor: validationErrors.postal_code ? 'rgba(255, 0, 60, 0.03)' : 'white',
                    outline: 'none',
                    transition: 'all 0.2s ease',
                    boxShadow: 'none',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = validationErrors.postal_code ? 'var(--primary)' : 'var(--purple-600)';
                    e.target.style.boxShadow = '0 0 0 3px rgba(111, 68, 255, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = validationErrors.postal_code ? 'var(--primary)' : '#e0e0e0';
                    e.target.style.boxShadow = 'none';
                    
                    // Format ZIP code on blur for better presentation
                    const value = e.target.value;
                    if (value.length === 5 && !value.includes('-')) {
                      // Valid 5-digit code, no changes needed
                    } else if (value.length > 5 && !value.includes('-')) {
                      // Format as ZIP+4 if longer than 5 digits
                      const digits = value.replace(/\D/g, '');
                      if (digits.length > 5) {
                        const formatted = `${digits.substring(0, 5)}-${digits.substring(5, 9)}`;
                        setBillingDetails({
                          ...billingDetails,
                          address: {
                            ...billingDetails.address,
                            postal_code: formatted
                          }
                        });
                        validatePostalCode(formatted);
                      }
                    }
                  }}
                />
                {validationErrors.postal_code && (
                  <p style={{ 
                    color: 'var(--primary)', 
                    fontSize: '12px', 
                    marginTop: '4px',
                    marginBottom: '0'
                  }}>
                    {validationErrors.postal_code}
                  </p>
                )}
                
                {/* Format hint */}
                <div style={{
                  fontSize: '11px',
                  color: 'var(--neutral-500)',
                  marginTop: '4px',
                }}>
                  Use format 12345 or 12345-6789
                </div>
              </div>
              
              {/* Security Notice */}
              <div style={{
                padding: '10px 12px',
                backgroundColor: 'rgba(52, 168, 83, 0.05)',
                border: '1px solid #34A853',
                borderRadius: '8px',
                fontSize: '13px',
                color: '#34A853',
                marginBottom: '15px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
                <span>Your payment is secured with bank-level encryption.</span>
              </div>
            </div>
          )}
        </div>
        
        {/* Enhanced error display */}
        {paymentError && (
          <div style={{ 
            backgroundColor: 'rgba(255, 0, 60, 0.05)',
            border: '1px solid var(--primary)',
            borderRadius: '8px',
            padding: '12px 16px',
            marginTop: '10px',
            marginBottom: '15px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px'
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <div>
              <p style={{ 
                color: 'var(--primary)', 
                fontSize: '14px',
                fontWeight: '600',
                margin: '0 0 4px 0'
              }}>
                Payment Error
              </p>
              <p style={{ 
                color: 'var(--neutral-800)', 
                fontSize: '13px',
                margin: 0,
                lineHeight: '1.4'
              }}>
                {paymentError}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Payment button with enhanced validation */}
      <button
        onClick={handleSubmit}
        disabled={isProcessing || 
          (isSimulationMode ? !simulationFormComplete || Object.keys(simulationErrors).length > 0 
           : (!stripe || !elements || !cardComplete || Object.keys(validationErrors).length > 0 || 
              !billingDetails.address.postal_code)) || 
          !clientSecret}
        style={{
          width: '100%',
          backgroundColor: isProcessing || 
            (isSimulationMode ? !simulationFormComplete || Object.keys(simulationErrors).length > 0 
             : (!stripe || !elements || !cardComplete || Object.keys(validationErrors).length > 0 || 
                !billingDetails.address.postal_code)) || 
            !clientSecret
              ? 'var(--neutral-200)' 
              : 'var(--primary)',
          color: 'white',
          padding: '16px',
          borderRadius: '8px',
          border: 'none',
          fontSize: '16px',
          fontWeight: '700',
          cursor: isProcessing || 
            (isSimulationMode ? !simulationFormComplete || Object.keys(simulationErrors).length > 0 
             : (!stripe || !elements || !cardComplete || Object.keys(validationErrors).length > 0 || 
                !billingDetails.name || !billingDetails.email || !billingDetails.address.postal_code)) || 
            !clientSecret
              ? 'not-allowed' 
              : 'pointer',
          transition: 'all 0.3s ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
          opacity: isProcessing ? 0.8 : 1,
        }}
        onMouseEnter={(e) => {
          const isEnabled = !isProcessing && 
            (isSimulationMode ? simulationFormComplete && Object.keys(simulationErrors).length === 0 
             : (stripe && elements && cardComplete && Object.keys(validationErrors).length === 0 && 
                billingDetails.address.postal_code)) && 
            clientSecret;
          
          if (isEnabled) {
            e.currentTarget.style.backgroundColor = '#e50036';
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(255, 0, 60, 0.25)';
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = isProcessing || 
            (isSimulationMode ? !simulationFormComplete || Object.keys(simulationErrors).length > 0 
             : (!stripe || !elements || !cardComplete || Object.keys(validationErrors).length > 0 || 
                !billingDetails.address.postal_code)) || 
            !clientSecret
              ? 'var(--neutral-200)' 
              : 'var(--primary)';
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'none';
        }}
      >
        {isProcessing ? (
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
            Processing Payment...
          </>
        ) : (
          <>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
              <line x1="1" y1="10" x2="23" y2="10"></line>
            </svg>
            Pay ${amount?.toFixed(2) || '0.00'}
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
        Secure Payment | Powered by Stripe
      </div>
    </div>
  );
};

// Main Stripe payment form with Elements provider
const StripePaymentForm = ({ 
  sessionId, 
  buyerInfo, 
  onPaymentSuccess, 
  onPaymentError,
  isSubmitting,
  setIsSubmitting,
  amount
}) => {
  const [stripePromise, setStripePromise] = useState(null);
  const [isConfigured, setIsConfigured] = useState(true);
  const [clientSecret, setClientSecret] = useState('');
  const [isSimulationMode, setIsSimulationMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Create a payment intent when the component loads
  useEffect(() => {
    async function createIntent() {
      try {
        setIsLoading(true);
        // Request a payment intent from the server
        const response = await stripeService.createPaymentIntent(sessionId);
        
        // Check if we're in simulation mode
        if (response.isSimulated) {
          console.log('Running in Stripe simulation mode');
          setIsSimulationMode(true);
        }
        
        // Set the client secret from the payment intent
        setClientSecret(response.clientSecret);
        setIsLoading(false);
      } catch (error) {
        console.error('Error creating payment intent:', error);
        setIsLoading(false);
      }
    }

    // Get the Stripe publishable key from the service
    const publishableKey = stripeService.getStripePublishableKey();
    
    // Check if Stripe is properly configured
    const isConfigured = stripeService.isStripeConfigured();
    setIsConfigured(isConfigured);

    if (isConfigured) {
      // Initialize Stripe with the publishable key
      setStripePromise(loadStripe(publishableKey));
    }

    if (sessionId) {
      createIntent();
    }
  }, [sessionId]);

  // Our simulated Stripe service will always return as configured, but we'll handle
  // the transition in case the user has an actual Stripe key configured
  if (!isConfigured) {
    console.log("Using simulated Stripe implementation");
    // Force simulation mode
    setIsSimulationMode(true);
    
    // Use a simulated Stripe instance
    if (!stripePromise) {
      const dummyKey = 'pk_test_TYooMQauvdEDq54NiTphI7jx'; // Dummy key for simulation
      setStripePromise(loadStripe(dummyKey));
    }
    
    // Generate a simulated client secret if needed
    if (!clientSecret) {
      setClientSecret(`sim_${Math.random().toString(36).substring(2)}_secret_${Math.random().toString(36).substring(2)}`);
    }
  }

  // If Stripe is loading or client secret isn't ready, show a loading message
  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '150px'
      }}>
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ animation: 'spin 1s linear infinite' }}>
          <circle cx="12" cy="12" r="10" stroke="var(--purple-600)" strokeWidth="4" strokeDasharray="40 20" />
          <style>{`
            @keyframes spin {
              100% {
                transform: rotate(360deg);
              }
            }
          `}</style>
        </svg>
        <span style={{ marginLeft: '15px', color: 'var(--neutral-600)' }}>
          {!stripePromise ? 'Loading Stripe...' : 'Preparing payment form...'}
        </span>
      </div>
    );
  }

  // If client secret isn't ready, show an error
  if (!clientSecret) {
    return (
      <div style={{
        padding: '20px',
        backgroundColor: 'rgba(255, 0, 60, 0.05)',
        borderRadius: '8px',
        border: '1px solid var(--primary)',
        marginBottom: '20px'
      }}>
        <h3 style={{ color: 'var(--primary)', marginTop: 0 }}>Error Initializing Payment</h3>
        <p>We couldn't initialize the payment process. Please try again later or contact support.</p>
      </div>
    );
  }

  // Set up the options with client secret for Elements
  // Create a comprehensive configuration that meets Stripe's requirements
  const options = {
    clientSecret,
    appearance: stripeElementsOptions.appearance,
    fonts: [
      {
        cssSrc: 'https://fonts.googleapis.com/css2?family=Raleway:wght@400;500;600;700&display=swap',
      },
    ],
    locale: 'en',
    // Additional validation options
    rules: {
      postal: 'required'
    }
  };

  // Render Stripe Elements provider with the Checkout form
  return (
    <Elements stripe={stripePromise} options={options}>
      <CheckoutForm 
        sessionId={sessionId}
        buyerInfo={buyerInfo}
        onPaymentSuccess={onPaymentSuccess}
        onPaymentError={onPaymentError}
        isSubmitting={isSubmitting}
        setIsSubmitting={setIsSubmitting}
        amount={amount}
        clientSecret={clientSecret}
        isSimulationMode={isSimulationMode}
      />
    </Elements>
  );
};

// Export as both named and default export
export { StripePaymentForm };
export default StripePaymentForm;