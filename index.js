// index.js - Main entry point for the web application

// Import core modules
import { initRouter, router } from './shared/router.js';
import { initStore } from './shared/store.js';
import { initThemeManager } from './shared/theme-manager.js';
import { auth } from './shared/auth.js';

// Import pages - this ensures they are registered with the router
// When adding a new page, just import it here
import './pages/home/home.js';
import './pages/login/login.js';

// Initialize the application when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', async () => {
  console.log('inNotion web app initialized');
  
  // Initialize the theme manager
  await initThemeManager();
  
  // Initialize the data store
  await initStore();
  
  // Initialize the router
  initRouter();
  
  // Check if user is logged in
  const { data } = await auth.getSession();
  
  // Navigate to home or login based on auth state
  if (data?.session) {
    router.navigate('/');
  } else {
    // Uncomment this to redirect to login if not authenticated
    // router.navigate('/login');
    
    // For now, just go to home page
    router.navigate('/');
  }
  
  // Hide loading indicator when not needed
  const loadingIndicator = document.getElementById('loading-indicator');
  if (loadingIndicator) {
    loadingIndicator.classList.add('hidden');
  }
});