// router.js - Simple page-based router for navigation between pages

// Map of registered pages with their load functions
const pages = {};

// Track loaded CSS files to avoid duplicates
const loadedStyles = new Set();

// Page container element reference
let pageContainer;

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
  
  console.log('Router initialized');
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
 * Navigate to a specific page
 * @param {string} pageName - Name of the page to navigate to
 * @param {Object} params - Optional parameters to pass to the page
 */
export function navigateTo(pageName, params = {}) {
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
          
          // Call the page load function
          pages[pageName](pageEl, params);
          
          console.log(`Navigated to page: ${pageName}`);
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
