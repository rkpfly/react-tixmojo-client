/**
 * TixMojo API service for handling all API calls
 */

// API base URL - use environment variable in production
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

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

    return data.data; // Our API returns data in a 'data' property
  } catch (error) {
    console.error(`API Error for ${endpoint}:`, error);
    throw error;
  }
};

/**
 * Get all events
 * @param {string} location - Optional location filter
 * @returns {Promise<Array>} - Events data
 */
export const getAllEvents = async (location) => {
  const query = location ? `?location=${encodeURIComponent(location)}` : "";
  return fetchAPI(`/events${query}`);
};

/**
 * Get events directly from the server's locationEvents data
 * @param {string} location - Optional location filter
 * @returns {Promise<Array>} - Raw events data from server
 */
export const getEventsFromServer = async (location) => {
  const query = location ? `?location=${encodeURIComponent(location)}` : "";
  return fetchAPI(`/events/server-data${query}`);
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
  return fetchAPI(`/events/organizer/${encodeURIComponent(organizerId)}`);
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
  return fetchAPI(
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
  return fetchAPI(`/events/spotlight${query}`);
};

/**
 * Get carousel flyers
 * @returns {Promise<Array>} - Flyers data
 */
export const getFlyers = async () => {
  return fetchAPI("/events/flyers");
};

/**
 * Get event by ID
 * @param {string} id - Event ID
 * @returns {Promise<Object>} - Event data
 */
export const getEventById = async (id) => {
  return fetchAPI(`/events/${id}`);
};

/**
 * Get available locations
 * @returns {Promise<Array>} - Available locations
 */
export const getLocations = async () => {
  return fetchAPI("/events/locations");
};

/**
 * Get location details with metadata
 * @param {string} location - Optional location name
 * @returns {Promise<Object>} - Location details or all locations if none specified
 */
export const getLocationDetails = async (location) => {
  return fetchAPI(
    `/events/locations/${location ? encodeURIComponent(location) : ""}`
  );
};

/**
 * Get all application data in a single request
 * @returns {Promise<Object>} - All app data including events, locations, and metadata
 */
export const getAllAppData = async () => {
  return fetchAPI("/events/app-data");
};

// Export all API functions
export default {
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
