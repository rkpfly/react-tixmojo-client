import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import App from "./App";
import "./Style/imports.css";

// Ensure the page is scrolled to top on refresh
if (history.scrollRestoration) {
  history.scrollRestoration = 'manual';
}

// Reset scroll position on page load
window.onload = () => {
  window.scrollTo(0, 0);
};

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </StrictMode>
);
