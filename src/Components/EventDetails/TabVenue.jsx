import React from 'react';
import { BiMap } from "react-icons/bi";
import { BsCalendar2Date } from "react-icons/bs";
import { HiOutlineLocationMarker, HiOutlineExternalLink } from "react-icons/hi";

const TabVenue = ({ event, activeTab }) => {
  return (
    <div 
      style={{ 
        display: activeTab === "venue" ? "block" : "none",
        animation: activeTab === "venue" ? "fadeIn 0.5s ease" : "none",
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
        <BiMap size={24} /> Venue Information
      </h3>
      
      <div
        style={{
          display: "flex",
          flexDirection: window.innerWidth < 768 ? "column" : "row",
          gap: "30px",
          marginBottom: "20px",
        }}
      >
        {/* Venue Details */}
        <div
          style={{
            flex: "1",
            backgroundColor: "var(--purple-50)",
            borderRadius: "16px",
            padding: "24px",
            boxShadow: "0 5px 15px rgba(111, 68, 255, 0.08)",
            border: "1px solid var(--purple-100)",
          }}
        >
          <h4
            style={{
              fontSize: "24px",
              fontWeight: "700",
              color: "var(--dark)",
              marginBottom: "15px",
              fontFamily: "var(--font-heading)",
            }}
          >
            {event.venueName}
          </h4>
          
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "10px",
              marginBottom: "20px",
            }}
          >
            <HiOutlineLocationMarker 
              size={22} 
              style={{ 
                color: "var(--primary)",
                marginTop: "3px",
              }} 
            />
            <p
              style={{
                color: "var(--neutral-700)",
                fontSize: "16px",
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              {event.venueAddress}
            </p>
          </div>
          
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "10px",
              marginBottom: "25px",
            }}
          >
            <BsCalendar2Date 
              size={20} 
              style={{ 
                color: "var(--primary)",
                marginTop: "3px",
              }} 
            />
            <div>
              <p
                style={{
                  color: "var(--neutral-700)",
                  fontSize: "16px",
                  margin: "0 0 5px 0",
                  fontWeight: "600",
                }}
              >
                {event.date}
              </p>
              <p
                style={{
                  color: "var(--neutral-600)",
                  fontSize: "14px",
                  margin: 0,
                }}
              >
                {event.time}
              </p>
            </div>
          </div>
          
          <div 
            style={{
              marginBottom: "25px",
              padding: "15px",
              backgroundColor: "white",
              borderRadius: "12px",
              border: "1px dashed var(--purple-200)",
            }}
          >
            <p
              style={{
                margin: "0 0 8px 0",
                fontWeight: "600",
                fontSize: "14px",
                color: "var(--primary)",
              }}
            >
              Venue Facilities
            </p>
            <ul
              style={{
                margin: 0,
                padding: "0 0 0 20px",
                color: "var(--neutral-700)",
                fontSize: "14px",
                lineHeight: 1.6,
              }}
            >
              <li>Wheelchair accessible</li>
              <li>Air-conditioned</li>
              <li>Restrooms</li>
              <li>Food and beverages</li>
            </ul>
          </div>
          
          <a
            href={event.locationMap}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              color: "var(--primary)",
              fontWeight: "600",
              textDecoration: "none",
              padding: "12px 20px",
              borderRadius: "8px",
              backgroundColor: "white",
              boxShadow: "0 4px 12px rgba(111, 68, 255, 0.12)",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-3px)";
              e.currentTarget.style.boxShadow = "0 6px 15px rgba(111, 68, 255, 0.2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(111, 68, 255, 0.12)";
            }}
          >
            <HiOutlineLocationMarker size={18} />
            Open in Google Maps
          </a>
        </div>
        
        {/* Interactive Map Preview */}
        <div
          style={{
            flex: "1.5",
            borderRadius: "16px",
            overflow: "hidden",
            height: "350px",
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: `url(https://maps.googleapis.com/maps/api/staticmap?center=${encodeURIComponent(event.venueAddress)}&zoom=15&size=600x400&markers=color:purple%7C${encodeURIComponent(event.venueAddress)}&key=YOUR_API_KEY)`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              filter: "saturate(1.1)",
              boxShadow: "inset 0 0 10px rgba(0, 0, 0, 0.1)",
            }}
          />
          
          {/* Map Overlay with Info */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              padding: "20px",
              background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)",
              color: "white",
            }}
          >
            <h5 
              style={{
                margin: "0 0 5px 0",
                fontSize: "18px",
                fontWeight: "700",
              }}
            >
              {event.venueName}
            </h5>
            <p
              style={{
                margin: "0 0 10px 0",
                fontSize: "14px",
                opacity: 0.9,
              }}
            >
              {event.venueAddress}
            </p>
            
            <a
              href={event.locationMap}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                color: "white",
                backgroundColor: "var(--primary)",
                fontWeight: "600",
                textDecoration: "none",
                padding: "8px 15px",
                borderRadius: "8px",
                fontSize: "14px",
                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "var(--purple-700)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "var(--primary)";
              }}
            >
              <HiOutlineExternalLink size={16} />
              View in Google Maps
            </a>
          </div>
          
          {/* Location Pin */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "20px",
              height: "20px",
              backgroundColor: "var(--primary)",
              borderRadius: "50%",
              border: "3px solid white",
              boxShadow: "0 0 0 2px var(--primary)",
              animation: "pulseAnimation 2s infinite",
            }}
          />
        </div>
      </div>
      
      {/* Nearby Information */}
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "16px",
          padding: "25px",
          marginTop: "30px",
          boxShadow: "0 5px 15px rgba(111, 68, 255, 0.08)",
          border: "1px solid var(--purple-100)",
        }}
      >
        <h4
          style={{
            fontSize: "18px",
            fontWeight: "700",
            color: "var(--dark)",
            marginBottom: "15px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <svg 
            width="22" 
            height="22" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            style={{ color: "var(--primary)" }}
          >
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          Useful Information
        </h4>
        
        <div
          style={{
            display: "grid",
            gridTemplateColumns: window.innerWidth < 768 ? "1fr" : "1fr 1fr",
            gap: "20px",
          }}
        >
          <div>
            <h5
              style={{
                fontSize: "16px",
                fontWeight: "600",
                color: "var(--primary)",
                margin: "0 0 10px 0",
              }}
            >
              Getting There
            </h5>
            <ul
              style={{
                margin: 0,
                padding: "0 0 0 20px",
                color: "var(--neutral-700)",
                fontSize: "14px",
                lineHeight: 1.6,
              }}
            >
              <li>Public transit available nearby</li>
              <li>Limited parking available on site</li>
              <li>Taxi drop-off point at main entrance</li>
            </ul>
          </div>
          
          <div>
            <h5
              style={{
                fontSize: "16px",
                fontWeight: "600",
                color: "var(--primary)",
                margin: "0 0 10px 0",
              }}
            >
              Nearby Amenities
            </h5>
            <ul
              style={{
                margin: 0,
                padding: "0 0 0 20px",
                color: "var(--neutral-700)",
                fontSize: "14px",
                lineHeight: 1.6,
              }}
            >
              <li>Restaurants within walking distance</li>
              <li>Convenience stores</li>
              <li>ATM machines</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TabVenue;