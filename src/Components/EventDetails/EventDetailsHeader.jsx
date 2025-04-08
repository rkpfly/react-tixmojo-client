import React from 'react';
import { ScrollAnimation } from "../../utils/ScrollAnimation.jsx";
import { useAnimation } from "../../context/AnimationContext";

const EventDetailsHeader = ({ event }) => {
  const { animationsEnabled, sidebarOpen } = useAnimation();
  
  return (
    <ScrollAnimation 
      direction="down" 
      distance={30} 
      duration={0.8}
      disabled={!animationsEnabled || sidebarOpen}>
      <div style={{ marginBottom: "10px" }}>
        <h1
          style={{
            fontSize: window.innerWidth > 768 ? "42px" : "24px",
            fontWeight: "800",
            color: "var(--dark)",
            fontFamily: "var(--font-heading)",
          }}
        >
          {event.title}
        </h1>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "10px",
            marginTop: "5px",
          }}
        >
          {/* Display tags from the backend */}
          {event.tags.map((tag, index) => {
            return (
              <div
                key={index}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  borderRadius: "50px",
                  padding: window.innerWidth > 768 ? "4px 12px" : "2px 8px",
                  fontSize: window.innerWidth > 768 ? "12px" : "10px",
                  fontWeight: "600",
                  transition: "all 0.2s ease",
                  cursor: "pointer",
                  backgroundColor: "#e0f2f1",
                  color: "#00695c",
                  boxShadow: "none",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow =
                    "0 2px 8px rgba(0, 0, 0, 0.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                # {tag}
              </div>
            );
          })}
        </div>
      </div>
    </ScrollAnimation>
  );
};

export default EventDetailsHeader;