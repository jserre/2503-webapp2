// home.js - Home page logic and rendering

// Import shared utilities and data management
import { formatDate, generateId } from '../../shared/utils.js';
import { registerPage } from '../../shared/router.js';
import { getState, updateState, subscribe } from '../../shared/store.js';
import { getNotes, saveNote } from '../../shared/api.js';
import { getCurrentTheme, setTheme, ThemeMode } from '../../shared/theme-manager.js';

/**
 * Initialize the home page
 * @param {HTMLElement} container - Container element to render the page into
 * @param {Object} params - Optional parameters passed during navigation
 */
async function initHomePage(container, params = {}) {
  try {
    // Load the HTML for this page
    const response = await fetch('./pages/home/home.html');
    const html = await response.text();
    
    // Insert the HTML into the container
    container.innerHTML = html;
    
    // Initialize page elements after HTML is loaded
    initializePageElements();
    
    // Load notes from storage
    await loadNotes();
    
    // Subscribe to state changes
    subscribe(state => {
      if (state.userData.notes) {
        renderNotes(state.userData.notes);
      }
    });
  } catch (error) {
    console.error('Error initializing home page:', error);
    container.innerHTML = '<div class="error-message">Failed to load home page</div>';
  }
}

/**
 * Initialize page elements and event listeners
 */
function initializePageElements() {
  // Get references to page elements
  const noteInput = document.getElementById('note-input');
  
  // Add event listeners
  if (noteInput) {
    noteInput.addEventListener('keydown', handleNoteInputKeydown);
  }
  
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

/**
 * Handle keydown on the note input
 * @param {Event} event - Keydown event
 */
function handleNoteInputKeydown(event) {
  if (event.key === 'Enter' && event.target.value.trim()) {
    // Create a new note
    const note = {
      id: generateId(),
      content: event.target.value.trim(),
      createdAt: new Date().toISOString()
    };
    
    // Save the note
    saveNote(note).then(() => {
      // Clear the input
      event.target.value = '';
    });
  }
}

/**
 * Load notes from storage
 */
async function loadNotes() {
  try {
    const notesContainer = document.getElementById('notes-container');
    
    if (notesContainer) {
      // Show loading state
      notesContainer.innerHTML = '<div class="spinner"></div>';
      
      // Get notes from API (which uses storage)
      const { notes } = await getNotes();
      
      // Render the notes
      renderNotes(notes);
    }
  } catch (error) {
    console.error('Failed to load notes:', error);
    const notesContainer = document.getElementById('notes-container');
    if (notesContainer) {
      notesContainer.innerHTML = '<div class="error-message">Failed to load notes</div>';
    }
  }
}

/**
 * Render notes in the container
 * @param {Array} notes - Array of note objects
 */
function renderNotes(notes) {
  const notesContainer = document.getElementById('notes-container');
  const emptyState = document.getElementById('empty-state');
  
  if (!notesContainer) return;
  
  // Clear the container
  notesContainer.innerHTML = '';
  
  // Show or hide empty state based on notes
  if (!notes || notes.length === 0) {
    if (emptyState) emptyState.classList.remove('hidden');
    return;
  }
  
  // Hide empty state if we have notes
  if (emptyState) emptyState.classList.add('hidden');
  
  // Sort notes by creation date (newest first)
  const sortedNotes = [...notes].sort((a, b) => {
    return new Date(b.createdAt) - new Date(a.createdAt);
  });
  
  // Create note cards
  sortedNotes.forEach(note => {
    const noteCard = document.createElement('div');
    noteCard.className = 'note-card card';
    
    noteCard.innerHTML = `
      <p class="note-content">${note.content}</p>
      <div class="note-footer">
        <span class="note-date">${formatDate(note.createdAt)}</span>
        <button class="note-delete-btn" data-note-id="${note.id}">Delete</button>
      </div>
    `;
    
    // Add event listener to delete button
    const deleteBtn = noteCard.querySelector('.note-delete-btn');
    if (deleteBtn) {
      deleteBtn.addEventListener('click', () => deleteNote(note.id));
    }
    
    notesContainer.appendChild(noteCard);
  });
}

/**
 * Delete a note
 * @param {string} noteId - ID of the note to delete
 */
async function deleteNote(noteId) {
  try {
    // Get current state
    const state = getState();
    const notes = state.userData.notes || [];
    
    // Filter out the deleted note
    const updatedNotes = notes.filter(note => note.id !== noteId);
    
    // Update state
    updateState({
      userData: {
        ...state.userData,
        notes: updatedNotes
      }
    });
    
    // Save to storage
    await chrome.storage.local.set({
      userData: {
        ...state.userData,
        notes: updatedNotes
      }
    });
  } catch (error) {
    console.error('Failed to delete note:', error);
  }
}

// Register the page with the router
registerPage('home', initHomePage);

// Export the init function for direct access if needed
export default initHomePage;
