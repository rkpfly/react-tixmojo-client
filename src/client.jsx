/**
 * Client entry point for hydration
 * This file coordinates hydration of server-rendered content
 */

// Import from our utility to ensure JSX runtime is properly resolved
import { hydrateRoot, StrictMode } from './utils/jsxRuntime';
import { HelmetProvider } from 'react-helmet-async';
import { GoogleOAuthProvider } from '@react-oauth/google';
import App from './App';
import './Style/imports.css';

// Ensure the page is scrolled to top on refresh
if (history.scrollRestoration) {
  history.scrollRestoration = 'manual';
}

// Reset scroll position on page load
window.onload = () => {
  window.scrollTo(0, 0);
};

// Get the initial data injected by the server
const initialData = window.__INITIAL_DATA__ || {};

// Google OAuth client ID from environment variables
const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

// Check if we have a valid-looking Google OAuth client ID
const isValidGoogleClientId = googleClientId &&
  googleClientId.includes('.apps.googleusercontent.com') &&
  googleClientId.length > 30;

if (!isValidGoogleClientId) {
  console.warn(
    "Warning: Google OAuth client ID appears to be invalid or missing. " +
    "Google login functionality may not work correctly."
  );
}

// Use hydration for server-rendered content
const rootElement = document.getElementById('root');

// Start performance measurement
const startHydration = performance.now();

// Set up hydration
hydrateRoot(
  rootElement,
  <StrictMode>
    <HelmetProvider>
      <GoogleOAuthProvider clientId={googleClientId}>
        <App serverData={initialData} />
      </GoogleOAuthProvider>
    </HelmetProvider>
  </StrictMode>
);

// Measure and report hydration time
window.addEventListener('load', () => {
  const hydrationTime = performance.now() - startHydration;
  console.log(`Hydration completed in ${Math.round(hydrationTime)}ms`);

  // Report as a performance metric
  if (window.performance && window.performance.mark) {
    performance.mark('hydration-end');
    performance.measure('hydration', 'navigationStart', 'hydration-end');
  }
});