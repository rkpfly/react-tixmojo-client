import React from 'react';
import { BiStar } from "react-icons/bi";
import { IoTicketOutline } from "react-icons/io5";

const TabHighlights = ({ event, activeTab, handleGetTickets }) => {
  return (
    <div 
      style={{ 
        display: activeTab === "highlights" ? "block" : "none",
        animation: activeTab === "highlights" ? "fadeIn 0.5s ease" : "none",
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
        <BiStar size={24} /> Event Highlights
      </h3>
      
      {/* Feature Banner - Extract from event description */}
      <div
        style={{
          position: "relative",
          borderRadius: "16px",
          overflow: "hidden",
          height: "180px",
          marginBottom: "25px",
          boxShadow: "0 10px 25px rgba(111, 68, 255, 0.15)",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `url(${event.image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "brightness(0.7)",
          }}
        />
        
        <div
          style={{
            position: "relative",
            height: "100%",
            padding: "25px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
          }}
        >
          <div
            style={{
              display: "inline-block",
              backgroundColor: "var(--primary)",
              color: "white",
              padding: "5px 12px",
              borderRadius: "20px",
              fontSize: "12px",
              fontWeight: "600",
              marginBottom: "10px",
              boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
            }}
          >
            FEATURED
          </div>
          
          <h4
            style={{
              margin: "0 0 5px 0",
              color: "white",
              fontSize: "24px",
              fontWeight: "700",
              textShadow: "0 2px 5px rgba(0, 0, 0, 0.3)",
              fontFamily: "var(--font-heading)",
            }}
          >
            {event.title}
          </h4>
          
          <p
            style={{
              margin: 0,
              color: "rgba(255, 255, 255, 0.9)",
              fontSize: "15px",
              fontWeight: "500",
              textShadow: "0 1px 3px rgba(0, 0, 0, 0.3)",
            }}
          >
            {event.date} at {event.venueName}
          </p>
        </div>
      </div>
      
      {/* Extract Highlights from Description */}
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
          <div
            key={index}
            style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(111, 68, 255, 0.08)",
              border: "1px solid var(--purple-100)",
              transition: "all 0.3s ease",
              cursor: "default",
              marginBottom: "20px",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-5px)";
              e.currentTarget.style.boxShadow = "0 8px 20px rgba(111, 68, 255, 0.12)";
              e.currentTarget.style.borderColor = "var(--purple-300)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(111, 68, 255, 0.08)";
              e.currentTarget.style.borderColor = "var(--purple-100)";
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "15px",
              }}
            >
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  backgroundColor: "var(--purple-100)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--primary)",
                  flexShrink: 0,
                  marginTop: "3px",
                }}
              >
                <BiStar size={18} />
              </div>
              
              <div>
                <p
                  style={{
                    margin: 0,
                    color: "var(--neutral-800)",
                    fontSize: "16px",
                    lineHeight: 1.5,
                    fontWeight: "600",
                  }}
                >
                  {highlight}
                </p>
              </div>
            </div>
          </div>
        ));
      })()}
      
      {/* Call to Action */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "30px",
        }}
      >
        <button
          onClick={handleGetTickets}
          style={{
            backgroundColor: "var(--primary)",
            color: "white",
            border: "none",
            borderRadius: "12px",
            padding: "15px 25px",
            fontSize: "16px",
            fontWeight: "600",
            cursor: "pointer",
            transition: "all 0.3s ease",
            boxShadow: "0 6px 15px rgba(111, 68, 255, 0.2)",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            fontFamily: "var(--font-heading)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "var(--purple-700)";
            e.currentTarget.style.transform = "translateY(-3px)";
            e.currentTarget.style.boxShadow = "0 8px 20px rgba(111, 68, 255, 0.3)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "var(--primary)";
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 6px 15px rgba(111, 68, 255, 0.2)";
          }}
        >
          <IoTicketOutline size={20} />
          Get Tickets Now - {event.price.currency} {event.price.value}
        </button>
      </div>
    </div>
  );
};

export default TabHighlights;