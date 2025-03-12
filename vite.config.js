// vite.config.js
export default {
  // Use the current directory as the root
  root: '.',
  
  // Configure the development server
  server: {
    port: 3000,
    open: true, // Automatically open browser on start
    cors: true  // Enable CORS for API requests
  },
  
  // Build configuration
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: true
  },
  
  // Resolve configuration
  resolve: {
    // Allow bare module imports from these directories
    alias: {
      '/shared': '/shared',
      '/pages': '/pages',
      '/styles': '/styles'
    }
  },
  
  // Optimize dependencies
  optimizeDeps: {
    include: []
  },
  
  // Environment variables prefix
  envPrefix: 'VITE_'
}