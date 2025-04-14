/**
 * Stripe Payment Service with Local Mock Implementation
 * 
 * This service simulates Stripe API calls locally since the backend endpoints
 * appear to be missing or not properly configured
 */

// Load the appropriate Stripe API key based on environment
const isProduction = import.meta.env.VITE_ENV === 'production';
const STRIPE_PUBLISHABLE_KEY = isProduction
  ? import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY_PROD
  : (import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY_DEV || 'pk_test_TYooMQauvdEDq54NiTphI7jx');

// Local storage key for simulated sessions
const STORAGE_KEY = 'tixmojo_payment_sessions';

// Generate a random ID for simulated sessions and intents
const generateId = (prefix) => `${prefix}_${Math.random().toString(36).substring(2, 15)}`;

// Get sessions from local storage
const getSessions = () => {
  try {
    const sessions = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    return sessions;
  } catch (e) {
    console.error('Error reading sessions from local storage:', e);
    return {};
  }
};

// Save sessions to local storage
const saveSessions = (sessions) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  } catch (e) {
    console.error('Error saving sessions to local storage:', e);
  }
};

/**
 * Initialize a payment session locally
 * @param {Array} cartItems - Cart items with ticket and quantity information
 * @param {Object} event - Current event information
 * @returns {Promise} Session information including sessionId and expiryTime
 */
export const initializePaymentSession = async (cartItems, event) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Generate a new session ID
  const sessionId = generateId('sess');
  
  // Calculate total amount from cart items
  const totalAmount = cartItems.reduce((total, item) => {
    return total + (parseFloat(item.ticket.price) * item.quantity);
  }, 0);
  
  // Create a session expiry time (15 minutes from now)
  const expiryTime = new Date(Date.now() + 15 * 60 * 1000);
  
  // Create a new session
  const session = {
    id: sessionId,
    eventId: event.id,
    cartItems,
    totalAmount,
    createdAt: new Date().toISOString(),
    expiryTime: expiryTime.toISOString(),
    status: 'initialized',
    discount: 0,
    buyerInfo: null,
    paymentIntent: null
  };
  
  // Save the session
  const sessions = getSessions();
  sessions[sessionId] = session;
  saveSessions(sessions);
  
  // Return the session information
  return {
    sessionId,
    expiryTime: expiryTime.toISOString(),
    totalAmount
  };
};

/**
 * Validate buyer information
 * @param {String} sessionId - Current payment session ID
 * @param {Object} buyerInfo - Buyer information including name, email, phone
 * @returns {Promise} Validation response
 */
export const validateBuyerInfo = async (sessionId, buyerInfo) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Get the session
  const sessions = getSessions();
  const session = sessions[sessionId];
  
  if (!session) {
    throw new Error('Session not found');
  }
  
  // Update the session with buyer info
  session.buyerInfo = buyerInfo;
  session.status = 'buyer_info_validated';
  
  // Save the updated session
  sessions[sessionId] = session;
  saveSessions(sessions);
  
  // Return a success response
  return {
    success: true,
    message: 'Buyer information validated successfully',
    sessionId
  };
};

/**
 * Create a simulated Stripe payment intent
 * @param {String} sessionId - Current payment session ID
 * @returns {Promise} Payment intent creation response including client secret
 */
export const createPaymentIntent = async (sessionId) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Get the session
  const sessions = getSessions();
  const session = sessions[sessionId];
  
  if (!session) {
    throw new Error('Session not found');
  }
  
  // Generate a payment intent ID and client secret
  const paymentIntentId = generateId('pi');
  const clientSecret = `${paymentIntentId}_secret_${generateId('')}`;
  
  // Create a payment intent object
  const paymentIntent = {
    id: paymentIntentId,
    clientSecret,
    amount: session.totalAmount,
    currency: 'usd',
    status: 'requires_payment_method',
    created: Date.now()
  };
  
  // Update the session with payment intent
  session.paymentIntent = paymentIntent;
  session.status = 'payment_intent_created';
  
  // Save the updated session
  sessions[sessionId] = session;
  saveSessions(sessions);
  
  // Return the client secret
  return {
    clientSecret,
    isSimulated: true,
    amount: session.totalAmount,
    currency: 'usd'
  };
};

/**
 * Confirm payment success
 * @param {String} sessionId - Current payment session ID
 * @param {String} paymentIntentId - Stripe payment intent ID
 * @returns {Promise} Confirmation response including order ID
 */
export const confirmPaymentSuccess = async (sessionId, paymentIntentId) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1200));
  
  // Get the session
  const sessions = getSessions();
  const session = sessions[sessionId];
  
  if (!session) {
    throw new Error('Session not found');
  }
  
  // Update the payment intent status
  if (session.paymentIntent) {
    session.paymentIntent.status = 'succeeded';
  }
  
  // Update the session status
  session.status = 'payment_succeeded';
  
  // Generate an order ID
  const orderId = generateId('order');
  session.orderId = orderId;
  
  // Save the updated session
  sessions[sessionId] = session;
  saveSessions(sessions);
  
  // Return order information
  return {
    success: true,
    orderId,
    message: 'Payment processed successfully',
    tickets: session.cartItems.map(item => ({
      ticketId: item.ticket.id,
      quantity: item.quantity,
      price: item.ticket.price,
      name: item.ticket.name
    })),
    totalAmount: session.totalAmount,
    discount: session.discount,
    buyerInfo: session.buyerInfo
  };
};

/**
 * Apply promo code
 * @param {String} sessionId - Current payment session ID
 * @param {String} promoCode - Promo code to apply
 * @returns {Promise} Promo response including discount amount
 */
export const applyPromoCode = async (sessionId, promoCode) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 700));
  
  // Get the session
  const sessions = getSessions();
  const session = sessions[sessionId];
  
  if (!session) {
    throw new Error('Session not found');
  }
  
  // Simulate promo code validation
  // For demonstration purposes, apply a standard 10% discount for any code that starts with "TIXMOJO"
  // and 15% for "WELCOME", otherwise return an error
  let discount = 0;
  let isValid = false;
  let message = 'Invalid promo code';
  
  if (promoCode.toUpperCase().startsWith('TIXMOJO')) {
    discount = 0.1; // 10% discount
    isValid = true;
    message = 'Promo code applied: 10% discount';
  } else if (promoCode.toUpperCase() === 'WELCOME') {
    discount = 0.15; // 15% discount
    isValid = true;
    message = 'Promo code applied: 15% discount';
  }
  
  if (isValid) {
    // Update the session with discount
    session.discount = discount;
    sessions[sessionId] = session;
    saveSessions(sessions);
  }
  
  // Return the discount information
  return {
    isValid,
    discount,
    message,
    totalBeforeDiscount: session.totalAmount,
    totalAfterDiscount: session.totalAmount * (1 - discount)
  };
};

/**
 * Get current session status
 * @param {String} sessionId - Current payment session ID
 * @returns {Promise} Session status and time remaining
 */
export const getSessionStatus = async (sessionId) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Get the session
  const sessions = getSessions();
  const session = sessions[sessionId];
  
  if (!session) {
    throw new Error('Session not found');
  }
  
  // Calculate time remaining
  const expiryTime = new Date(session.expiryTime);
  const now = new Date();
  const timeRemaining = Math.max(0, expiryTime.getTime() - now.getTime());
  
  // Check if the session is expired
  const isExpired = timeRemaining <= 0;
  
  // If expired, update the status
  if (isExpired && session.status !== 'expired') {
    session.status = 'expired';
    sessions[sessionId] = session;
    saveSessions(sessions);
  }
  
  // Return the session status
  return {
    status: session.status,
    timeRemaining,
    isExpired,
    expiryTime: session.expiryTime
  };
};

/**
 * Get Stripe publishable key
 * @returns {String} Stripe publishable key for the current environment
 */
export const getStripePublishableKey = () => {
  return STRIPE_PUBLISHABLE_KEY;
};

/**
 * Check if Stripe is properly configured
 * @returns {Boolean} Always returns true for this mock implementation
 */
export const isStripeConfigured = () => {
  return true; // Mock is always "configured"
};

// Export all functions
export default {
  initializePaymentSession,
  validateBuyerInfo,
  createPaymentIntent,
  confirmPaymentSuccess,
  applyPromoCode,
  getSessionStatus,
  getStripePublishableKey,
  isStripeConfigured
};