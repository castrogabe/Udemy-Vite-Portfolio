// vite.config.js
// -------------------------------------------------------------
// This is the configuration file for Vite, the build tool
// that powers our React app.
// -------------------------------------------------------------
// Vite is designed for fast development and optimized builds.
// It uses native ES modules in the browser for instant updates
// and provides lightning-fast hot module replacement (HMR).
// -------------------------------------------------------------

import { defineConfig } from 'vite'; // Vite’s helper for structured config
import react from '@vitejs/plugin-react'; // Plugin adds React & JSX support

// -------------------------------------------------------------
// Export Vite configuration
// -------------------------------------------------------------
// This configuration tells Vite to use the React plugin.
// You can also customize ports, aliases, proxy settings, etc. here.
// -------------------------------------------------------------
export default defineConfig({
  plugins: [react()], // Enables React Fast Refresh and JSX syntax support
});
