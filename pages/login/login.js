// login.js - Login page logic and rendering

// Import shared utilities and data management
import { registerPage } from '../../shared/router.js';
import { auth } from '../../shared/auth.js';
import { router } from '../../shared/router.js';
import { store } from '../../shared/store.js';

/**
 * Initialize the login page
 * @param {HTMLElement} container - Container element to render the page into
 * @param {Object} params - Optional parameters passed during navigation
 */
async function initLoginPage(container, params = {}) {
  try {
    // Load the HTML for this page
    const response = await fetch('/pages/login/login.html');
    const html = await response.text();
    
    // Insert the HTML into the container
    container.innerHTML = html;
    
    // Initialize page elements after HTML is loaded
    initializePageElements();
  } catch (error) {
    console.error('Error initializing login page:', error);
    container.innerHTML = '<div class="error-message">Failed to load login page</div>';
  }
}

/**
 * Initialize page elements and event listeners
 */
function initializePageElements() {
  // DOM elements
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const loginButton = document.getElementById('login-button');
  const signupButton = document.getElementById('signup-button');
  const googleLoginButton = document.getElementById('google-login');
  const forgotPasswordLink = document.getElementById('forgot-password');
  const authMessage = document.getElementById('auth-message');
  
  // Check if user is already logged in
  const session = store.get('session');
  if (session) {
    // Redirect to home if already logged in
    router.navigate('/');
    return;
  }
  
  // Event listeners
  loginButton.addEventListener('click', handleLogin);
  signupButton.addEventListener('click', handleSignup);
  googleLoginButton.addEventListener('click', handleGoogleLogin);
  forgotPasswordLink.addEventListener('click', handleForgotPassword);
  
  // Form submission
  const form = document.querySelector('.auth-form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    handleLogin();
  });
  
  // Login handler
  async function handleLogin() {
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    
    if (!validateForm(email, password)) return;
    
    showLoading(loginButton, 'Logging in...');
    
    try {
      const { data, error } = await auth.signIn(email, password);
      
      if (error) throw error;
      
      showSuccessMessage('Login successful! Redirecting...');
      
      // Redirect to home page after successful login
      setTimeout(() => {
        router.navigate('/');
      }, 1500);
    } catch (error) {
      console.error('Login error:', error);
      // Make sure the error message is displayed
      const errorMsg = error.message || 'Failed to login. Please try again.';
      showErrorMessage(errorMsg);
      
      // Force the auth-message element to be visible
      const authMessage = document.getElementById('auth-message');
      if (authMessage) {
        authMessage.style.display = 'block';
      }
    } finally {
      hideLoading(loginButton, 'Login');
    }
  }
  
  // Signup handler
  async function handleSignup() {
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    
    if (!validateForm(email, password)) return;
    
    showLoading(signupButton, 'Signing up...');
    
    try {
      const { data, error } = await auth.signUp(email, password);
      
      if (error) throw error;
      
      if (data?.user?.identities?.length === 0) {
        showErrorMessage('This email is already registered. Please login instead.');
      } else {
        showSuccessMessage('Sign up successful! Please check your email to confirm your account.');
      }
    } catch (error) {
      console.error('Signup error:', error);
      // Make sure the error message is displayed
      const errorMsg = error.message || 'Failed to sign up. Please try again.';
      showErrorMessage(errorMsg);
      
      // Force the auth-message element to be visible
      const authMessage = document.getElementById('auth-message');
      if (authMessage) {
        authMessage.style.display = 'block';
      }
    } finally {
      hideLoading(signupButton, 'Sign Up');
    }
  }
  
  // Google login handler
  async function handleGoogleLogin() {
    showLoading(googleLoginButton, 'Connecting...');
    
    try {
      const { data, error } = await auth.signInWithProvider('google');
      
      if (error) throw error;
      
      // The OAuth flow will redirect the user, so we don't need to do anything else here
    } catch (error) {
      console.error('Google login error:', error);
      // Make sure the error message is displayed
      const errorMsg = error.message || 'Failed to login with Google. Please try again.';
      showErrorMessage(errorMsg);
      
      // Force the auth-message element to be visible
      const authMessage = document.getElementById('auth-message');
      if (authMessage) {
        authMessage.style.display = 'block';
      }
      
      hideLoading(googleLoginButton, 'Continue with Google');
    }
  }
  
  // Forgot password handler
  async function handleForgotPassword(e) {
    e.preventDefault();
    
    const email = emailInput.value.trim();
    
    if (!email) {
      showErrorMessage('Please enter your email address to reset your password.');
      emailInput.focus();
      
      // Force the auth-message element to be visible
      const authMessage = document.getElementById('auth-message');
      if (authMessage) {
        authMessage.style.display = 'block';
      }
      
      return;
    }
    
    try {
      const { error } = await auth.resetPassword(email);
      
      if (error) throw error;
      
      showSuccessMessage('Password reset instructions have been sent to your email.');
    } catch (error) {
      console.error('Password reset error:', error);
      // Make sure the error message is displayed
      const errorMsg = error.message || 'Failed to send reset instructions. Please try again.';
      showErrorMessage(errorMsg);
      
      // Force the auth-message element to be visible
      const authMessage = document.getElementById('auth-message');
      if (authMessage) {
        authMessage.style.display = 'block';
      }
    }
  }
  
  // Form validation
  function validateForm(email, password) {
    if (!email) {
      showErrorMessage('Please enter your email address.');
      emailInput.focus();
      return false;
    }
    
    if (!isValidEmail(email)) {
      showErrorMessage('Please enter a valid email address.');
      emailInput.focus();
      return false;
    }
    
    if (!password) {
      showErrorMessage('Please enter your password.');
      passwordInput.focus();
      return false;
    }
    
    if (password.length < 6) {
      showErrorMessage('Password must be at least 6 characters long.');
      passwordInput.focus();
      return false;
    }
    
    return true;
  }
  
  // Email validation
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  
  // UI helpers
  function showErrorMessage(message) {
    authMessage.textContent = message;
    authMessage.className = 'auth-message error';
    authMessage.style.display = 'block';
    
    console.error('Error:', message);
  }
  
  function showSuccessMessage(message) {
    authMessage.textContent = message;
    authMessage.className = 'auth-message success';
    authMessage.style.display = 'block';
    
    console.log('Success:', message);
  }
  
  function showLoading(button, loadingText) {
    button.disabled = true;
    button.textContent = loadingText;
  }
  
  function hideLoading(button, originalText) {
    button.disabled = false;
    button.textContent = originalText;
  }
}

// Register the page with the router
registerPage('login', initLoginPage);

// Export the init function for direct access if needed
export default initLoginPage;