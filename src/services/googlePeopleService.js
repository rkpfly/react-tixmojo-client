/**
 * Google People API Service
 * Handles interactions with Google People API to fetch user data
 */

/**
 * Fetches the user's phone numbers from Google People API
 * @param {string} accessToken - Google OAuth access token
 * @returns {Promise<Array>} - Array of phone number objects
 */
export const fetchUserPhoneNumbers = async (accessToken) => {
  try {
    const response = await fetch(
      'https://people.googleapis.com/v1/people/me?personFields=phoneNumbers',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Error fetching data: ${response.status}`);
    }

    const data = await response.json();
    return data.phoneNumbers || [];
  } catch (error) {
    console.error('Error fetching phone numbers from Google People API:', error);
    return [];
  }
};

/**
 * Extracts the most appropriate phone number from the API response
 * Prioritizes mobile numbers first, then other types
 * @param {Array} phoneNumbers - Array of phone number objects from the API
 * @returns {string|null} - Formatted phone number or null if none found
 */
export const extractBestPhoneNumber = (phoneNumbers) => {
  if (!phoneNumbers || phoneNumbers.length === 0) {
    return null;
  }

  // First try to find a mobile number
  const mobileNumber = phoneNumbers.find(
    phone => phone.type && phone.type.toLowerCase() === 'mobile' && phone.value
  );
  
  if (mobileNumber) {
    return formatPhoneNumber(mobileNumber.value);
  }

  // If no mobile number, use the first available number
  const firstAvailableNumber = phoneNumbers.find(phone => phone.value);
  if (firstAvailableNumber) {
    return formatPhoneNumber(firstAvailableNumber.value);
  }

  return null;
};

/**
 * Formats a phone number to remove non-numeric characters
 * For Indian numbers, preserves the +91 prefix
 * @param {string} phoneNumber - Raw phone number from the API
 * @returns {string} - Formatted phone number
 */
export const formatPhoneNumber = (phoneNumber) => {
  if (!phoneNumber) return '';
  
  // Handle Indian numbers with country code
  if (phoneNumber.startsWith('+91')) {
    // Format as +91 XXXXX XXXXX (with a space after +91 and in the middle)
    const digitsOnly = phoneNumber.replace(/\D/g, '');
    if (digitsOnly.length === 12 && digitsOnly.startsWith('91')) {
      return `+91 ${digitsOnly.substring(2, 7)} ${digitsOnly.substring(7)}`;
    }
  }
  
  // For other formats, just clean and return
  return phoneNumber.replace(/\s+/g, ' ').trim();
};