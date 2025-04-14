import React, { useState, useEffect } from 'react';
import { BiDetail, BiStar, BiMap, BiInfoCircle } from "react-icons/bi";
import { ScrollAnimation } from "../../utils/ScrollAnimation.jsx";
import { useAnimation } from "../../context/AnimationContext";
import TabDetails from './TabDetails';
import TabVenue from './TabVenue';
import TabHighlights from './TabHighlights';
import TabMoreInfo from './TabMoreInfo';
import "../../Style/eventTabs.css";

const EventTabs = ({ event, setShowContactPopup, organizerEvents, handleGetTickets, navigate }) => {
  const [activeTab, setActiveTab] = useState("details");
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const { animationsEnabled, sidebarOpen } = useAnimation();

  // Track window width for responsive behavior
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const isMobile = windowWidth <= 768;

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <ScrollAnimation
      direction="up"
      distance={20}
      duration={0.8}
      delay={0.3}
      disabled={!animationsEnabled || sidebarOpen}
    >
      <div className="event-tabs-container">
        {/* Tabs Navigation */}
        <div className="tab-navigation">
          {/* Active tab indicator - animated (only shows on desktop) */}
          <div 
            className="tab-indicator"
            style={{
              left: activeTab === "details" ? "0%" : 
                    activeTab === "venue" ? "25%" : 
                    activeTab === "highlights" ? "50%" : "75%",
              width: "25%",
            }}
          />
          
          {/* Tab buttons */}
          <button
            onClick={() => setActiveTab("details")}
            className={`tab-button ${activeTab === "details" ? 'active' : ''}`}
            aria-selected={activeTab === "details"}
            role="tab"
          >
            <BiDetail className="tab-icon" />
            <span>Details</span>
          </button>
          
          <button
            onClick={() => setActiveTab("venue")}
            className={`tab-button ${activeTab === "venue" ? 'active' : ''}`}
            aria-selected={activeTab === "venue"}
            role="tab"
          >
            <BiMap className="tab-icon" />
            <span>Venue</span>
          </button>
          
          <button
            onClick={() => setActiveTab("highlights")}
            className={`tab-button ${activeTab === "highlights" ? 'active' : ''}`}
            aria-selected={activeTab === "highlights"}
            role="tab"
          >
            <BiStar className="tab-icon" />
            <span>Highlights</span>
          </button>
          
          <button
            onClick={() => setActiveTab("more")}
            className={`tab-button ${activeTab === "more" ? 'active' : ''}`}
            aria-selected={activeTab === "more"}
            role="tab"
          >
            <BiInfoCircle className="tab-icon" />
            <span>More Info</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {/* Background Pattern */}
          <div className="tab-background-pattern">
            <svg width="150" height="150" viewBox="0 0 100 100" fill="none">
              <circle cx="10" cy="10" r="3" fill="var(--primary)" />
              <circle cx="10" cy="30" r="3" fill="var(--primary)" />
              <circle cx="10" cy="50" r="3" fill="var(--primary)" />
              <circle cx="10" cy="70" r="3" fill="var(--primary)" />
              <circle cx="10" cy="90" r="3" fill="var(--primary)" />
              <circle cx="30" cy="10" r="3" fill="var(--primary)" />
              <circle cx="30" cy="30" r="3" fill="var(--primary)" />
              <circle cx="30" cy="50" r="3" fill="var(--primary)" />
              <circle cx="30" cy="70" r="3" fill="var(--primary)" />
              <circle cx="30" cy="90" r="3" fill="var(--primary)" />
              <circle cx="50" cy="10" r="3" fill="var(--primary)" />
              <circle cx="50" cy="30" r="3" fill="var(--primary)" />
              <circle cx="50" cy="50" r="3" fill="var(--primary)" />
              <circle cx="50" cy="70" r="3" fill="var(--primary)" />
              <circle cx="50" cy="90" r="3" fill="var(--primary)" />
              <circle cx="70" cy="10" r="3" fill="var(--primary)" />
              <circle cx="70" cy="30" r="3" fill="var(--primary)" />
              <circle cx="70" cy="50" r="3" fill="var(--primary)" />
              <circle cx="70" cy="70" r="3" fill="var(--primary)" />
              <circle cx="70" cy="90" r="3" fill="var(--primary)" />
              <circle cx="90" cy="10" r="3" fill="var(--primary)" />
              <circle cx="90" cy="30" r="3" fill="var(--primary)" />
              <circle cx="90" cy="50" r="3" fill="var(--primary)" />
              <circle cx="90" cy="70" r="3" fill="var(--primary)" />
              <circle cx="90" cy="90" r="3" fill="var(--primary)" />
            </svg>
          </div>

          {/* Tab Content Components */}
          <TabDetails 
            event={event} 
            activeTab={activeTab} 
            isDescriptionExpanded={isDescriptionExpanded}
            setIsDescriptionExpanded={setIsDescriptionExpanded}
            windowWidth={windowWidth}
          />
          
          <TabVenue 
            event={event} 
            activeTab={activeTab}
            windowWidth={windowWidth}
          />
          
          <TabHighlights 
            event={event} 
            activeTab={activeTab} 
            handleGetTickets={handleGetTickets}
            windowWidth={windowWidth}
          />
          
          <TabMoreInfo 
            event={event} 
            activeTab={activeTab} 
            showMoreOptions={showMoreOptions}
            setShowMoreOptions={setShowMoreOptions}
            setShowContactPopup={setShowContactPopup}
            organizerEvents={organizerEvents}
            navigate={navigate}
            windowWidth={windowWidth}
          />
        </div>
      </div>
    </ScrollAnimation>
  );
};

export default EventTabs;