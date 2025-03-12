// store.js - Simple data store for managing application state

// Internal state object
let state = {
  userData: {},
  currentPage: null,
  isLoading: false,
  notifications: [],
  user: null,
  session: null
};

// Subscribe callback functions
const subscribers = [];

/**
 * Initialize the store with data from localStorage
 * @returns {Promise} - Promise that resolves when store is initialized
 */
export async function initStore() {
  try {
    // Get data from localStorage
    const userData = localStorage.getItem('userData');
    
    // Initialize state with stored data
    state = {
      ...state,
      userData: userData ? JSON.parse(userData) : {},
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
  
  // Save relevant parts to localStorage
  if (newState.userData) {
    localStorage.setItem('userData', JSON.stringify(state.userData));
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

/**
 * Store object with simplified interface for use in components
 */
export const store = {
  /**
   * Get a value from the store
   * @param {string} key - Key to get
   * @returns {any} - Value for the key
   */
  get(key) {
    return getState(key);
  },
  
  /**
   * Set a value in the store
   * @param {string} key - Key to set
   * @param {any} value - Value to set
   * @returns {Object} - Updated state
   */
  set(key, value) {
    const update = {};
    update[key] = value;
    return updateState(update);
  },
  
  /**
   * Subscribe to store changes
   * @param {Function} callback - Function to call when store changes
   * @returns {Function} - Function to unsubscribe
   */
  subscribe(callback) {
    return subscribe(callback);
  }
};
