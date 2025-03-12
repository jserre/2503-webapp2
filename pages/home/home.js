// home.js - Home page logic and rendering

// Import shared utilities and data management
import { registerPage } from '../../shared/router.js';
import { getCurrentTheme, setTheme, ThemeMode } from '../../shared/theme-manager.js';

/**
 * Initialize the home page
 * @param {HTMLElement} container - Container element to render the page into
 * @param {Object} params - Optional parameters passed during navigation
 */
async function initHomePage(container, params = {}) {
  try {
    // Load the HTML for this page
    const response = await fetch('/pages/home/home.html');
    const html = await response.text();
    
    // Insert the HTML into the container
    container.innerHTML = html;
    
    // Initialize page elements after HTML is loaded
    initializePageElements();
  } catch (error) {
    console.error('Error initializing home page:', error);
    container.innerHTML = '<div class="error-message">Failed to load home page</div>';
  }
}

/**
 * Initialize page elements and event listeners
 */
function initializePageElements() {
  // Initialize theme switcher
  initThemeSwitcher();
}

/**
 * Initialize the theme switcher
 */
function initThemeSwitcher() {
  // Get all theme toggle buttons
  const themeToggles = document.querySelectorAll('[data-theme-toggle]');
  
  // Mark the current theme as active
  const currentTheme = getCurrentTheme();
  themeToggles.forEach(toggle => {
    const themeValue = toggle.getAttribute('data-theme-toggle');
    if (themeValue === currentTheme) {
      toggle.classList.add('active');
      toggle.setAttribute('aria-pressed', 'true');
    }
    
    // Add click event listener to each toggle
    toggle.addEventListener('click', () => {
      const theme = toggle.getAttribute('data-theme-toggle');
      
      // Set the theme
      setTheme(theme);
      
      // Update UI
      themeToggles.forEach(btn => {
        if (btn === toggle) {
          btn.classList.add('active');
          btn.setAttribute('aria-pressed', 'true');
        } else {
          btn.classList.remove('active');
          btn.setAttribute('aria-pressed', 'false');
        }
      });
    });
  });
}

// Register the page with the router
registerPage('home', initHomePage);

// Export the init function for direct access if needed
export default initHomePage;
