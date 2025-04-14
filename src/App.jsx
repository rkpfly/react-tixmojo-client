import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import PageNotFound from "./pages/PageNotFound";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import { useState, useEffect } from "react";
import { SidebarScroll } from "./Components/Sidebar";
import { UserSidebar } from "./Components/UserSidebar";
import { DefaultSEO } from "./utils/SEO";
import ScrollToTop from "./utils/ScrollToTop";
import React from "react";
import Loader from "./Components/Loader";
// GoogleOAuthProvider is managed in main.jsx for the entire app
import { AuthProvider } from "./context/AuthContext";
import { AnimationProvider, useAnimation } from "./context/AnimationContext";
import ProtectedRoute from "./Components/Auth/ProtectedRoute";

// Lazy load the components to handle any potential loading issues
const EventDetails = React.lazy(() => import("./pages/EventDetails"));
const Login = React.lazy(() => import("./pages/Login"));
const AboutUs = React.lazy(() => import("./pages/AboutUs"));

function AppContent({ serverData }) {
  const { setSidebarStatus } = useAnimation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isUserSidebarOpen, setIsUserSidebarOpen] = useState(false);
  
  // Server data handling
  const [appData, setAppData] = useState(serverData || {});
  
  // Check if we have server-rendered data
  const isServerData = Boolean(serverData && Object.keys(serverData).length > 0);
  
  // Update animation context when sidebars open/close
  useEffect(() => {
    setSidebarStatus(isSidebarOpen || isUserSidebarOpen);
  }, [isSidebarOpen, isUserSidebarOpen, setSidebarStatus]);
  
  // Log server hydration information
  useEffect(() => {
    if (isServerData) {
      console.log("Hydrating from server-rendered data:", 
        appData.pageType || "default");
      
      // Mark hydration complete when app renders with server data
      if (window.performance && window.performance.mark) {
        window.performance.mark('hydrated');
      }
    }
  }, [isServerData, appData]);
  
  // Pass server data to specific page components
  const getPageProps = (pageType) => {
    if (!isServerData) return {};
    
    if (appData.pageType === pageType) {
      return { serverData: appData };
    }
    
    return {};
  };
  
  return (
    <>
      <DefaultSEO serverData={isServerData ? appData : undefined} />
          <Navbar
            isSidebarOpen={isSidebarOpen}
            toggleScrollPage={() => setIsSidebarOpen((prev) => !prev)}
            isUserSidebarOpen={isUserSidebarOpen}
            toggleUserSidebar={() => setIsUserSidebarOpen((prev) => !prev)}
          />
          {isSidebarOpen && (
            <SidebarScroll
              isSidebarOpen={isSidebarOpen}
              toggleScrollPage={() => setIsSidebarOpen((prev) => !prev)}
            />
          )}
          {isUserSidebarOpen && (
            <UserSidebar
              isUserSidebarOpen={isUserSidebarOpen}
              toggleUserSidebar={() => setIsUserSidebarOpen((prev) => !prev)}
            />
          )}
          <Routes>
            <Route path="/" element={<Home {...getPageProps('home')} />} />
            <Route path="/events/:eventId" element={
              <React.Suspense fallback={
                <div style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "70vh",
                }}>
                  <Loader size="large" text="Loading event details..." />
                </div>
              }>
                <EventDetails {...getPageProps('eventDetails')} />
              </React.Suspense>
            } />
            <Route path="/login" element={
              <React.Suspense fallback={
                <div style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "70vh",
                }}>
                  <Loader size="large" text="Loading login page..." />
                </div>
              }>
                <Login {...getPageProps('login')} />
              </React.Suspense>
            } />
            <Route path="/about-us" element={
              <React.Suspense fallback={
                <div style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "70vh",
                }}>
                  <Loader size="large" text="Loading about us page..." />
                </div>
              }>
                <AboutUs {...getPageProps('aboutUs')} />
              </React.Suspense>
            } />
            <Route path="/page-not-found" element={<PageNotFound {...getPageProps('404')} />} />
            <Route path="*" element={<PageNotFound {...getPageProps('404')} />} />
          </Routes>
          <Footer />
    </>
  );
}

// Main App component with all providers
function App({ serverData }) {
  return (
    <AuthProvider>
      <AnimationProvider>
        <BrowserRouter>
          <ScrollToTop />
          <AppContent serverData={serverData} />
        </BrowserRouter>
      </AnimationProvider>
    </AuthProvider>
  );
}

export default App;