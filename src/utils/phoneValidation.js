import * as yup from 'yup';
import { isValidPhoneNumber, parsePhoneNumber, getCountryCallingCode } from 'libphonenumber-js';
import ISO31661a2 from 'iso-3166-1-alpha-2';

/**
 * Phone validation schema with country code detection
 * 
 * @param {string} fieldName - The name of the field to validate
 * @returns {Object} Yup validation schema for phone number
 */
export const createPhoneValidationSchema = (fieldName = 'phone') => {
  return yup.object({
    [fieldName]: yup
      .string()
      .required('Phone number is required')
      .test(`${fieldName}-validation`, function (value) {
        // Allow validation to pass if value is empty (the required check will handle this)
        if (!value) return this.createError({ 
          message: 'Phone number is required',
          path: this.path
        });
        
        // For partial dial codes, consider it valid during typing
        if (value.match(/^\+\d{1,3}$/)) {
          return true;
        }
        
        try {
          // Check if the number starts with +
          if (!value.startsWith('+')) {
            return this.createError({
              message: 'Phone number must include country code (e.g., +1 for US)',
              path: this.path
            });
          }
          
          // Get the context and selected country
          const selectedCountryCode = this.options.context?.selectedCountry?.code || 'US';
          
          // Use libphonenumber-js for validation
          try {
            // Parse the phone number
            const phoneNumber = parsePhoneNumber(value);
            
            if (!phoneNumber) {
              return this.createError({
                message: 'Could not parse phone number. Please check the format.',
                path: this.path
              });
            }
            
            // Check if the phone number matches the selected country
            if (phoneNumber.country && 
                phoneNumber.country !== selectedCountryCode && 
                this.options.context?.enforceCountryMatch) {
              return this.createError({
                message: `This phone number appears to be from ${ISO31661a2.getCountry(phoneNumber.country) || phoneNumber.country}, not ${ISO31661a2.getCountry(selectedCountryCode) || selectedCountryCode}. Please select the correct country.`,
                path: this.path
              });
            }
            
            // Check if the phone number is valid
            if (!phoneNumber.isValid()) {
              // Get format example based on detected country or selected country
              const countryToUse = phoneNumber.country || selectedCountryCode;
              const dialCode = getCountryCallingCode(countryToUse);
              
              // Format examples for common countries
              const formatExamples = {
                'US': `+${dialCode} (XXX) XXX-XXXX`,
                'CA': `+${dialCode} (XXX) XXX-XXXX`,
                'GB': `+${dialCode} XXXX XXXXXX`,
                'AU': `+${dialCode} XXX XXX XXX`,
                'IN': `+${dialCode} XXXXX XXXXX`,
                'SG': `+${dialCode} XXXX XXXX`,
                'JP': `+${dialCode} XX XXXX XXXX`,
                'DE': `+${dialCode} XXX XXXXXXX`,
                'FR': `+${dialCode} X XX XX XX XX`,
                'IT': `+${dialCode} XXX XXX XXXX`,
                'NZ': `+${dialCode} XXX XXX XXXX`
              };
              
              const formattingExample = formatExamples[countryToUse] || 
                                      `+${dialCode} XXX XXX XXXX`;
              
              return this.createError({
                message: `Invalid phone number. Example format: ${formattingExample}`,
                path: this.path
              });
            }
            
            // Additional validations if needed
            
            // 1. Validate phone type if required
            const numberType = phoneNumber.getType();
            if (numberType === 'FIXED_LINE' && this.options.context?.requireMobile) {
              return this.createError({
                message: 'Please enter a mobile phone number, not a landline.',
                path: this.path
              });
            }
            
            // 2. Check length rules for specific countries
            const nationalNumber = phoneNumber.nationalNumber;
            if (phoneNumber.country === 'US' && nationalNumber.length !== 10) {
              return this.createError({
                message: 'US phone numbers must be 10 digits (e.g., +1 XXX XXX XXXX).',
                path: this.path
              });
            }
            
            return true;
          } catch (e) {
            return this.createError({
              message: 'Invalid phone number format. Please check and try again.',
              path: this.path
            });
          }
        } catch (err) {
          return this.createError({
            message: 'Invalid phone number. Please enter a valid number with country code.',
            path: this.path
          });
        }
      })
  });
};

/**
 * Format a phone number with proper spacing according to country
 * 
 * @param {string} phoneNumber - The phone number to format
 * @param {string} countryCode - ISO 2-letter country code
 * @returns {string} Formatted phone number
 */
export const formatPhoneNumber = (phoneNumber, countryCode) => {
  if (!phoneNumber) return '';
  
  try {
    // Always try to parse and format using libphonenumber-js first
    try {
      const parsed = parsePhoneNumber(phoneNumber, countryCode);
      if (parsed && parsed.isValid()) {
        return parsed.formatInternational();
      }
    } catch (parseError) {
      // If parsing fails, continue to fallback formatters
      console.log("Could not parse phone for formatting:", parseError);
    }
    
    // If the number is incomplete or invalid, try basic formatting based on country
    const countryFormatters = {
      'US': phone => {
        // Format as: +1 (XXX) XXX-XXXX
        if (phone.startsWith('+1')) {
          const digits = phone.substring(2).replace(/\D/g, '');
          if (digits.length >= 10) {
            return `+1 (${digits.substring(0, 3)}) ${digits.substring(3, 6)}-${digits.substring(6, 10)}`;
          } else if (digits.length >= 6) {
            return `+1 (${digits.substring(0, 3)}) ${digits.substring(3)}`;
          } else if (digits.length >= 3) {
            return `+1 (${digits.substring(0, 3)})`;
          } else {
            return `+1 ${digits}`;
          }
        }
        return phone;
      },
      'GB': phone => {
        // Format as: +44 XXXX XXXXXX
        if (phone.startsWith('+44')) {
          const digits = phone.substring(3).replace(/\D/g, '');
          if (digits.length >= 10) {
            return `+44 ${digits.substring(0, 4)} ${digits.substring(4)}`;
          } else if (digits.length >= 4) {
            return `+44 ${digits.substring(0, 4)} ${digits.substring(4)}`;
          } else {
            return `+44 ${digits}`;
          }
        }
        return phone;
      },
      'AU': phone => {
        // Format as: +61 XXX XXX XXX
        if (phone.startsWith('+61')) {
          const digits = phone.substring(3).replace(/\D/g, '');
          if (digits.length >= 9) {
            return `+61 ${digits.substring(0, 3)} ${digits.substring(3, 6)} ${digits.substring(6, 9)}`;
          } else if (digits.length >= 6) {
            return `+61 ${digits.substring(0, 3)} ${digits.substring(3)}`;
          } else if (digits.length >= 3) {
            return `+61 ${digits.substring(0, 3)}`;
          } else {
            return `+61 ${digits}`;
          }
        }
        return phone;
      },
      'IN': phone => {
        // Format as: +91 XXXXX XXXXX
        if (phone.startsWith('+91')) {
          const digits = phone.substring(3).replace(/\D/g, '');
          if (digits.length >= 10) {
            return `+91 ${digits.substring(0, 5)} ${digits.substring(5)}`;
          } else if (digits.length >= 5) {
            return `+91 ${digits.substring(0, 5)} ${digits.substring(5)}`;
          } else {
            return `+91 ${digits}`;
          }
        }
        return phone;
      },
      'SG': phone => {
        // Format as: +65 XXXX XXXX
        if (phone.startsWith('+65')) {
          const digits = phone.substring(3).replace(/\D/g, '');
          if (digits.length >= 8) {
            return `+65 ${digits.substring(0, 4)} ${digits.substring(4, 8)}`;
          } else if (digits.length >= 4) {
            return `+65 ${digits.substring(0, 4)} ${digits.substring(4)}`;
          } else {
            return `+65 ${digits}`;
          }
        }
        return phone;
      }
      // Add more country-specific formatters as needed
    };
    
    // Try to detect country from phone number if not provided
    let detectedCountryCode = countryCode;
    if (!detectedCountryCode && phoneNumber.startsWith('+')) {
      try {
        const parsed = parsePhoneNumber(phoneNumber);
        if (parsed && parsed.country) {
          detectedCountryCode = parsed.country;
        }
      } catch (err) {
        // Could not parse country, continue with fallbacks
      }
    }
    
    // Use country-specific formatter if available
    if (detectedCountryCode && countryFormatters[detectedCountryCode]) {
      return countryFormatters[detectedCountryCode](phoneNumber);
    }
    
    // Generic international format for other countries
    if (phoneNumber.startsWith('+')) {
      // Try to add spaces after country code and groups of digits
      const match = phoneNumber.match(/^\+(\d+)(\d+)$/);
      if (match) {
        const [, countryPart, numberPart] = match;
        // Simple spacing for various lengths
        if (numberPart.length <= 3) {
          return `+${countryPart} ${numberPart}`;
        } else if (numberPart.length <= 7) {
          return `+${countryPart} ${numberPart.substring(0, 3)} ${numberPart.substring(3)}`;
        } else {
          // For longer numbers, split into groups of 3-4 digits
          let formatted = `+${countryPart} `;
          let remaining = numberPart;
          
          while (remaining.length > 0) {
            const chunkSize = remaining.length > 4 ? 3 : remaining.length;
            formatted += remaining.substring(0, chunkSize);
            remaining = remaining.substring(chunkSize);
            
            if (remaining.length > 0) {
              formatted += ' ';
            }
          }
          
          return formatted;
        }
      }
    }
    
    // Default: just return the phone as is if all else fails
    return phoneNumber;
  } catch (error) {
    console.error("Error formatting phone:", error);
    return phoneNumber;
  }
};

/**
 * Get example phone number format for a country
 * 
 * @param {string} countryCode - ISO 2-letter country code
 * @returns {string} Example phone number format
 */
export const getPhoneFormatExample = (countryCode) => {
  try {
    const dialCode = getCountryCallingCode(countryCode);
    
    // Format examples for common countries
    const formatExamples = {
      'US': `+${dialCode} (XXX) XXX-XXXX`,
      'CA': `+${dialCode} (XXX) XXX-XXXX`,
      'GB': `+${dialCode} XXXX XXXXXX`,
      'AU': `+${dialCode} XXX XXX XXX`,
      'IN': `+${dialCode} XXXXX XXXXX`,
      'SG': `+${dialCode} XXXX XXXX`,
      'JP': `+${dialCode} XX XXXX XXXX`,
      'DE': `+${dialCode} XXX XXXXXXX`,
      'FR': `+${dialCode} X XX XX XX XX`,
      'IT': `+${dialCode} XXX XXX XXXX`,
      'NZ': `+${dialCode} XXX XXX XXXX`
    };
    
    return formatExamples[countryCode] || `+${dialCode} XXX XXX XXXX`;
  } catch (e) {
    return '+XX XXX XXX XXXX';
  }
};

/**
 * Get the country code from a phone number
 * 
 * @param {string} phoneNumber - The phone number to parse
 * @returns {string|null} Country code or null if not detected
 */
export const getCountryFromPhone = (phoneNumber) => {
  if (!phoneNumber || !phoneNumber.startsWith('+')) return null;
  
  try {
    const parsed = parsePhoneNumber(phoneNumber);
    return parsed?.country || null;
  } catch (err) {
    return null;
  }
};

export default {
  createPhoneValidationSchema,
  formatPhoneNumber,
  getPhoneFormatExample,
  getCountryFromPhone
};