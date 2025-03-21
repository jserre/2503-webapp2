// index.js - Main entry point for the web application

// Import core modules
import { initRouter, navigateTo } from './shared/router.js';
import { initStore } from './shared/store.js';
import { initThemeManager } from './shared/theme-manager.js';

// Import pages - this ensures they are registered with the router
// When adding a new page, just import it here
import './pages/home/home.js';

// Initialize the application when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', async () => {
  console.log('inNotion web app initialized');
  
  // Initialize the theme manager
  await initThemeManager();
  
  // Initialize the data store
  await initStore();
  
  // Initialize the router and navigate to the home page
  initRouter();
  navigateTo('home');
  
  // Hide loading indicator when not needed
  const loadingIndicator = document.getElementById('loading-indicator');
  if (loadingIndicator) {
    loadingIndicator.classList.add('hidden');
  }
});