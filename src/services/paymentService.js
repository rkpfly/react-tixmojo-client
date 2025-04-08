/**
 * Payment Service
 * 
 * Provides secure API communication for payment processing
 * Handles all payment-related API calls
 */

import api from './api';

// Base URL for payment API endpoints
const BASE_URL = '/api/payment';

/**
 * Initialize a payment session
 * @param {Array} cartItems - Cart items with ticket and quantity information
 * @param {Object} event - Current event information
 * @returns {Promise} Session information including sessionId and expiryTime
 */
export const initializePaymentSession = async (cartItems, event) => {
  try {
    const response = await api.post(`${BASE_URL}/initialize`, {
      cartItems,
      event
    });
    
    return response.data;
  } catch (error) {
    console.error('Error initializing payment session:', error);
    throw error;
  }
};

/**
 * Validate buyer information
 * @param {String} sessionId - Current payment session ID
 * @param {Object} buyerInfo - Buyer information including name, email, phone
 * @returns {Promise} Validation response
 */
export const validateBuyerInfo = async (sessionId, buyerInfo) => {
  try {
    const response = await api.post(`${BASE_URL}/validate-buyer`, {
      sessionId,
      ...buyerInfo
    });
    
    return response.data;
  } catch (error) {
    console.error('Error validating buyer info:', error);
    throw error;
  }
};

/**
 * Process payment
 * @param {String} sessionId - Current payment session ID
 * @param {Object} paymentInfo - Payment information (processed securely on server)
 * @returns {Promise} Payment response including order ID
 */
export const processPayment = async (sessionId, paymentInfo) => {
  try {
    const response = await api.post(`${BASE_URL}/process`, {
      sessionId,
      ...paymentInfo
    });
    
    return response.data;
  } catch (error) {
    console.error('Error processing payment:', error);
    throw error;
  }
};

/**
 * Apply promo code
 * @param {String} sessionId - Current payment session ID
 * @param {String} promoCode - Promo code to apply
 * @returns {Promise} Promo response including discount amount
 */
export const applyPromoCode = async (sessionId, promoCode) => {
  try {
    const response = await api.post(`${BASE_URL}/apply-promo`, {
      sessionId,
      promoCode
    });
    
    return response.data;
  } catch (error) {
    console.error('Error applying promo code:', error);
    throw error;
  }
};

/**
 * Get current session status
 * @param {String} sessionId - Current payment session ID
 * @returns {Promise} Session status and time remaining
 */
export const getSessionStatus = async (sessionId) => {
  try {
    const response = await api.get(`${BASE_URL}/session-status/${sessionId}`);
    return response.data;
  } catch (error) {
    console.error('Error getting session status:', error);
    throw error;
  }
};

// Export all functions
export default {
  initializePaymentSession,
  validateBuyerInfo,
  processPayment,
  applyPromoCode,
  getSessionStatus
};