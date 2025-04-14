import React from 'react';
import { BiMap } from "react-icons/bi";
import { BsCalendar2Date } from "react-icons/bs";
import { HiOutlineLocationMarker, HiOutlineExternalLink } from "react-icons/hi";

const TabVenue = ({ event, activeTab, windowWidth }) => {
  return (
    <div 
      style={{ 
        display: activeTab === "venue" ? "block" : "none",
        animation: activeTab === "venue" ? "fadeIn 0.5s ease" : "none",
        position: "relative", 
        zIndex: 1,
      }}
    >
      <h3 className="tab-heading">
        <BiMap className="tab-heading-icon" /> Venue Information
      </h3>
      
      <div className="venue-container">
        {/* Venue Details */}
        <div className="venue-details">
          <h4 className="venue-name">
            {event.venueName}
          </h4>
          
          <div className="venue-address">
            <HiOutlineLocationMarker className="venue-address-icon" />
            <p className="venue-address-text">
              {event.venueAddress}
            </p>
          </div>
          
          <div className="venue-date">
            <BsCalendar2Date className="venue-date-icon" />
            <div>
              <p className="venue-date-text">
                {event.date}
              </p>
              <p className="venue-time-text">
                {event.time}
              </p>
            </div>
          </div>
          
          <div className="venue-facilities">
            <p className="venue-facilities-title">
              Venue Facilities
            </p>
            <ul className="venue-facilities-list">
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
            className="venue-map-link"
          >
            <HiOutlineLocationMarker size={18} />
            Open in Google Maps
          </a>
        </div>
        
        {/* Interactive Map Preview */}
        <div className="map-preview">
          <div 
            className="map-preview-background"
            style={{
              backgroundImage: `url(https://maps.googleapis.com/maps/api/staticmap?center=${encodeURIComponent(event.venueAddress)}&zoom=15&size=600x400&markers=color:purple%7C${encodeURIComponent(event.venueAddress)}&key=YOUR_API_KEY)`
            }}
          />
          
          {/* Map Overlay with Info */}
          <div className="map-overlay">
            <h5 className="map-venue-name">
              {event.venueName}
            </h5>
            <p className="map-venue-address">
              {event.venueAddress}
            </p>
            
            <a
              href={event.locationMap}
              target="_blank"
              rel="noopener noreferrer"
              className="map-button"
            >
              <HiOutlineExternalLink size={16} />
              View in Google Maps
            </a>
          </div>
          
          {/* Location Pin */}
          <div className="location-pin" />
        </div>
      </div>
      
      {/* Nearby Information */}
      <div className="venue-info">
        <h4 className="info-heading">
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
        
        <div className="info-grid" style={{ gridTemplateColumns: windowWidth < 768 ? "1fr" : "1fr 1fr" }}>
          <div>
            <h5 className="info-section-title">
              Getting There
            </h5>
            <ul className="info-list">
              <li>Public transit available nearby</li>
              <li>Limited parking available on site</li>
              <li>Taxi drop-off point at main entrance</li>
            </ul>
          </div>
          
          <div>
            <h5 className="info-section-title">
              Nearby Amenities
            </h5>
            <ul className="info-list">
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