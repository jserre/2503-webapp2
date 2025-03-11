// api.js - Simplified API functions for interacting with external services

/**
 * Base API configuration
 */
const API_CONFIG = {
  baseUrl: '',  // Will be populated if/when we connect to an external API
  headers: {
    'Content-Type': 'application/json'
  }
};

/**
 * Generic fetch wrapper with error handling
 * @param {string} endpoint - API endpoint
 * @param {Object} options - Fetch options
 * @returns {Promise} - Promise with the API response
 */
async function fetchApi(endpoint, options = {}) {
  try {
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
 * Mock API response for development and testing
 * @param {string} endpoint - Mocked endpoint
 * @param {Object} options - Request options
 * @returns {Promise} - Promise with mock data
 */
async function mockFetch(endpoint, options) {
  console.log('Using mock API for', endpoint);
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Get data from storage instead of an external API
  const data = await chrome.storage.local.get(['userData']);
  const userData = data.userData || {};
  
  // Mock different endpoints
  if (endpoint === '/user') {
    return { user: userData.user || { name: 'Guest User' } };
  }
  
  if (endpoint === '/notes') {
    return { notes: userData.notes || [] };
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
 * Get notes data
 * @returns {Promise} - Promise with notes data
 */
export async function getNotes() {
  return fetchApi('/notes');
}

/**
 * Save a note
 * @param {Object} note - Note to save
 * @returns {Promise} - Promise with the saved note
 */
export async function saveNote(note) {
  // Get current data
  const data = await chrome.storage.local.get(['userData']);
  const userData = data.userData || {};
  const notes = userData.notes || [];
  
  // Update or add the note
  let updated = false;
  const updatedNotes = notes.map(n => {
    if (n.id === note.id) {
      updated = true;
      return { ...n, ...note, updatedAt: new Date().toISOString() };
    }
    return n;
  });
  
  // If note wasn't found, add it
  if (!updated) {
    updatedNotes.push({
      ...note,
      id: note.id || Date.now().toString(36),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  }
  
  // Save to storage
  await chrome.storage.local.set({
    userData: {
      ...userData,
      notes: updatedNotes
    }
  });
  
  return note;
}
