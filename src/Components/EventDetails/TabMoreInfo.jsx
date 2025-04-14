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
  navigate,
  windowWidth
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
      <h3 className="tab-heading">
        <BiInfoCircle className="tab-heading-icon" /> Additional Information
      </h3>
      
      {/* Organizer Information */}
      <OrganizerInfo 
        event={event} 
        organizerEvents={organizerEvents} 
        setShowContactPopup={setShowContactPopup} 
        navigate={navigate}
        windowWidth={windowWidth}
      />
      
      {/* FAQ Section */}
      <EventFAQSection 
        faq={event.faq}
        showMoreOptions={showMoreOptions}
        setShowMoreOptions={setShowMoreOptions}
        windowWidth={windowWidth}
      />
      
      {/* Sponsors section */}
      <EventSponsors 
        sponsors={event.sponsors}
        windowWidth={windowWidth}
      />
    </div>
  );
};

export default TabMoreInfo;