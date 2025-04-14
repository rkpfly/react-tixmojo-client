/**
 * Client entry point for non-SSR environments
 * Used for development and static deployments (like Netlify)
 */

// Direct imports to avoid JSX runtime resolution issues
import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { GoogleOAuthProvider } from '@react-oauth/google';
import App from './App';
import './Style/imports.css';
import './Style/loader.css';
import './Style/sidebarAnimation.css';
import './Style/eventTabs.css';
import './Style/ticketSelection.css';
import './Style/paymentPortal.css';

// Ensure the page is scrolled to top on refresh
if (typeof history !== 'undefined' && history.scrollRestoration) {
  history.scrollRestoration = 'manual';
}

// Reset scroll position on page load
if (typeof window !== 'undefined') {
  window.onload = () => {
    window.scrollTo(0, 0);
  };
}

// Google OAuth client ID from environment variables
const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

// Check if we have a valid-looking Google OAuth client ID
const isValidGoogleClientId = googleClientId &&
  googleClientId.includes('.apps.googleusercontent.com') &&
  googleClientId.length > 30;

if (!isValidGoogleClientId) {
  console.warn(
    'Warning: Google OAuth client ID appears to be invalid or missing. ' +
    'Google login functionality may not work correctly.'
  );
}

// Function to initialize the app
function initializeApp() {
  try {
    // Check if root element exists
    const rootElement = document.getElementById('root');
    if (!rootElement) {
      console.error('Root element not found!');
      return;
    }

    // Use standard createRoot for client-side rendering
    const root = createRoot(rootElement);

    // Render the app
    console.log('Static deployment: Using client-side rendering');
    root.render(
      <StrictMode>
        <HelmetProvider>
          <GoogleOAuthProvider clientId={googleClientId}>
            <App />
          </GoogleOAuthProvider>
        </HelmetProvider>
      </StrictMode>
    );
  } catch (error) {
    console.error('Error initializing app:', error);
    // Display error message if rendering fails
    const rootElement = document.getElementById('root');
    if (rootElement) {
      rootElement.innerHTML = `
        <div style="max-width: 600px; margin: 100px auto; padding: 20px; font-family: sans-serif; text-align: center;">
          <h1 style="color: #6F44FF">TixMojo - Error</h1>
          <p>Sorry, we encountered an error while initializing the application.</p>
          <pre style="text-align: left; background: #f5f5f5; padding: 10px; border-radius: 4px; overflow: auto;">${error.message}</pre>
          <button onclick="window.location.reload()" style="background: #6F44FF; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; margin-top: 20px;">
            Try Again
          </button>
        </div>
      `;
    }
  }
}

// Initialize the app
initializeApp();