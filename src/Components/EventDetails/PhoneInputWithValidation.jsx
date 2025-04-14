import React, { useState, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { isValidPhoneNumber, parsePhoneNumber } from 'libphonenumber-js';
import { getCountryCallingCode } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import ReactCountryFlag from 'react-country-flag';
import ISO31661a2 from 'iso-3166-1-alpha-2';
import { formatPhoneNumber, getPhoneFormatExample } from '../../utils/phoneValidation';

/**
 * PhoneInputWithValidation Component
 * 
 * A custom phone input component that:
 * 1. Validates phone numbers based on country code
 * 2. Auto-detects country from entered phone number
 * 3. Shows country-specific format examples
 * 4. Updates country dropdown based on entered number
 */
const PhoneInputWithValidation = ({ fieldName = 'phone', defaultCountry = 'AU', label = 'Phone Number' }) => {
  const { register, formState, setValue, trigger, watch } = useFormContext();
  const phoneValue = watch(fieldName);
  
  // Country state
  const [selectedCountry, setSelectedCountry] = useState({
    code: defaultCountry,
    name: ISO31661a2.getCountry(defaultCountry) || defaultCountry
  });
  
  // React to initial value that might be auto-filled
  useEffect(() => {
    // Check initial value once on mount
    if (phoneValue && phoneValue.startsWith('+')) {
      try {
        const parsed = parsePhoneNumber(phoneValue);
        if (parsed && parsed.country && parsed.country !== selectedCountry.code) {
          setSelectedCountry({
            code: parsed.country,
            name: ISO31661a2.getCountry(parsed.country) || parsed.country
          });
          
          console.log(`Auto-detected country from initial value: ${parsed.country}`);
          
          // Trigger validation after country update
          const validationTimer = setTimeout(() => {
            trigger(fieldName);
          }, 50);
          
          // Clean up timer on unmount
          return () => clearTimeout(validationTimer);
        }
      } catch (err) {
        // Could not parse country from initial value
      }
    }
  }, []);

  // Country detection from phone number
  useEffect(() => {
    // Skip if no phone number
    if (!phoneValue || !phoneValue.startsWith('+')) return;
    
    try {
      // Try to detect country from the phone number
      const parsed = parsePhoneNumber(phoneValue);
      if (parsed && parsed.country && parsed.country !== selectedCountry.code) {
        // Update selected country
        setSelectedCountry({
          code: parsed.country,
          name: ISO31661a2.getCountry(parsed.country) || parsed.country
        });
        
        // Update form context for validation
        const formContext = formState.context || {};
        formContext.selectedCountry = {
          code: parsed.country,
          name: ISO31661a2.getCountry(parsed.country) || parsed.country
        };
        
        console.log(`Auto-detected country: ${parsed.country} from number: ${phoneValue}`);
      }
    } catch (err) {
      // Parsing error - might be an incomplete number
      console.log("Could not parse country from number yet");
    }
  }, [phoneValue, selectedCountry.code]);

  // Use the imported getPhoneFormatExample function

  // Handle country change
  const handleCountryChange = (e) => {
    const countryCode = e.target.value;
    const countryName = ISO31661a2.getCountry(countryCode) || countryCode;
    
    // Create country object for use in state and context
    const countryData = {
      code: countryCode,
      name: countryName
    };
    
    // Update local state
    setSelectedCountry(countryData);
    
    // Update form context
    try {
      // Update the form context for validation
      const formContext = formState.context || {};
      formContext.selectedCountry = countryData;
    } catch (err) {
      console.warn("Could not update form context:", err);
    }
    
    // Update phone with new country code
    try {
      // Get current phone number (if any)
      const currentPhone = phoneValue || '';
      const dialCode = `+${getCountryCallingCode(countryCode)}`;
      
      if (currentPhone) {
        // If we have an existing phone number, try to preserve the national part
        try {
          const parsed = parsePhoneNumber(currentPhone);
          if (parsed && parsed.nationalNumber) {
            // Create new phone number with selected country + existing national number
            const newPhone = `${dialCode}${parsed.nationalNumber}`;
            setValue(fieldName, newPhone, { shouldValidate: true });
          } else {
            // If can't parse, just set the dial code
            setValue(fieldName, dialCode, { shouldValidate: true });
          }
        } catch (err) {
          // If parsing fails, just set the dial code
          setValue(fieldName, dialCode, { shouldValidate: true });
        }
      } else {
        // If no phone, initialize with the country's dial code
        setValue(fieldName, dialCode, { shouldValidate: true });
      }
      
      // Re-validate with the updated country
      setTimeout(() => {
        trigger(fieldName);
      }, 0);
    } catch (err) {
      console.error("Error updating phone with new country code:", err);
    }
  };

  // Handle phone number change
  const handlePhoneChange = (e) => {
    // Get the current input value
    const value = e.target.value;
    
    // Format the phone number as the user types
    let formattedValue = value;
    
    // Only apply formatting if the number starts with +
    if (value && value.startsWith('+')) {
      // Try to automatically format the phone number according to its country
      try {
        formattedValue = formatPhoneNumber(value, selectedCountry.code);
        
        // If the formatted value is different from the input value and
        // we're not just removing characters (backspacing), update the field
        if (formattedValue !== value && formattedValue.length >= value.length) {
          setValue(fieldName, formattedValue, { shouldValidate: false });
          e.target.value = formattedValue; // Update the input directly for a smoother experience
          return; // Exit early as we've updated the field
        }
      } catch (formatErr) {
        console.warn("Error formatting phone number:", formatErr);
      }
    }
    
    // If no formatting was applied, just update the field with the original value
    setValue(fieldName, value, { shouldValidate: true });
    
    // Try to detect country from pasted phone number
    if (value && value.startsWith('+')) {
      try {
        const parsed = parsePhoneNumber(value);
        if (parsed && parsed.country && parsed.country !== selectedCountry.code) {
          // Update local state and context with detected country
          const countryData = {
            code: parsed.country,
            name: ISO31661a2.getCountry(parsed.country) || parsed.country
          };
          
          console.log(`Auto-detected country from input: ${parsed.country}`);
          
          // Update local state
          setSelectedCountry(countryData);
          
          // Update context
          try {
            // Update the form context for validation
            const formContext = formState.context || {};
            formContext.selectedCountry = countryData;
          } catch (contextErr) {
            console.warn("Could not update form context:", contextErr);
          }
        }
      } catch (err) {
        // Parsing error - might be an incomplete number
      }
    }
  };
  
  // Input style based on validation state
  const getInputStyle = (hasError, isFocused = false) => {
    const baseStyle = {
      flex: 1,
      border: 'none',
      fontSize: '16px',
      padding: '15px',
      outline: 'none',
      width: '100%',
      height: '50px',
      backgroundColor: 'transparent',
    };
    
    if (hasError) {
      return baseStyle;
    }
    
    if (isFocused) {
      return baseStyle;
    }
    
    return baseStyle;
  };

  // Container style based on validation state
  const getContainerStyle = (hasError) => {
    return {
      border: `1px solid ${hasError ? 'var(--primary)' : '#e0e0e0'}`,
      borderRadius: '8px',
      overflow: 'hidden',
      backgroundColor: hasError ? 'rgba(255, 0, 60, 0.03)' : 'white',
      display: 'flex',
      alignItems: 'center'
    };
  };

  return (
    <div style={{ marginBottom: '20px' }}>
      <label 
        htmlFor={fieldName} 
        style={{
          display: 'block',
          fontSize: '14px',
          color: formState.errors[fieldName] ? 'var(--primary)' : 'var(--neutral-500)',
          marginBottom: '5px',
          fontWeight: '500',
          transition: 'color 0.2s ease',
        }}
      >
        {label}
      </label>
      
      <div style={getContainerStyle(!!formState.errors[fieldName])}>
        {/* Country dropdown - Shows Flag + Country Code */}
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
            onChange={handleCountryChange}
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
        
        {/* Phone input */}
        <input
          id={fieldName}
          type="tel"
          // Register the input with React Hook Form
          {...register(fieldName, {
            onChange: handlePhoneChange
          })}
          autoComplete="tel"
          placeholder={`${getCountryCallingCode(selectedCountry.code) ? '+' + getCountryCallingCode(selectedCountry.code) + ' ' : ''}XXX XXX XXXX`}
          style={getInputStyle(!!formState.errors[fieldName])}
          onFocus={(e) => {
            // Auto-add country code if empty
            if (!e.target.value) {
              const dialCode = `+${getCountryCallingCode(selectedCountry.code)}`;
              setValue(fieldName, dialCode, { shouldValidate: true });
              
              // Trigger validation after a short delay to let React update the field
              const validationTimer = setTimeout(() => {
                trigger(fieldName);
              }, 10);
            }
          }}
          onAnimationStart={(e) => {
            // Check for browser autofill animation
            if (e.animationName === 'onAutoFillStart') {
              console.log('Browser autofill detected on phone input');
              
              // Get the current value after autofill
              const value = e.target.value;
              
              // If we have a value with a country code, try to update selected country
              if (value && value.startsWith('+')) {
                try {
                  const parsed = parsePhoneNumber(value);
                  if (parsed && parsed.country && parsed.country !== selectedCountry.code) {
                    // Update the country dropdown
                    setSelectedCountry({
                      code: parsed.country,
                      name: ISO31661a2.getCountry(parsed.country) || parsed.country
                    });
                    
                    console.log(`Auto-detected country from autofill: ${parsed.country}`);
                    
                    // Format the number properly
                    const formattedValue = formatPhoneNumber(value, parsed.country);
                    if (formattedValue !== value) {
                      setValue(fieldName, formattedValue, { shouldValidate: true });
                    }
                    
                    // Trigger validation
                    const validationTimer = setTimeout(() => {
                      trigger(fieldName);
                    }, 50);
                  }
                } catch (err) {
                  console.warn("Could not parse country from autofilled phone:", err);
                }
              }
              
              // Validate only this field, not the whole form
              const fieldValidationTimer = setTimeout(() => {
                trigger(fieldName);
              }, 100);
            }
          }}
        />
      </div>
      
      {/* Error message */}
      {formState.errors[fieldName] && (
        <p style={{ 
          color: 'var(--primary)', 
          fontSize: '12px', 
          marginTop: '5px',
          fontWeight: '500'
        }}>
          {formState.errors[fieldName].message}
        </p>
      )}
      
      {/* Format example */}
      <p style={{
        fontSize: '12px',
        color: 'var(--neutral-600)',
        marginTop: '4px',
      }}>
        Format example: {getPhoneFormatExample(selectedCountry.code)}
      </p>
      
      {/* Custom styles for the component */}
      <style>
        {`
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

export default PhoneInputWithValidation;