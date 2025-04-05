import React from 'react';
import { IoMdClose, IoMdMail, IoMdGlobe, IoMdCall } from "react-icons/io";

const OrgContactPopup = ({ event, setShowContactPopup }) => {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
        backdropFilter: "blur(5px)",
      }}
      onClick={() => setShowContactPopup(false)}
    >
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "20px",
          padding: "30px",
          width: "90%",
          maxWidth: "420px",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.2)",
          position: "relative",
          animation: "fadeInUp 0.3s ease-out",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          style={{
            position: "absolute",
            top: "15px",
            right: "15px",
            backgroundColor: "var(--purple-50)",
            border: "none",
            borderRadius: "50%",
            width: "36px",
            height: "36px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            transition: "all 0.2s",
            color: "var(--neutral-800)",
          }}
          onClick={() => setShowContactPopup(false)}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "var(--purple-100)";
            e.currentTarget.style.transform = "rotate(90deg)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "var(--purple-50)";
            e.currentTarget.style.transform = "rotate(0deg)";
          }}
        >
          <IoMdClose size={20} />
        </button>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "25px" }}>
          <div
            style={{
              width: "80px",
              height: "80px",
              borderRadius: "20px",
              backgroundColor: "var(--primary)",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "40px",
              fontWeight: "700",
              margin: "0 auto 15px auto",
              boxShadow: "0 15px 30px rgba(111, 68, 255, 0.2)",
            }}
          >
            {event.organizer.name.charAt(0)}
          </div>
          <h3 style={{ 
            margin: "0 0 5px 0", 
            color: "var(--dark)",
            fontSize: "24px",
            fontFamily: "var(--font-heading)" 
          }}>
            {event.organizer.name}
          </h3>
          <p style={{ 
            margin: "0", 
            color: "var(--neutral-600)",
            fontSize: "14px" 
          }}>
            Contact Information
          </p>
        </div>

        {/* Contact Details */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Website */}
          {event.organizer.website && (
            <a
              href={event.organizer.website.startsWith('http') ? event.organizer.website : `https://${event.organizer.website}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "15px",
                padding: "15px",
                backgroundColor: "var(--purple-50)",
                borderRadius: "12px",
                textDecoration: "none",
                color: "var(--neutral-800)",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "var(--purple-100)";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "var(--purple-50)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div style={{
                width: "40px",
                height: "40px",
                borderRadius: "10px",
                backgroundColor: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--primary)",
                boxShadow: "0 4px 10px rgba(111, 68, 255, 0.1)",
                flexShrink: 0,
              }}>
                <IoMdGlobe size={22} />
              </div>
              <div>
                <div style={{ fontWeight: "600", marginBottom: "3px" }}>Website</div>
                <div style={{ fontSize: "14px", color: "var(--primary)" }}>{event.organizer.website}</div>
              </div>
            </a>
          )}

          {/* Email */}
          {event.organizer.contactEmail && (
            <a
              href={`mailto:${event.organizer.contactEmail}`}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "15px",
                padding: "15px",
                backgroundColor: "var(--purple-50)",
                borderRadius: "12px",
                textDecoration: "none",
                color: "var(--neutral-800)",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "var(--purple-100)";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "var(--purple-50)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div style={{
                width: "40px",
                height: "40px",
                borderRadius: "10px",
                backgroundColor: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--primary)",
                boxShadow: "0 4px 10px rgba(111, 68, 255, 0.1)",
                flexShrink: 0,
              }}>
                <IoMdMail size={22} />
              </div>
              <div>
                <div style={{ fontWeight: "600", marginBottom: "3px" }}>Email</div>
                <div style={{ fontSize: "14px", color: "var(--primary)" }}>{event.organizer.contactEmail}</div>
              </div>
            </a>
          )}

          {/* Phone */}
          {event.organizer.phone && (
            <a
              href={`tel:${event.organizer.phone}`}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "15px",
                padding: "15px",
                backgroundColor: "var(--purple-50)",
                borderRadius: "12px",
                textDecoration: "none",
                color: "var(--neutral-800)",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "var(--purple-100)";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "var(--purple-50)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div style={{
                width: "40px",
                height: "40px",
                borderRadius: "10px",
                backgroundColor: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--primary)",
                boxShadow: "0 4px 10px rgba(111, 68, 255, 0.1)",
                flexShrink: 0,
              }}>
                <IoMdCall size={22} />
              </div>
              <div>
                <div style={{ fontWeight: "600", marginBottom: "3px" }}>Phone</div>
                <div style={{ fontSize: "14px", color: "var(--primary)" }}>{event.organizer.phone}</div>
              </div>
            </a>
          )}
        </div>

        {/* CTA Button */}
        <button
          style={{
            width: "100%",
            marginTop: "25px",
            padding: "14px",
            borderRadius: "12px",
            backgroundColor: "var(--primary)",
            color: "white",
            border: "none",
            fontWeight: "600",
            fontSize: "16px",
            cursor: "pointer",
            transition: "all 0.3s",
            boxShadow: "0 8px 20px rgba(111, 68, 255, 0.15)",
          }}
          onClick={() => {
            setShowContactPopup(false);
            // Add any additional action here if needed
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "var(--purple-700)";
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = "0 12px 25px rgba(111, 68, 255, 0.25)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "var(--primary)";
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 8px 20px rgba(111, 68, 255, 0.15)";
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default OrgContactPopup;