import React from 'react';

const OrganizerInfo = ({ 
  event, 
  organizerEvents, 
  setShowContactPopup, 
  navigate
}) => {
  return (
    <div
      style={{
        backgroundColor: "var(--purple-50)",
        borderRadius: "16px",
        overflow: "hidden",
        marginBottom: "25px",
        border: "1px solid var(--purple-100)",
        boxShadow: "0 5px 15px rgba(111, 68, 255, 0.08)",
      }}
    >
      <div
        style={{
          padding: "20px 25px",
          borderBottom: "1px solid var(--purple-100)",
          backgroundColor: "white",
        }}
      >
        <h4
          style={{
            fontSize: "18px",
            fontWeight: "700",
            color: "var(--dark)",
            margin: 0,
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <svg 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            style={{ color: "var(--primary)" }}
          >
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
          Organizer Information
        </h4>
      </div>
      
      <div
        style={{
          padding: "25px",
          display: "flex",
          flexDirection: window.innerWidth < 768 ? "column" : "row",
          gap: "30px",
        }}
      >
        <div
          style={{
            flex: "1",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "15px",
              marginBottom: "20px",
            }}
          >
            <div
              style={{
                width: "60px",
                height: "60px",
                borderRadius: "15px",
                backgroundColor: "var(--primary)",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "24px",
                fontWeight: "700",
                boxShadow: "0 5px 15px rgba(111, 68, 255, 0.2)",
              }}
            >
              {event.organizer.name.charAt(0)}
            </div>
            
            <div>
              <h5
                style={{
                  margin: "0 0 5px 0",
                  fontSize: "20px",
                  fontWeight: "700",
                  color: "var(--dark)",
                }}
              >
                {event.organizer.name}
              </h5>
              
              <div
                style={{
                  fontSize: "14px",
                  color: "var(--neutral-600)",
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                }}
              >
                <span
                  style={{
                    display: "inline-block",
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    backgroundColor: "#22c55e",
                  }}
                />
                Verified Organizer
              </div>
            </div>
          </div>
          
          <p
            style={{
              margin: "0 0 15px 0",
              fontSize: "15px",
              lineHeight: 1.6,
              color: "var(--neutral-700)",
            }}
          >
            {event.organizer.description}
          </p>
          
          {event.organizer.specialization && event.organizer.specialization.length > 0 && (
            <div
              style={{
                margin: "0 0 15px 0",
              }}
            >
              <div
                style={{
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "var(--primary)",
                  marginBottom: "8px",
                }}
              >
                Specializations
              </div>
              
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "8px",
                }}
              >
                {event.organizer.specialization.map((specialty, index) => (
                  <span
                    key={index}
                    style={{
                      backgroundColor: "var(--purple-100)",
                      color: "var(--primary)",
                      padding: "4px 10px",
                      borderRadius: "15px",
                      fontSize: "12px",
                      fontWeight: "600",
                    }}
                  >
                    {specialty}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          <button
            onClick={() => setShowContactPopup(true)}
            style={{
              backgroundColor: "white",
              color: "var(--primary)",
              border: "1px solid var(--purple-200)",
              borderRadius: "8px",
              padding: "10px 15px",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.2s ease",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              alignSelf: "flex-start",
              marginTop: "auto",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "var(--primary)";
              e.currentTarget.style.color = "white";
              e.currentTarget.style.borderColor = "var(--primary)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "white";
              e.currentTarget.style.color = "var(--primary)";
              e.currentTarget.style.borderColor = "var(--purple-200)";
            }}
          >
            <svg 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
            </svg>
            Contact Organizer
          </button>
        </div>
        
        {organizerEvents.length > 0 && (
          <div
            style={{
              flex: "1",
              borderLeft: window.innerWidth < 768 ? "none" : "1px solid var(--purple-100)",
              paddingLeft: window.innerWidth < 768 ? "0" : "30px",
              marginTop: window.innerWidth < 768 ? "20px" : "0",
              paddingTop: window.innerWidth < 768 ? "20px" : "0",
              borderTop: window.innerWidth < 768 ? "1px solid var(--purple-100)" : "none",
            }}
          >
            <h5
              style={{
                margin: "0 0 15px 0",
                fontSize: "16px",
                fontWeight: "700",
                color: "var(--dark)",
              }}
            >
              More Events by This Organizer
            </h5>
            
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "15px",
              }}
            >
              {organizerEvents.slice(0, 2).map((orgEvent, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    gap: "12px",
                    padding: "12px",
                    backgroundColor: "white",
                    borderRadius: "10px",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
                  }}
                  onClick={() => navigate(`/events/${orgEvent.id}`)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "var(--purple-50)";
                    e.currentTarget.style.transform = "translateX(5px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "white";
                    e.currentTarget.style.transform = "translateX(0)";
                  }}
                >
                  <div
                    style={{
                      width: "60px",
                      height: "60px",
                      borderRadius: "8px",
                      overflow: "hidden",
                      flexShrink: 0,
                    }}
                  >
                    <img
                      src={orgEvent.eventPoster}
                      alt={orgEvent.eventName}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </div>
                  
                  <div>
                    <h6
                      style={{
                        margin: "0 0 5px 0",
                        fontSize: "15px",
                        fontWeight: "600",
                        color: "var(--dark)",
                      }}
                    >
                      {orgEvent.eventName}
                    </h6>
                    
                    <div
                      style={{
                        fontSize: "13px",
                        color: "var(--primary)",
                        fontWeight: "600",
                        marginBottom: "2px",
                      }}
                    >
                      {orgEvent.date?.split(",")[0] || ""}
                    </div>
                    
                    <div
                      style={{
                        fontSize: "12px",
                        color: "var(--neutral-600)",
                      }}
                    >
                      {orgEvent.venueName}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {organizerEvents.length > 2 && (
              <button
                onClick={() => navigate(`/page-not-found?organizer=${event.organizer.id}`)}
                style={{
                  backgroundColor: "transparent",
                  color: "var(--primary)",
                  border: "none",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                  marginTop: "15px",
                  padding: "5px 0",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.textDecoration = "underline";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.textDecoration = "none";
                }}
              >
                View all events
                <svg 
                  width="16" 
                  height="16" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrganizerInfo;