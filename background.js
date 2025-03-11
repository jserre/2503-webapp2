// background.js - Service worker for managing side panel functionality

// Initialize the side panel when the extension is installed or updated
chrome.runtime.onInstalled.addListener(() => {
  console.log('inNotion extension installed or updated');
  
  // Set default options for the side panel
  chrome.sidePanel.setOptions({
    enabled: true,
    path: 'sidepanel.html'
  });
});

// Open the side panel when the extension icon is clicked
chrome.action.onClicked.addListener(async (tab) => {
  // Open the side panel for the current tab
  await chrome.sidePanel.open({ tabId: tab.id });
});

// Listen for messages from the side panel pages
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Received message:', message);
  
  // Process different types of messages
  switch (message.type) {
    case 'GET_USER_DATA':
      // Retrieve user data from storage
      chrome.storage.local.get(['userData'], (result) => {
        sendResponse({ userData: result.userData || {} });
      });
      return true; // Required for async sendResponse
      
    case 'SAVE_USER_DATA':
      // Save user data to storage
      if (message.data) {
        chrome.storage.local.set({ userData: message.data }, () => {
          sendResponse({ success: true });
        });
        return true; // Required for async sendResponse
      }
      sendResponse({ success: false, error: 'No data provided' });
      return false;
      
    default:
      sendResponse({ error: 'Unknown message type' });
      return false;
  }
});
