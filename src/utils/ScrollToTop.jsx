import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * ScrollToTop component that automatically scrolls to the top of the page
 * when the route changes, when the app is refreshed, or when browser navigation occurs.
 */
const ScrollToTop = () => {
  const { pathname } = useLocation();

  // Scroll to top when route changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  // Handle refresh and browser navigation
  useEffect(() => {
    // Handle page refresh by using the beforeunload event
    const handleBeforeUnload = () => {
      sessionStorage.setItem("isRefreshing", "true");
    };

    // Function to scroll to top
    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "instant" // Use "instant" for immediate scroll
      });
    };
    
    // Scroll to top immediately on initial render
    scrollToTop();

    // Check if page was refreshed
    if (sessionStorage.getItem("isRefreshing")) {
      scrollToTop();
      sessionStorage.removeItem("isRefreshing");
    }

    // Handle popstate event (browser back/forward buttons)
    const handlePopState = () => {
      scrollToTop();
    };

    // Handle browser history navigation with pushState/replaceState
    const originalPushState = window.history.pushState;
    const originalReplaceState = window.history.replaceState;

    window.history.pushState = function() {
      originalPushState.apply(this, arguments);
      scrollToTop();
    };

    window.history.replaceState = function() {
      originalReplaceState.apply(this, arguments);
      scrollToTop();
    };

    // Add event listeners
    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("popstate", handlePopState);
    
    // Clean up
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", handlePopState);
      window.history.pushState = originalPushState;
      window.history.replaceState = originalReplaceState;
    };
  }, []);

  return null;
};

export default ScrollToTop;