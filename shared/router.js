// router.js - Simple page-based router for navigation between pages

// Map of registered pages with their load functions and cleanup functions
const pages = {};

// Map of routes to page names
const routes = {
  '/': 'home',
  '/login': 'login',
  // Add more routes as needed
};

// Track loaded CSS files to avoid duplicates
const loadedStyles = new Set();

// Page container element reference
let pageContainer;

// Current active page cleanup function
let currentPageCleanup = null;

/**
 * Initialize the router
 */
export function initRouter() {
  pageContainer = document.getElementById('page-container');
  
  // Check if container exists
  if (!pageContainer) {
    console.error('Page container not found');
    return;
  }
  
  // Handle initial route
  handleRouteChange();
  
  // Listen for popstate events (browser back/forward)
  window.addEventListener('popstate', handleRouteChange);
  
  console.log('Router initialized');
}

/**
 * Handle route changes
 */
function handleRouteChange() {
  const path = window.location.pathname;
  const pageName = routes[path] || 'home'; // Default to home if route not found
  
  loadPage(pageName);
}

/**
 * Register a page with the router
 * @param {string} pageName - Name of the page
 * @param {Function} loadFunction - Function to load the page content
 */
export function registerPage(pageName, loadFunction) {
  pages[pageName] = loadFunction;
  console.log(`Page registered: ${pageName}`);
}

/**
 * Load CSS for a page
 * @param {string} pageName - Name of the page
 * @returns {Promise} - Promise that resolves when CSS is loaded
 */
async function loadPageCSS(pageName) {
  const cssPath = `/pages/${pageName}/${pageName}.css`;
  
  // Skip if already loaded
  if (loadedStyles.has(cssPath)) {
    return Promise.resolve();
  }
  
  return new Promise((resolve) => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = cssPath;
    link.onload = () => {
      loadedStyles.add(cssPath);
      resolve();
    };
    link.onerror = () => {
      console.error(`Failed to load CSS for page: ${pageName}`);
      resolve(); // Resolve anyway to not block page loading
    };
    document.head.appendChild(link);
  });
}

/**
 * Load a specific page
 * @param {string} pageName - Name of the page to load
 * @param {Object} params - Optional parameters to pass to the page
 */
function loadPage(pageName, params = {}) {
  // Clean up current page if needed
  if (currentPageCleanup && typeof currentPageCleanup === 'function') {
    currentPageCleanup();
    currentPageCleanup = null;
  }
  
  // Clear existing content
  if (pageContainer) {
    pageContainer.innerHTML = '';
    
    // Show loading state
    const loadingEl = document.createElement('div');
    loadingEl.className = 'loading-container';
    loadingEl.innerHTML = '<div class="spinner"></div>';
    pageContainer.appendChild(loadingEl);
    
    // Check if the page exists
    if (pages[pageName]) {
      // Load the page CSS first
      loadPageCSS(pageName).then(() => {
        // Add a small delay to show the loading animation
        setTimeout(() => {
          // Remove loading indicator
          pageContainer.removeChild(loadingEl);
          
          // Create page container
          const pageEl = document.createElement('div');
          pageEl.className = `page ${pageName}-page`;
          pageContainer.appendChild(pageEl);
          
          // Load page HTML
          fetch(`/pages/${pageName}/${pageName}.html`)
            .then(response => response.text())
            .then(html => {
              pageEl.innerHTML = html;
              
              // Call the page load function and store cleanup function if returned
              const cleanup = pages[pageName](pageEl, params);
              if (typeof cleanup === 'function') {
                currentPageCleanup = cleanup;
              }
              
              console.log(`Navigated to page: ${pageName}`);
            })
            .catch(error => {
              console.error(`Failed to load HTML for page: ${pageName}`, error);
              pageEl.innerHTML = `<div class="error-message">Failed to load page content</div>`;
            });
        }, 300);
      });
    } else {
      console.error(`Page not found: ${pageName}`);
      
      // Remove loading and show error
      pageContainer.removeChild(loadingEl);
      
      const errorEl = document.createElement('div');
      errorEl.className = 'error-message';
      errorEl.textContent = `Page not found: ${pageName}`;
      pageContainer.appendChild(errorEl);
    }
  }
}

/**
 * Navigate to a specific page
 * @param {string} pageName - Name of the page to navigate to
 * @param {Object} params - Optional parameters to pass to the page
 */
export function navigateTo(pageName, params = {}) {
  loadPage(pageName, params);
}

/**
 * Router object for navigation
 */
export const router = {
  /**
   * Navigate to a path
   * @param {string} path - Path to navigate to
   * @param {Object} params - Optional parameters
   * @param {boolean} pushState - Whether to push state to history
   */
  navigate(path, params = {}, pushState = true) {
    const pageName = routes[path] || 'home';
    
    // Update browser history
    if (pushState) {
      window.history.pushState({}, '', path);
    }
    
    // Load the page
    loadPage(pageName, params);
  },
  
  /**
   * Register a new route
   * @param {string} path - Path to register
   * @param {string} pageName - Page name to associate with the path
   */
  registerRoute(path, pageName) {
    routes[path] = pageName;
  },
  
  /**
   * Get the current page name
   * @returns {string} - Current page name
   */
  getCurrentPage() {
    const path = window.location.pathname;
    return routes[path] || 'home';
  }
};
