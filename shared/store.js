// store.js - Simple data store for managing application state

// Internal state object
let state = {
  userData: {},
  currentPage: null,
  isLoading: false,
  notifications: []
};

// Subscribe callback functions
const subscribers = [];

/**
 * Initialize the store with data from Chrome storage
 * @returns {Promise} - Promise that resolves when store is initialized
 */
export async function initStore() {
  try {
    // Get data from Chrome storage
    const data = await chrome.storage.local.get(['userData']);
    
    // Initialize state with stored data
    state = {
      ...state,
      userData: data.userData || {},
      isLoading: false
    };
    
    console.log('Store initialized', state);
    
    // Notify subscribers of state change
    notifySubscribers();
    
    return state;
  } catch (error) {
    console.error('Failed to initialize store:', error);
    return state;
  }
}

/**
 * Get the current state or a specific part of it
 * @param {string} key - Optional key to get a specific part of the state
 * @returns {Object} - The requested state
 */
export function getState(key = null) {
  if (key && key in state) {
    return state[key];
  }
  return state;
}

/**
 * Update the state
 * @param {Object} newState - New state to merge with current state
 */
export function updateState(newState) {
  // Merge new state with current state
  state = { ...state, ...newState };
  
  // Save relevant parts to Chrome storage
  if (newState.userData) {
    chrome.storage.local.set({ userData: state.userData });
  }
  
  // Notify subscribers of state change
  notifySubscribers();
  
  return state;
}

/**
 * Subscribe to state changes
 * @param {Function} callback - Function to call when state changes
 * @returns {Function} - Function to unsubscribe
 */
export function subscribe(callback) {
  subscribers.push(callback);
  
  // Return unsubscribe function
  return () => {
    const index = subscribers.indexOf(callback);
    if (index !== -1) {
      subscribers.splice(index, 1);
    }
  };
}

/**
 * Notify all subscribers of state changes
 */
function notifySubscribers() {
  subscribers.forEach(callback => callback(state));
}
