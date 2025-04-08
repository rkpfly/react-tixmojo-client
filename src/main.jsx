/**
 * Entry point dispatcher for both client and server rendering
 * 
 * This file determines whether to use client hydration (if server-rendered)
 * or regular client rendering for static deployments
 */

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

// Check if we have server-rendered content
const hasServerData = isBrowser && window.__INITIAL_DATA__;

// In environments without server rendering (like Netlify), ensure the app starts
if (isBrowser) {
  if (hasServerData) {
    // Server-rendered - use hydration
    import('./client.jsx');
  } else {
    // Client-only rendering for static deployments and development
    import('./clientDev.jsx').catch(error => {
      console.error('Failed to load client entry point:', error);
      // Display a helpful error message if the app fails to load
      document.getElementById('root').innerHTML = `
        <div style="max-width: 600px; margin: 100px auto; padding: 20px; font-family: sans-serif; text-align: center;">
          <h1 style="color: #6F44FF">TixMojo - Loading Error</h1>
          <p>Sorry, we encountered an error while loading the application. Please try refreshing the page.</p>
          <button onclick="window.location.reload()" style="background: #6F44FF; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; margin-top: 20px;">
            Refresh Page
          </button>
        </div>
      `;
    });
  }
}

// Export for potential SSR usage
export { default as App } from './App';

// Export for server to check if hydration is supported
export const supportsHydration = true;
