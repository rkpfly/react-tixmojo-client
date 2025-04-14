import React from 'react';
import { BiDetail, BiMusic } from "react-icons/bi";
import { BsCalendar2Date } from "react-icons/bs";
import { HiOutlineLocationMarker } from "react-icons/hi";

const TabDetails = ({ event, activeTab, isDescriptionExpanded, setIsDescriptionExpanded, windowWidth }) => {
  return (
    <div 
      style={{ 
        display: activeTab === "details" ? "block" : "none",
        animation: activeTab === "details" ? "fadeIn 0.5s ease" : "none",
        position: "relative",
        zIndex: 1,
      }}
    >
      <h3 className="tab-heading">
        <BiDetail className="tab-heading-icon" /> About This Event
      </h3>
      
      {/* Event Summary */}
      <div className="event-summary">
        <div className="event-tags">
          {event.tags.map((tag, index) => (
            <span key={index} className="event-tag">
              {tag}
            </span>
          ))}
        </div>
        
        <div className="event-meta">
          <div className="event-meta-item">
            <BsCalendar2Date color="var(--primary)" size={18} />
            <span className="event-meta-text">
              {event.date}
            </span>
          </div>
          
          <div className="event-meta-divider" />
          
          <div className="event-meta-item">
            <HiOutlineLocationMarker color="var(--primary)" size={18} />
            <span className="event-meta-text">
              {event.venueName}
            </span>
          </div>
          
          <div className="event-meta-divider" />
          
          <div className="event-meta-item">
            <BiMusic color="var(--primary)" size={18} />
            <span className="event-meta-text">
              Organized by {event.organizer.name}
            </span>
          </div>
        </div>
      </div>
      
      <div
        className="event-description"
        style={{
          maxHeight: isDescriptionExpanded ? "none" : (windowWidth < 768 ? "200px" : "300px"),
          overflow: isDescriptionExpanded ? "visible" : "hidden",
        }}
      >
        <div dangerouslySetInnerHTML={{ __html: event.description }} />
        
        {/* Gradient fade for unexpanded content */}
        {!isDescriptionExpanded && (
          <div className="event-description-gradient" />
        )}
      </div>
      
      {/* Expand/Collapse button */}
      <button
        onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
        className="read-more-button"
      >
        {isDescriptionExpanded ? "Show Less" : "Read More"}
      </button>
    </div>
  );
};

export default TabDetails;