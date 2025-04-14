import React from 'react';
import { ScrollAnimation } from "../../utils/ScrollAnimation.jsx";
import { useAnimation } from "../../context/AnimationContext";
import { BsCalendar2Date } from "react-icons/bs";
import { HiOutlineLocationMarker, HiOutlineExternalLink } from "react-icons/hi";
import { IoTicketOutline } from "react-icons/io5";

const EventMainInfo = ({ event, handleGetTickets, hideTicketButton = false }) => {
  const { animationsEnabled, sidebarOpen } = useAnimation();
  return (
    <div
      style={{
        display: "flex",
        flexDirection: window.innerWidth < 768 ? "column" : "row",
        gap: window.innerWidth < 768 ? "0px" : "30px",
        marginTop: "30px",
      }}
    >
      {/* Left column - Event image */}
      <ScrollAnimation
        direction="left"
        distance={30}
        duration={0.9}
        delay={0.1}
        disabled={!animationsEnabled || sidebarOpen}
      >
        <div
          style={{
            flex: window.innerWidth < 768 ? "1" : "3",
            borderRadius: "20px",
            overflow: "hidden",
            boxShadow: "0 10px 30px rgba(111, 68, 255, 0.12)",
          }}
        >
          <img
            src={event.image}
            alt={event.title}
            style={{
              height: "100%",
              objectFit: "cover",
              display: "block",
              width: window.innerWidth < 768 ? "100%" : "700px",
              aspectRatio:"700 / 350",
            }}
          />
        </div>
      </ScrollAnimation>

      {/* Right column - Event details */}
      <ScrollAnimation
        direction="right"
        distance={30}
        duration={0.9}
        delay={0.2}
        disabled={!animationsEnabled || sidebarOpen}
      >
        <div
          style={{
            flex: window.innerWidth < 768 ? "1" : "2",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: window.innerWidth < 768 ? "2rem" : "3rem",
              marginTop: "2rem",
            }}
          >
            {/* Date & Time */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                padding: "0 15px",
              }}
            >
              <div
                style={{
                  width: "45px",
                  height: "45px",
                  borderRadius: "50%",
                  backgroundColor: "var(--purple-100)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: "15px",
                  flexShrink: 0,
                }}
              >
                <BsCalendar2Date
                  style={{
                    color: "var(--primary)",
                    fontSize: "22px",
                  }}
                />
              </div>
              <div>
                <div
                  style={{
                    fontWeight: "700",
                    fontSize: "18px",
                    color: "var(--dark)",
                    marginBottom: "4px",
                  }}
                >
                  {event.date}
                </div>
                <div
                  style={{
                    color: "var(--gray-medium)",
                    fontSize: "16px",
                    fontWeight: "500",
                  }}
                >
                  {event.time}
                </div>
              </div>
            </div>

            {/* Venue */}
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                padding: "0 15px",
              }}
            >
              <div
                style={{
                  width: "45px",
                  height: "45px",
                  borderRadius: "50%",
                  backgroundColor: "var(--purple-100)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: "15px",
                  flexShrink: 0,
                }}
              >
                <HiOutlineLocationMarker
                  style={{
                    color: "var(--primary)",
                    fontSize: "22px",
                  }}
                />
              </div>
              <div>
                <div
                  style={{
                    fontWeight: "700",
                    fontSize: "18px",
                    color: "var(--dark)",
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "4px",
                  }}
                >
                  <a
                    href={event.locationMap}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ textDecoration: "none", color: "var(--dark)" }}
                    onMouseEnter={(e) => {
                      e.target.style.color = "var(--primary)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.color = "var(--dark)";
                    }}
                  >
                    {event.venueName}
                  </a>
                  <a
                    href={event.locationMap}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      marginLeft: "8px",
                      color: "var(--primary)",
                    }}
                  >
                    <HiOutlineExternalLink
                      style={{
                        fontSize: "18px",
                      }}
                    />
                  </a>
                </div>
                <a
                  href={event.locationMap}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: "var(--gray-medium)",
                    fontSize: "16px",
                    lineHeight: "1.5",
                    fontWeight: "500",
                    textDecoration: "none",
                    borderBottom: "1px dashed var(--purple-300)",
                    display: "inline-block",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.color = "var(--primary)";
                    e.target.style.borderColor = "var(--primary)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.color = "var(--gray-medium)";
                    e.target.style.borderColor = "var(--purple-300)";
                  }}
                >
                  {event.venueAddress}
                </a>
              </div>
            </div>

            {/* Price */}
            <div
              style={{
                display: hideTicketButton ? "none" : "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "3px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "left",
                  flexDirection: "column",
                  marginRight: "10px",
                }}
              >
                <div
                  style={{
                    fontSize: window.innerWidth < 768 ? "14px" : "18px",
                    color: "var(--neutral-800)",
                    fontWeight: "500",
                  }}
                >
                  Tickets Starting from
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <IoTicketOutline
                    style={{
                      color: "var(--primary)",
                      fontSize: window.innerWidth < 768 ? "28px" : "32px",
                      marginRight: "5px",
                    }}
                  >
                    {" "}
                  </IoTicketOutline>
                  <span
                    style={{
                      fontWeight: "800",
                      fontSize: window.innerWidth < 768 ? "28px" : "35px",
                      color: "black",
                      fontFamily: "var(--font-heading)",
                      lineHeight: "1",
                    }}
                  >
                    {event.price.currency} {event.price.value}
                  </span>
                </div>
              </div>

              <button
                onClick={handleGetTickets}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow =
                    "0px 6px 15px rgba(255, 87, 87, 0.4)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0px 4px 10px rgba(255, 87, 87, 0.3)";
                }}
                style={{
                  backgroundColor: "#ff5757",
                  color: "white",
                  border: "none",
                  borderRadius: "12px",
                  padding: window.innerWidth < 768 ? "10px" : "15px",
                  fontSize:"18px",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  boxShadow: "0px 4px 10px rgba(255, 87, 87, 0.3)",
                  fontFamily: "var(--font-heading)",
                  letterSpacing: "0.5px",
                }}
              >
                Get Tickets
              </button>
            </div>
          </div>
        </div>
      </ScrollAnimation>
    </div>
  );
};

export default EventMainInfo;