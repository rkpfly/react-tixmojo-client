/**
 * Phone Service for client-side validation and formatting
 * Uses server API for country data and validation when available
 */

import { getBaseApiUrl } from './api.js';

// Cache for country options to avoid redundant API calls
let cachedCountryOptions = null;
const cachedPhoneExamples = {};

/**
 * Get all country options with sorted popular countries first
 * @returns {Promise<Array>} Array of country objects with code, name, dialCode
 */
export const getCountryOptions = async () => {
  try {
    // Use cached data if available
    if (cachedCountryOptions) {
      return cachedCountryOptions;
    }
    
    // Get data from server API
    const baseUrl = getBaseApiUrl();
    const response = await fetch(`${baseUrl}/api/countries`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch country data from server');
    }
    
    const data = await response.json();
    
    if (data.success && Array.isArray(data.data)) {
      // Cache response for future use
      cachedCountryOptions = data.data;
      return data.data;
    } else {
      throw new Error('Invalid country data format received from server');
    }
  } catch (error) {
    console.error('Error fetching country options:', error);
    // Fallback to minimal country list if API fails
    return [
      { code: 'AU', name: 'Australia', dialCode: '+61' },
      { code: 'US', name: 'United States', dialCode: '+1' },
      { code: 'GB', name: 'United Kingdom', dialCode: '+44' },
      { code: 'IN', name: 'India', dialCode: '+91' },
      { code: 'JP', name: 'Japan', dialCode: '+81' }
    ];
  }
};

/**
 * Get phone format example for a country
 * @param {string} countryCode - ISO country code (e.g., 'US', 'GB')
 * @returns {Promise<string>} - Example phone format
 */
export const getPhoneExample = async (countryCode) => {
  if (!countryCode) return '+XX XXX XXX XXXX';
  
  try {
    // Use cached data if available
    if (cachedPhoneExamples[countryCode]) {
      return cachedPhoneExamples[countryCode];
    }
    
    // Get data from server API
    const baseUrl = getBaseApiUrl();
    const response = await fetch(`${baseUrl}/api/phone/format-example/${countryCode}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch phone example from server');
    }
    
    const data = await response.json();
    
    if (data.success && data.example) {
      // Cache response for future use
      cachedPhoneExamples[countryCode] = data.example;
      return data.example;
    } else {
      throw new Error('Invalid phone example format received from server');
    }
  } catch (error) {
    console.error('Error fetching phone example:', error);
    // Fallback examples for common countries
    const examples = {
      'US': '(201) 555-0123',
      'GB': '07700 900123',
      'CA': '(204) 555-0123',
      'AU': '0412 345 678',
      'IN': '99999 12345',
      'DE': '0171 1234567',
      'JP': '090-1234-5678'
    };
    
    // Return country-specific example or generic example
    return examples[countryCode] || `+XX XXX XXX XXXX`;
  }
};

/**
 * Validate phone number on server
 * @param {string} phone - Phone number to validate
 * @param {string} countryCode - ISO country code
 * @returns {Promise<Object>} - Validation result with isValid and formatted fields
 */
export const validatePhone = async (phone, countryCode) => {
  try {
    if (!phone || !countryCode) {
      return { isValid: false, formatted: null };
    }
    
    // Get data from server API
    const baseUrl = getBaseApiUrl();
    const response = await fetch(`${baseUrl}/api/validate-phone`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ phone, countryCode })
    });
    
    if (!response.ok) {
      throw new Error('Failed to validate phone on server');
    }
    
    const data = await response.json();
    
    if (data.success) {
      return {
        isValid: data.isValid,
        formatted: data.formatted || null
      };
    } else {
      throw new Error('Invalid validation response received from server');
    }
  } catch (error) {
    console.error('Error validating phone on server:', error);
    // Fallback to basic validation if server validation fails
    const cleanedPhone = phone.replace(/\D/g, '');
    const isValid = cleanedPhone.length >= 5 && cleanedPhone.length <= 15;
    
    return {
      isValid,
      formatted: phone // Return original as we can't format properly without server
    };
  }
};