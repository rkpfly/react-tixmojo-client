import React from 'react';

const EventSponsors = ({ sponsors }) => {
  if (!sponsors || sponsors.length === 0) {
    return null;
  }
  
  return (
    <div
      style={{
        backgroundColor: "var(--purple-50)",
        padding: "25px",
        borderRadius: "16px",
        boxShadow: "0 5px 15px rgba(111, 68, 255, 0.08)",
        border: "1px solid var(--purple-100)",
      }}
    >
      <h4
        style={{
          fontSize: "18px",
          fontWeight: "700",
          color: "var(--dark)",
          marginBottom: "20px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <svg 
          width="18" 
          height="18" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          style={{ color: "var(--primary)" }}
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
        </svg>
        Event Sponsors
      </h4>
      
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        {sponsors.map((sponsor, index) => (
          <div
            key={index}
            style={{
              backgroundColor: "white",
              padding: "12px 20px",
              borderRadius: "10px",
              boxShadow: "0 2px 8px rgba(111, 68, 255, 0.08)",
              fontSize: "15px",
              fontWeight: "600",
              color: "var(--neutral-800)",
              border: "1px solid var(--purple-100)",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-3px)";
              e.currentTarget.style.boxShadow = "0 5px 15px rgba(111, 68, 255, 0.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 2px 8px rgba(111, 68, 255, 0.08)";
            }}
          >
            {sponsor}
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventSponsors;