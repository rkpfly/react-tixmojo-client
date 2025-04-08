import React, { useState } from 'react';
import { BiDetail, BiStar, BiMap, BiInfoCircle } from "react-icons/bi";
import { ScrollAnimation } from "../../utils/ScrollAnimation.jsx";
import { useAnimation } from "../../context/AnimationContext";
import TabDetails from './TabDetails';
import TabVenue from './TabVenue';
import TabHighlights from './TabHighlights';
import TabMoreInfo from './TabMoreInfo';

const EventTabs = ({ event, setShowContactPopup, organizerEvents, handleGetTickets, navigate }) => {
  const [activeTab, setActiveTab] = useState("details");
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const { animationsEnabled, sidebarOpen } = useAnimation();

  return (
    <ScrollAnimation
      direction="up"
      distance={20}
      duration={0.8}
      delay={0.3}
      disabled={!animationsEnabled || sidebarOpen}
    >
      <div
        style={{
          marginTop: "60px",
          position: "relative",
          overflow: "hidden",
          borderRadius: "24px",
          boxShadow: "0 20px 40px rgba(111, 68, 255, 0.08)",
          border: "1px solid var(--purple-100)",
          background: "var(--neutral-50)",
        }}
      >
        {/* Tabs Navigation */}
        <div
          style={{
            display: "flex",
            borderBottom: "1px solid var(--purple-100)",
            position: "relative",
            overflow: "hidden",
            backgroundColor: "var(--purple-50)",
          }}
        >
          {/* Active tab indicator - animated */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              height: "3px",
              backgroundColor: "var(--primary)",
              transition: "all 0.3s cubic-bezier(0.17, 0.67, 0.83, 0.67)",
              left: activeTab === "details" ? "0%" : 
                    activeTab === "venue" ? "25%" : 
                    activeTab === "highlights" ? "50%" : "75%",
              width: "25%",
              borderRadius: "3px 3px 0 0",
            }}
          />
          
          {/* Tab buttons */}
          <button
            onClick={() => setActiveTab("details")}
            style={{
              flex: 1,
              padding: "20px 15px",
              backgroundColor: "transparent",
              border: "none",
              cursor: "pointer",
              fontWeight: activeTab === "details" ? "700" : "500",
              color: activeTab === "details" ? "var(--primary)" : "var(--neutral-700)",
              fontSize: "16px",
              transition: "all 0.2s ease",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "8px",
              position: "relative",
              overflow: "hidden",
            }}
            onMouseEnter={(e) => {
              if (activeTab !== "details") {
                e.currentTarget.style.backgroundColor = "var(--purple-100)";
                e.currentTarget.style.color = "var(--primary)";
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== "details") {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = "var(--neutral-700)";
              }
            }}
          >
            <BiDetail size={22} />
            <span>Details</span>
          </button>
          
          <button
            onClick={() => setActiveTab("venue")}
            style={{
              flex: 1,
              padding: "20px 15px",
              backgroundColor: "transparent",
              border: "none",
              cursor: "pointer",
              fontWeight: activeTab === "venue" ? "700" : "500",
              color: activeTab === "venue" ? "var(--primary)" : "var(--neutral-700)",
              fontSize: "16px",
              transition: "all 0.2s ease",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "8px",
            }}
            onMouseEnter={(e) => {
              if (activeTab !== "venue") {
                e.currentTarget.style.backgroundColor = "var(--purple-100)";
                e.currentTarget.style.color = "var(--primary)";
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== "venue") {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = "var(--neutral-700)";
              }
            }}
          >
            <BiMap size={22} />
            <span>Venue</span>
          </button>
          
          <button
            onClick={() => setActiveTab("highlights")}
            style={{
              flex: 1,
              padding: "20px 15px",
              backgroundColor: "transparent",
              border: "none",
              cursor: "pointer",
              fontWeight: activeTab === "highlights" ? "700" : "500",
              color: activeTab === "highlights" ? "var(--primary)" : "var(--neutral-700)",
              fontSize: "16px",
              transition: "all 0.2s ease",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "8px",
            }}
            onMouseEnter={(e) => {
              if (activeTab !== "highlights") {
                e.currentTarget.style.backgroundColor = "var(--purple-100)";
                e.currentTarget.style.color = "var(--primary)";
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== "highlights") {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = "var(--neutral-700)";
              }
            }}
          >
            <BiStar size={22} />
            <span>Highlights</span>
          </button>
          
          <button
            onClick={() => setActiveTab("more")}
            style={{
              flex: 1,
              padding: "20px 15px",
              backgroundColor: "transparent",
              border: "none",
              cursor: "pointer",
              fontWeight: activeTab === "more" ? "700" : "500",
              color: activeTab === "more" ? "var(--primary)" : "var(--neutral-700)",
              fontSize: "16px",
              transition: "all 0.2s ease",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "8px",
            }}
            onMouseEnter={(e) => {
              if (activeTab !== "more") {
                e.currentTarget.style.backgroundColor = "var(--purple-100)";
                e.currentTarget.style.color = "var(--primary)";
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== "more") {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = "var(--neutral-700)";
              }
            }}
          >
            <BiInfoCircle size={22} />
            <span>More Info</span>
          </button>
        </div>

        {/* Tab Content */}
        <div
          style={{
            padding: "32px 40px",
            position: "relative",
            background: "var(--neutral-50)",
            minHeight: "300px",
          }}
        >
          {/* Background Pattern */}
          <div
            style={{
              position: "absolute",
              top: "15px",
              right: "15px",
              opacity: 0.04,
              zIndex: 0,
              pointerEvents: "none",
            }}
          >
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
          />
          
          <TabVenue 
            event={event} 
            activeTab={activeTab} 
          />
          
          <TabHighlights 
            event={event} 
            activeTab={activeTab} 
            handleGetTickets={handleGetTickets} 
          />
          
          <TabMoreInfo 
            event={event} 
            activeTab={activeTab} 
            showMoreOptions={showMoreOptions}
            setShowMoreOptions={setShowMoreOptions}
            setShowContactPopup={setShowContactPopup}
            organizerEvents={organizerEvents}
            navigate={navigate}
          />
        </div>
      </div>
    </ScrollAnimation>
  );
};

export default EventTabs;