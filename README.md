# inNotion Chrome Extension

A Chrome extension that provides a Notion-like interface in the Chrome side panel. Built with vanilla JavaScript and CSS.

## Features

- Opens in Chrome's side panel when the extension icon is clicked
- Notion-inspired design with clean UI
- Simple note-taking functionality
- Page-based architecture for easy development

## Project Structure

```
├── manifest.json        # Extension configuration
├── background.js        # Service worker for background events
├── sidepanel.html       # Main HTML for the side panel
├── sidepanel.js         # Main entry point for the side panel
├── /shared/             # Shared utilities and functionality
│   ├── router.js        # Simple page-based router
│   ├── store.js         # State management
│   ├── utils.js         # Utility functions
│   └── api.js           # API functions
├── /styles/             # Global styles
│   ├── variables.css    # CSS variables and theme
│   └── main.css         # Global styles
├── /pages/              # Individual pages
│   └── /home/           # Home page
│       ├── home.js      # Home page logic
│       └── home.css     # Home page styles
└── icon128.png          # Extension icon
```

## Development

### Installation

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" in the top right corner
3. Click "Load unpacked" and select the project folder

### Making Changes

- The project uses a simple page-based architecture
- Each page has its own folder with JS and CSS files
- The router handles navigation between pages
- Global styles are in the `/styles` directory
- Shared functionality is in the `/shared` directory

### Adding a New Page

1. Create a new folder in `/pages` (e.g., `/pages/settings/`)
2. Create the page files (e.g., `settings.js` and `settings.css`)
3. Register the page with the router in your JS file:

```javascript
import { registerPage } from '../../shared/router.js';

function initSettingsPage(container, params) {
  // Page initialization code
}

// Register the page
registerPage('settings', initSettingsPage);

export default initSettingsPage;
```

4. Navigate to the page using:

```javascript
import { navigateTo } from '../../shared/router.js';

// Navigate to the settings page
navigateTo('settings');
```

## Data Storage

The extension uses Chrome's storage API to persist data. The `store.js` file provides a simple interface for managing state and saving to storage.
