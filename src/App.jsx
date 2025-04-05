import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import PageNotFound from "./pages/PageNotFound";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import { useState } from "react";
import { SidebarScroll } from "./Components/Sidebar";
import { UserSidebar } from "./Components/UserSidebar";
import { DefaultSEO } from "./utils/SEO";
import ScrollToTop from "./utils/ScrollToTop";
import React from "react";
import Loader from "./Components/Loader";

// Lazy load the EventDetails component to handle any potential loading issues
const EventDetails = React.lazy(() => import("./pages/EventDetails"));

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isUserSidebarOpen, setIsUserSidebarOpen] = useState(false);
  
  return (
    <>
      <DefaultSEO />
      <BrowserRouter>
        <ScrollToTop />
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
          <Route path="/" element={<Home />} />
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
              <EventDetails />
            </React.Suspense>
          } />
          <Route path="/page-not-found" element={<PageNotFound />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  );
}

export default App;