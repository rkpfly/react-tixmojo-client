import React from 'react';
import { BiDetail, BiMusic } from "react-icons/bi";
import { BsCalendar2Date } from "react-icons/bs";
import { HiOutlineLocationMarker } from "react-icons/hi";

const TabDetails = ({ event, activeTab, isDescriptionExpanded, setIsDescriptionExpanded }) => {
  return (
    <div 
      style={{ 
        display: activeTab === "details" ? "block" : "none",
        animation: activeTab === "details" ? "fadeIn 0.5s ease" : "none",
        position: "relative",
        zIndex: 1,
      }}
    >
      <h3
        style={{
          fontSize: "22px",
          fontWeight: "700",
          color: "var(--primary)",
          marginBottom: "20px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <BiDetail size={24} /> About This Event
      </h3>
      
      {/* Event Summary */}
      <div
        style={{
          backgroundColor: "var(--purple-50)",
          borderRadius: "12px",
          padding: "20px",
          marginBottom: "25px",
          border: "1px solid var(--purple-100)",
        }}
      >
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "8px",
            marginBottom: "15px",
          }}
        >
          {event.tags.map((tag, index) => (
            <span
              key={index}
              style={{
                backgroundColor: "white",
                color: "var(--primary)",
                padding: "4px 12px",
                borderRadius: "20px",
                fontSize: "13px",
                fontWeight: "600",
                boxShadow: "0 2px 6px rgba(111, 68, 255, 0.1)",
                border: "1px solid var(--purple-200)",
              }}
            >
              {tag}
            </span>
          ))}
        </div>
        
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "15px",
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <BsCalendar2Date color="var(--primary)" size={18} />
            <span style={{ fontWeight: "500", fontSize: "15px" }}>
              {event.date}
            </span>
          </div>
          
          <div
            style={{
              width: "4px",
              height: "4px",
              borderRadius: "50%",
              backgroundColor: "var(--neutral-400)",
            }}
          />
          
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <HiOutlineLocationMarker color="var(--primary)" size={18} />
            <span style={{ fontWeight: "500", fontSize: "15px" }}>
              {event.venueName}
            </span>
          </div>
          
          <div
            style={{
              width: "4px",
              height: "4px",
              borderRadius: "50%",
              backgroundColor: "var(--neutral-400)",
            }}
          />
          
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <BiMusic color="var(--primary)" size={18} />
            <span style={{ fontWeight: "500", fontSize: "15px" }}>
              Organized by {event.organizer.name}
            </span>
          </div>
        </div>
      </div>
      
      <div
        className="event-description"
        style={{
          position: "relative",
          color: "var(--neutral-800)",
          fontSize: "16px",
          lineHeight: 1.8,
          fontWeight: "400",
          maxHeight: isDescriptionExpanded ? "none" : "300px",
          overflow: isDescriptionExpanded ? "visible" : "hidden",
          transition: "all 0.5s ease",
        }}
      >
        <div dangerouslySetInnerHTML={{ __html: event.description }} />
        
        {/* Gradient fade for unexpanded content */}
        {!isDescriptionExpanded && (
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "80px",
              background: "linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,1))",
              pointerEvents: "none",
            }}
          />
        )}
      </div>
      
      {/* Expand/Collapse button */}
      <button
        onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "var(--purple-100)",
          color: "var(--primary)",
          border: "none",
          borderRadius: "30px",
          padding: "8px 20px",
          fontSize: "14px",
          fontWeight: "600",
          margin: "20px auto 0",
          cursor: "pointer",
          transition: "all 0.2s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "var(--purple-200)";
          e.currentTarget.style.transform = "translateY(-2px)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "var(--purple-100)";
          e.currentTarget.style.transform = "translateY(0)";
        }}
      >
        {isDescriptionExpanded ? "Show Less" : "Read More"}
      </button>
    </div>
  );
};

export default TabDetails;