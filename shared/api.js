// api.js - API functions for interacting with Supabase and other external services

/**
 * Base API configuration
 */
const API_CONFIG = {
  baseUrl: '',  // Will be populated if/when we connect to an external API
  headers: {
    'Content-Type': 'application/json'
  }
};

// Supabase configuration from environment variables (Vite format)
const SUPABASE_URL = import.meta.env?.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = import.meta.env?.VITE_SUPABASE_ANON || '';

// Check if Supabase is configured
const isSupabaseConfigured = SUPABASE_URL && SUPABASE_ANON_KEY;

/**
 * Generic fetch wrapper with error handling
 * @param {string} endpoint - API endpoint
 * @param {Object} options - Fetch options
 * @returns {Promise} - Promise with the API response
 */
async function fetchApi(endpoint, options = {}) {
  try {
    // If Supabase is configured and endpoint starts with /supabase, use Supabase
    if (isSupabaseConfigured && endpoint.startsWith('/supabase')) {
      return await fetchSupabase(endpoint.replace('/supabase', ''), options);
    }
    
    // If no external API is set yet, use mock data or local storage
    if (!API_CONFIG.baseUrl && !options.useExternal) {
      return await mockFetch(endpoint, options);
    }
    
    const url = `${API_CONFIG.baseUrl}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        ...API_CONFIG.headers,
        ...options.headers
      }
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

/**
 * Fetch data from Supabase
 * @param {string} path - Supabase path
 * @param {Object} options - Request options
 * @returns {Promise} - Promise with Supabase response
 */
async function fetchSupabase(path, options = {}) {
  try {
    const url = `${SUPABASE_URL}/rest/v1${path}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`Supabase error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Supabase request failed:', error);
    throw error;
  }
}

/**
 * Mock API response for development and testing
 * @param {string} endpoint - Mocked endpoint
 * @param {Object} options - Request options
 * @returns {Promise} - Promise with mock data
 */
async function mockFetch(endpoint, options) {
  console.log('Using mock API for', endpoint);
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Get data from localStorage
  const userData = localStorage.getItem('userData');
  const parsedUserData = userData ? JSON.parse(userData) : {};
  
  // Mock different endpoints
  if (endpoint === '/user') {
    return { user: parsedUserData.user || { name: 'Guest User' } };
  }
  
  // Default mock response
  return { message: 'Mock API response', endpoint };
}

/**
 * Get user data
 * @returns {Promise} - Promise with user data
 */
export async function getUserData() {
  return fetchApi('/user');
}

/**
 * Example function to get data from Supabase
 * @param {string} table - Table name
 * @returns {Promise} - Promise with data from Supabase
 */
export async function getSupabaseData(table) {
  return fetchApi(`/supabase/${table}`);
}
