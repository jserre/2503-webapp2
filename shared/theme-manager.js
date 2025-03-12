// theme-manager.js - Manages theme switching between Light, Dark, and System modes

/**
 * Theme options
 * @enum {string}
 */
export const ThemeMode = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system'
};

/**
 * Key used for storing theme preference in localStorage
 * @type {string}
 */
const THEME_STORAGE_KEY = 'themePreference';

/**
 * Current theme mode
 * @type {ThemeMode}
 */
let currentTheme = ThemeMode.SYSTEM;

/**
 * Media query for detecting system dark mode preference
 * @type {MediaQueryList}
 */
const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

/**
 * Initialize the theme manager
 * - Loads saved theme preference
 * - Sets up system theme detection
 * - Applies the appropriate theme
 * @returns {Promise<ThemeMode>} The current theme mode
 */
export async function initThemeManager() {
  try {
    // Load saved theme preference
    const savedTheme = await loadThemePreference();
    
    // Set up listener for system theme changes
    darkModeMediaQuery.addEventListener('change', handleSystemThemeChange);
    
    // Apply the theme
    await setTheme(savedTheme || ThemeMode.SYSTEM);
    
    return currentTheme;
  } catch (error) {
    console.error('Failed to initialize theme manager:', error);
    // Default to system theme if there's an error
    applyTheme(ThemeMode.SYSTEM);
    return ThemeMode.SYSTEM;
  }
}

/**
 * Load the saved theme preference from localStorage
 * @returns {Promise<ThemeMode|null>} The saved theme preference or null if not found
 */
async function loadThemePreference() {
  try {
    const theme = localStorage.getItem(THEME_STORAGE_KEY);
    return theme || null;
  } catch (error) {
    console.error('Failed to load theme preference:', error);
    return null;
  }
}

/**
 * Save the theme preference to localStorage
 * @param {ThemeMode} theme - The theme to save
 * @returns {Promise<void>}
 */
async function saveThemePreference(theme) {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch (error) {
    console.error('Failed to save theme preference:', error);
  }
}

/**
 * Handle system theme changes
 * @param {MediaQueryListEvent} event - The media query change event
 */
function handleSystemThemeChange(event) {
  // Only update if we're using system theme
  if (currentTheme === ThemeMode.SYSTEM) {
    applyThemeToDOM(event.matches ? ThemeMode.DARK : ThemeMode.LIGHT);
  }
}

/**
 * Set the theme mode
 * @param {ThemeMode} theme - The theme mode to set
 * @returns {Promise<void>}
 */
export async function setTheme(theme) {
  if (!Object.values(ThemeMode).includes(theme)) {
    console.error(`Invalid theme: ${theme}`);
    return;
  }
  
  // Update current theme
  currentTheme = theme;
  
  // Save preference if not using system theme
  if (theme !== ThemeMode.SYSTEM) {
    await saveThemePreference(theme);
  } else {
    // For system theme, we still save the preference
    await saveThemePreference(ThemeMode.SYSTEM);
  }
  
  // Apply the theme
  applyTheme(theme);
}

/**
 * Apply the theme based on the selected mode
 * @param {ThemeMode} theme - The theme mode to apply
 */
function applyTheme(theme) {
  if (theme === ThemeMode.SYSTEM) {
    // Use system preference
    applyThemeToDOM(darkModeMediaQuery.matches ? ThemeMode.DARK : ThemeMode.LIGHT);
  } else {
    // Use explicit theme
    applyThemeToDOM(theme);
  }
}

/**
 * Apply the theme to the DOM
 * @param {ThemeMode} theme - The theme to apply (LIGHT or DARK only)
 */
function applyThemeToDOM(theme) {
  // Remove any existing theme classes
  document.documentElement.classList.remove('theme-light', 'theme-dark');
  
  // Add the appropriate theme class
  document.documentElement.classList.add(`theme-${theme}`);
  
  // Update any theme indicators in the UI
  updateThemeIndicators(currentTheme);
}

/**
 * Update theme indicators in the UI
 * @param {ThemeMode} activeTheme - The active theme mode
 */
function updateThemeIndicators(activeTheme) {
  // Find all theme toggle buttons
  const themeToggles = document.querySelectorAll('[data-theme-toggle]');
  
  themeToggles.forEach(toggle => {
    const themeValue = toggle.getAttribute('data-theme-toggle');
    
    // Mark the active theme
    if (themeValue === activeTheme) {
      toggle.setAttribute('aria-pressed', 'true');
      toggle.classList.add('active');
    } else {
      toggle.setAttribute('aria-pressed', 'false');
      toggle.classList.remove('active');
    }
  });
}

/**
 * Get the current theme mode
 * @returns {ThemeMode} The current theme mode
 */
export function getCurrentTheme() {
  return currentTheme;
}

/**
 * Check if dark mode is currently active
 * @returns {boolean} True if dark mode is active
 */
export function isDarkMode() {
  if (currentTheme === ThemeMode.DARK) {
    return true;
  }
  if (currentTheme === ThemeMode.SYSTEM) {
    return darkModeMediaQuery.matches;
  }
  return false;
}