/**
 * TixMojo API service for handling all API calls
 * Enhanced with fallback support for server-side rendering
 */

import { fallbackAppData, fallbackEvents, fallbackOrganizers } from '../data/fallbackData';

/**
 * Get the base API URL based on environment
 * - For client-side code during development, use the proxy config from Vite
 * - For production or server-side, use the full URL
 */
export const getBaseApiUrl = () => {
  // Check if we're running in the browser
  const isBrowser = typeof window !== 'undefined';
  
  // Use environment variable if defined
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // During development in the browser, use relative URL for proxy to work
  if (isBrowser && import.meta.env.DEV) {
    console.log("Using development proxy URL: /api");
    return '/api';
  }
  
  // For server-side code or in production, use the full URL
  return 'http://localhost:5000/api';
};

// Get the base API URL
const API_BASE_URL = getBaseApiUrl();

/**
 * Generic fetch handler with error handling
 * @param {string} endpoint - API endpoint
 * @param {object} options - Fetch options
 * @returns {Promise<any>} - Parsed response data
 */
const fetchAPI = async (endpoint, options = {}) => {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    console.log(`Fetching from: ${url}`);
    
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      mode: 'cors',
      credentials: 'include'
    });

    console.log(`Response status: ${response.status} ${response.statusText}`);
    
    // Check response headers for debugging
    const headers = {};
    response.headers.forEach((value, key) => {
      headers[key] = value;
    });
    console.log('Response headers:', headers);

    if (!response.ok) {
      // Try to get error message from response
      let errorMessage;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || `HTTP error ${response.status}`;
      } catch (e) {
        errorMessage = `HTTP error ${response.status}`;
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    
    // Log a sample of the response data
    console.log('API response received:', 
      data && typeof data === 'object' 
        ? (Array.isArray(data.data) 
            ? `Array with ${data.data.length} items` 
            : Object.keys(data))
        : typeof data
    );

    // Our API returns data in a 'data' property
    return data.data || data; 
  } catch (error) {
    console.error(`API Error for ${endpoint}:`, error);
    throw error;
  }
};

/**
 * HTTP GET request
 * @param {string} endpoint - API endpoint
 * @param {object} options - Additional fetch options
 * @returns {Promise<any>} - Parsed response data
 */
const get = async (endpoint, options = {}) => {
  return fetchAPI(endpoint, {
    method: 'GET',
    ...options
  });
};

/**
 * HTTP POST request
 * @param {string} endpoint - API endpoint
 * @param {object} data - Data to send in request body
 * @param {object} options - Additional fetch options
 * @returns {Promise<any>} - Parsed response data
 */
const post = async (endpoint, data, options = {}) => {
  return fetchAPI(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
    ...options
  });
};

/**
 * HTTP PUT request
 * @param {string} endpoint - API endpoint
 * @param {object} data - Data to send in request body
 * @param {object} options - Additional fetch options
 * @returns {Promise<any>} - Parsed response data
 */
const put = async (endpoint, data, options = {}) => {
  return fetchAPI(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data),
    ...options
  });
};

/**
 * HTTP DELETE request
 * @param {string} endpoint - API endpoint
 * @param {object} options - Additional fetch options
 * @returns {Promise<any>} - Parsed response data
 */
const del = async (endpoint, options = {}) => {
  return fetchAPI(endpoint, {
    method: 'DELETE',
    ...options
  });
};

/**
 * Get all events
 * @param {string} location - Optional location filter
 * @returns {Promise<Array>} - Events data
 */
export const getAllEvents = async (location) => {
  const query = location ? `?location=${encodeURIComponent(location)}` : "";
  return get(`/events${query}`);
};

/**
 * Get events directly from the server's locationEvents data
 * @param {string} location - Optional location filter
 * @returns {Promise<Array>} - Raw events data from server
 */
export const getEventsFromServer = async (location) => {
  const query = location ? `?location=${encodeURIComponent(location)}` : "";
  return get(`/events/server-data${query}`);
};

/**
 * Get events by organizer ID
 * @param {string} organizerId - Organizer ID to filter by
 * @returns {Promise<Array>} - Events from the specified organizer
 */
export const getEventsByOrganizer = async (organizerId) => {
  if (!organizerId) {
    throw new Error("Organizer ID is required");
  }
  return get(`/events/organizer/${encodeURIComponent(organizerId)}`);
};

/**
 * Get location-specific events (uses custom events for each location)
 * @param {string} location - Location name (e.g., 'sydney', 'singapore')
 * @returns {Promise<Array>} - Location-specific events data
 */
export const getLocationEvents = async (location) => {
  if (!location) {
    throw new Error("Location parameter is required");
  }
  return get(
    `/events/location/${encodeURIComponent(location.toLowerCase())}`
  );
};

/**
 * Get spotlight events
 * @param {string} location - Optional location filter
 * @returns {Promise<Array>} - Spotlight events data
 */
export const getSpotlightEvents = async (location) => {
  const query = location ? `?location=${encodeURIComponent(location)}` : "";
  return get(`/events/spotlight${query}`);
};

/**
 * Get carousel flyers
 * @returns {Promise<Array>} - Flyers data
 */
export const getFlyers = async () => {
  return get("/events/flyers");
};

/**
 * Get event by ID
 * @param {string} id - Event ID
 * @param {boolean} [useFallback=false] - Whether to immediately use fallback data
 * @returns {Promise<Object>} - Event data
 */
export const getEventById = async (id, useFallback = false) => {
  // Validate event ID format - reject "event-#" format
  const isValidEventId = /^[a-z0-9-]+$/.test(id) && !id.match(/^event-\d+$/);
  if (!isValidEventId) {
    throw new Error(`Invalid event ID format: ${id}`);
  }
  
  // For SSR or when fallback is requested, return immediately with fallback data
  if (useFallback || (typeof window === 'undefined')) {
    console.log("Using fallback data for event:", id);
    const event = fallbackEvents.find(e => e.id === id);
    
    // Add organizer info
    if (event && event.organizerId && fallbackOrganizers[event.organizerId]) {
      event.organizer = fallbackOrganizers[event.organizerId];
    }
    
    return event || null;
  }

  try {
    // Try fetching from API first
    return await get(`/events/${id}`);
  } catch (error) {
    console.error(`API error for event ${id}, using fallback:`, error);
    
    // On failure, return fallback data
    const event = fallbackEvents.find(e => e.id === id);
    
    // Add organizer info
    if (event && event.organizerId && fallbackOrganizers[event.organizerId]) {
      event.organizer = fallbackOrganizers[event.organizerId];
    }
    
    if (!event) {
      throw new Error(`Event with ID ${id} not found`);
    }
    
    return event;
  }
};

/**
 * Get available locations
 * @returns {Promise<Array>} - Available locations
 */
export const getLocations = async () => {
  return get("/events/locations");
};

/**
 * Get location details with metadata
 * @param {string} location - Optional location name
 * @returns {Promise<Object>} - Location details or all locations if none specified
 */
export const getLocationDetails = async (location) => {
  return get(
    `/events/locations/${location ? encodeURIComponent(location) : ""}`
  );
};

/**
 * Get all application data in a single request
 * @param {boolean} [useFallback=false] - Whether to immediately use fallback data
 * @returns {Promise<Object>} - All app data including events, locations, and metadata
 */
export const getAllAppData = async (useFallback = false) => {
  // For SSR or when fallback is requested, return immediately with fallback data
  if (useFallback || (typeof window === 'undefined')) {
    console.log("Using fallback data for app");
    return fallbackAppData;
  }

  try {
    // Try fetching from API first
    const data = await get("/events/app-data");
    return data;
  } catch (error) {
    console.error("API error, using fallback data:", error);
    // On failure, return fallback data
    return fallbackAppData;
  }
};

// Export all API functions
export default {
  // HTTP methods
  get,
  post,
  put,
  delete: del,
  fetchAPI,
  
  // Endpoint-specific methods
  getAllEvents,
  getSpotlightEvents,
  getFlyers,
  getEventById,
  getLocations,
  getLocationDetails,
  getEventsFromServer,
  getLocationEvents,
  getEventsByOrganizer,
  getAllAppData,
};
