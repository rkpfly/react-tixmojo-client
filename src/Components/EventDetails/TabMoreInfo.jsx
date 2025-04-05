import React from 'react';
import { BiInfoCircle } from "react-icons/bi";
import OrganizerInfo from './OrganizerInfo';
import EventFAQSection from './EventFAQSection';
import EventSponsors from './EventSponsors';

const TabMoreInfo = ({ 
  event, 
  activeTab, 
  showMoreOptions, 
  setShowMoreOptions, 
  setShowContactPopup, 
  organizerEvents,
  navigate 
}) => {
  return (
    <div 
      style={{ 
        display: activeTab === "more" ? "block" : "none",
        animation: activeTab === "more" ? "fadeIn 0.5s ease" : "none",
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
        <BiInfoCircle size={24} /> Additional Information
      </h3>
      
      {/* Organizer Information */}
      <OrganizerInfo 
        event={event} 
        organizerEvents={organizerEvents} 
        setShowContactPopup={setShowContactPopup} 
        navigate={navigate} 
      />
      
      {/* FAQ Section */}
      <EventFAQSection 
        showMoreOptions={showMoreOptions}
        setShowMoreOptions={setShowMoreOptions}
      />
      
      {/* Sponsors section */}
      <EventSponsors sponsors={event.sponsors} />
    </div>
  );
};

export default TabMoreInfo;