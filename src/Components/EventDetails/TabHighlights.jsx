import React from 'react';
import { BiStar } from "react-icons/bi";
import { IoTicketOutline } from "react-icons/io5";

const TabHighlights = ({ event, activeTab, handleGetTickets, windowWidth }) => {
  return (
    <div 
      style={{ 
        display: activeTab === "highlights" ? "block" : "none",
        animation: activeTab === "highlights" ? "fadeIn 0.5s ease" : "none",
        position: "relative", 
        zIndex: 1,
      }}
    >
      <h3 className="tab-heading">
        <BiStar className="tab-heading-icon" /> Event Highlights
      </h3>
      
      {/* Feature Banner - Extract from event description */}
      <div className="feature-banner">
        <div 
          className="feature-banner-bg"
          style={{ backgroundImage: `url(${event.image})` }}
        />
        
        <div className="feature-banner-content">
          <div className="featured-badge">
            FEATURED
          </div>
          
          <h4 className="feature-banner-title">
            {event.title}
          </h4>
          
          <p className="feature-banner-subtitle">
            {event.date} at {event.venueName}
          </p>
        </div>
      </div>
      
      {/* Extract Highlights from Description */}
      <div className={windowWidth >= 1025 ? "highlight-cards-grid" : ""}>
        {(() => {
          // Parse the description to extract bullet points from the list
          const tempDiv = document.createElement('div');
          tempDiv.innerHTML = event.description;
          
          // Find all lists in the description
          const lists = tempDiv.querySelectorAll('ul');
          let highlights = [];
          
          // Extract list items from the first list we find
          if (lists.length > 0) {
            const listItems = lists[0].querySelectorAll('li');
            listItems.forEach((item) => {
              highlights.push(item.textContent.trim());
            });
          }
          
          // If no lists found or they're empty, use tags instead
          if (highlights.length === 0 && event.tags) {
            highlights = event.tags.map(tag => `Experience the best of ${tag}`);
          }
          
          // Ensure we have at least 6 items
          while (highlights.length < 6 && event.tags) {
            highlights.push(`Exclusive ${event.tags[0]} experience`);
          }
          
          // Get the first 6 highlights
          return highlights.slice(0, 6).map((highlight, index) => (
            <div key={index} className="highlight-card">
              <div className="highlight-content">
                <div className="highlight-icon-container">
                  <BiStar className="highlight-icon" />
                </div>
                
                <div>
                  <p className="highlight-text">
                    {highlight}
                  </p>
                </div>
              </div>
            </div>
          ));
        })()}
      </div>
      
      {/* Call to Action */}
      <div className="cta-container">
        <button
          onClick={handleGetTickets}
          className="cta-button"
        >
          <IoTicketOutline size={20} />
          Get Tickets Now - {event.price.currency} {event.price.value}
        </button>
      </div>
    </div>
  );
};

export default TabHighlights;