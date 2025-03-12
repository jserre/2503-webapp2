import { createClient } from '@supabase/supabase-js';
import { store } from './store.js';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase credentials. Check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Auth state management
export const auth = {
  /**
   * Sign up a new user with email and password
   * @param {string} email - User's email
   * @param {string} password - User's password
   * @returns {Promise} - Supabase signup response
   */
  async signUp(email, password) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) throw error;
      
      // Update store with user data if signup was successful
      if (data?.user) {
        store.set('user', data.user);
        store.set('session', data.session);
      }
      
      return { data, error: null };
    } catch (error) {
      console.error('Error signing up:', error.message);
      return { data: null, error };
    }
  },
  
  /**
   * Sign in a user with email and password
   * @param {string} email - User's email
   * @param {string} password - User's password
   * @returns {Promise} - Supabase signin response
   */
  async signIn(email, password) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      // Update store with user data
      store.set('user', data.user);
      store.set('session', data.session);
      
      return { data, error: null };
    } catch (error) {
      console.error('Error signing in:', error.message);
      return { data: null, error };
    }
  },
  
  /**
   * Sign in with a third-party provider
   * @param {string} provider - 'google', 'github', 'facebook', etc.
   * @returns {Promise} - Supabase OAuth response
   */
  async signInWithProvider(provider) {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
      });
      
      if (error) throw error;
      
      return { data, error: null };
    } catch (error) {
      console.error(`Error signing in with ${provider}:`, error.message);
      return { data: null, error };
    }
  },
  
  /**
   * Sign out the current user
   * @returns {Promise} - Supabase signout response
   */
  async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;
      
      // Clear user data from store
      store.set('user', null);
      store.set('session', null);
      
      return { error: null };
    } catch (error) {
      console.error('Error signing out:', error.message);
      return { error };
    }
  },
  
  /**
   * Get the current session
   * @returns {Promise} - Current session data
   */
  async getSession() {
    try {
      const { data, error } = await supabase.auth.getSession();
      
      if (error) throw error;
      
      // Update store with session data
      if (data?.session) {
        store.set('session', data.session);
        store.set('user', data.session.user);
      }
      
      return { data, error: null };
    } catch (error) {
      console.error('Error getting session:', error.message);
      return { data: null, error };
    }
  },
  
  /**
   * Reset password for a user
   * @param {string} email - User's email
   * @returns {Promise} - Supabase password reset response
   */
  async resetPassword(email) {
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) throw error;
      
      return { data, error: null };
    } catch (error) {
      console.error('Error resetting password:', error.message);
      return { data: null, error };
    }
  },
  
  /**
   * Update user password
   * @param {string} newPassword - New password
   * @returns {Promise} - Supabase update response
   */
  async updatePassword(newPassword) {
    try {
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      
      if (error) throw error;
      
      return { data, error: null };
    } catch (error) {
      console.error('Error updating password:', error.message);
      return { data: null, error };
    }
  },
  
  /**
   * Set up auth state change listener
   * @param {Function} callback - Function to call on auth state change
   * @returns {Function} - Unsubscribe function
   */
  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        store.set('user', session.user);
        store.set('session', session);
      } else if (event === 'SIGNED_OUT') {
        store.set('user', null);
        store.set('session', null);
      }
      
      if (callback) callback(event, session);
    });
  },
  
  /**
   * Initialize auth - check for existing session and set up listeners
   * @returns {Promise} - Session data if exists
   */
  async initialize() {
    // Check for existing session
    const sessionResult = await this.getSession();
    
    // Set up auth state change listener
    this.onAuthStateChange();
    
    return sessionResult;
  }
};

// Initialize auth when this module is imported
auth.initialize().catch(err => {
  console.error('Failed to initialize auth:', err);
});