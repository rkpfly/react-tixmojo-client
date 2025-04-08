import React from 'react';
import { ScrollAnimation } from "../../utils/ScrollAnimation.jsx";
import { useAnimation } from "../../context/AnimationContext";

const NewOrganizerInfo = ({ event, organizerEvents, setShowContactPopup, navigate }) => {
  const { animationsEnabled, sidebarOpen } = useAnimation();
  
  return (
    <ScrollAnimation
      direction="up"
      distance={20}
      duration={0.8}
      delay={0.4}
      disabled={!animationsEnabled || sidebarOpen}
    >
      <div
        style={{
          marginTop: "50px",
          marginBottom: "40px",
          borderRadius: "24px",
          overflow: "hidden",
          boxShadow: "0 20px 40px rgba(111, 68, 255, 0.08)",
          border: "1px solid var(--purple-100)",
        }}
      >
        {/* Header section */}
        <div
          style={{
            background:
              "linear-gradient(120deg, var(--accent-pink) 0%, var(--primary) 100%)",
            padding: "25px 35px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Animated decorative shapes */}
          <div
            style={{
              position: "absolute",
              top: "-20px",
              right: "20%",
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              background: "rgba(255, 255, 255, 0.1)",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "-15px",
              right: "40%",
              width: "50px",
              height: "50px",
              borderRadius: "50%",
              background: "rgba(255, 255, 255, 0.08)",
            }}
          />

          {/* Section title with icon */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              position: "relative",
              zIndex: 5,
            }}
          >
            <div
              style={{
                width: "46px",
                height: "46px",
                borderRadius: "12px",
                background: "rgba(255, 255, 255, 0.2)",
                backdropFilter: "blur(8px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginRight: "16px",
                boxShadow: "0 8px 20px rgba(0, 0, 0, 0.1)",
              }}
            >
              <svg
                width="26"
                height="26"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ color: "white" }}
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
            <div>
              <h3
                style={{
                  margin: 0,
                  fontSize: "28px",
                  fontWeight: "700",
                  color: "white",
                  fontFamily: "var(--font-heading)",
                  letterSpacing: "-0.5px",
                  textShadow: "0 2px 10px rgba(0, 0, 0, 0.15)",
                }}
              >
                Organized By
              </h3>
              <div
                style={{
                  fontSize: "15px",
                  fontWeight: "400",
                  color: "rgba(255, 255, 255, 0.8)",
                  marginTop: "4px",
                }}
              >
                Bringing you this amazing experience
              </div>
            </div>
          </div>
        </div>

        {/* Content section */}
        <div
          style={{
            padding: "0",
            display: "flex",
            flexDirection: window.innerWidth < 768 ? "column" : "row",
            background: "var(--neutral-50)",
          }}
        >
          {/* Left side - Organizer Profile */}
          <div
            style={{
              padding: "30px",
              flex: "0 0 300px",
              borderRight:
                window.innerWidth < 768
                  ? "none"
                  : "1px solid var(--purple-100)",
              borderBottom:
                window.innerWidth < 768
                  ? "1px solid var(--purple-100)"
                  : "none",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              background:
                "linear-gradient(180deg, var(--purple-50) 0%, var(--neutral-50) 100%)",
            }}
          >
            {/* Avatar */}
            <div
              style={{
                width: "120px",
                height: "120px",
                borderRadius: "24px",
                backgroundColor: "var(--primary)",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "60px",
                fontWeight: "700",
                marginBottom: "20px",
                boxShadow: "0 15px 30px rgba(111, 68, 255, 0.2)",
                position: "relative",
              }}
            >
              {event.organizer.name.charAt(0)}
              <div
                style={{
                  position: "absolute",
                  bottom: "-8px",
                  right: "-8px",
                  backgroundColor: "#22c55e",
                  width: "30px",
                  height: "30px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "3px solid white",
                  boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
            </div>

            {/* Organizer name */}
            <h3
              style={{
                margin: "0 0 5px 0",
                fontSize: "24px",
                fontWeight: "700",
                color: "var(--dark)",
                textAlign: "center",
                fontFamily: "var(--font-heading)",
              }}
            >
              {event.organizer.name}
            </h3>

            {/* Verified badge */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "4px 10px",
                backgroundColor: "var(--purple-100)",
                borderRadius: "20px",
                marginBottom: "20px",
              }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--primary)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
              <span
                style={{
                  fontSize: "13px",
                  fontWeight: "600",
                  color: "var(--primary)",
                }}
              >
                Verified Organizer
              </span>
            </div>

            {/* Stats */}
            <div
              style={{
                display: "flex",
                width: "100%",
                justifyContent: "center",
                gap: "16px",
                marginBottom: "25px",
              }}
            >
              <div
                style={{
                  textAlign: "center",
                  padding: "10px",
                }}
              >
                <div
                  style={{
                    fontSize: "22px",
                    fontWeight: "700",
                    color: "var(--primary)",
                  }}
                >
                  {event.organizer.stats?.totalEvents || "0"}
                </div>
                <div
                  style={{
                    fontSize: "13px",
                    color: "var(--gray-medium)",
                  }}
                >
                  Events
                </div>
              </div>

              <div
                style={{
                  textAlign: "center",
                  padding: "10px",
                }}
              >
                <div
                  style={{
                    fontSize: "22px",
                    fontWeight: "700",
                    color: "var(--primary)",
                  }}
                >
                  {event.organizer.stats?.rating || "0"}
                </div>
                <div
                  style={{
                    fontSize: "13px",
                    color: "var(--gray-medium)",
                  }}
                >
                  Rating
                </div>
              </div>

              <div
                style={{
                  textAlign: "center",
                  padding: "10px",
                }}
              >
                <div
                  style={{
                    fontSize: "22px",
                    fontWeight: "700",
                    color: "var(--primary)",
                  }}
                >
                  {event.organizer.stats?.ticketsSold || "0"}
                </div>
                <div
                  style={{
                    fontSize: "13px",
                    color: "var(--gray-medium)",
                  }}
                >
                  Tickets
                </div>
              </div>
            </div>

            {/* Contact button */}
            <button
              style={{
                padding: "12px 24px",
                backgroundColor: "var(--primary)",
                color: "white",
                borderRadius: "12px",
                border: "none",
                fontSize: "15px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.3s ease",
                width: "100%",
                maxWidth: "220px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                boxShadow: "0 8px 20px rgba(111, 68, 255, 0.15)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow =
                  "0 12px 25px rgba(111, 68, 255, 0.25)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 8px 20px rgba(111, 68, 255, 0.15)";
              }}
              onClick={() => setShowContactPopup(true)}
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
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.364 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.337 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg>
              Contact Organizer
            </button>
          </div>

          {/* Right side - About & Other Events */}
          <div
            style={{
              flex: "1 1 auto",
              padding: "30px",
            }}
          >
            {/* About section */}
            <div
              style={{
                marginBottom: "30px",
              }}
            >
              <h4
                style={{
                  fontSize: "20px",
                  fontWeight: "700",
                  color: "var(--dark)",
                  marginTop: 0,
                  marginBottom: "15px",
                  position: "relative",
                  paddingLeft: "15px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: "4px",
                    height: "20px",
                    backgroundColor: "var(--primary)",
                    borderRadius: "2px",
                  }}
                />
                About the Organizer
              </h4>
              <p
                style={{
                  margin: 0,
                  lineHeight: 1.7,
                  color: "var(--neutral-700)",
                  marginBottom: "15px",
                }}
              >
                <strong style={{ color: "var(--primary)" }}>
                  {event.organizer.name}
                </strong>{" "}
                {event.organizer.description || 'Information about the organizer is not available.'}
              </p>
              
              {/* Additional organizer details */}
              {event.organizer.yearEstablished && (
                <p style={{ margin: "5px 0", fontSize: "14px", color: "var(--neutral-700)" }}>
                  <strong>Established:</strong> {event.organizer.yearEstablished}
                </p>
              )}
              
              {event.organizer.location && (
                <p style={{ margin: "5px 0", fontSize: "14px", color: "var(--neutral-700)" }}>
                  <strong>Location:</strong> {event.organizer.location}
                </p>
              )}
              
              {event.organizer.specialization && event.organizer.specialization.length > 0 && (
                <p style={{ margin: "5px 0", fontSize: "14px", color: "var(--neutral-700)" }}>
                  <strong>Specialization:</strong> {event.organizer.specialization.join(", ")}
                </p>
              )}
            </div>

            {/* Past Events section */}
            <div>
              <h4
                style={{
                  fontSize: "20px",
                  fontWeight: "700",
                  color: "var(--dark)",
                  marginTop: 0,
                  marginBottom: "15px",
                  position: "relative",
                  paddingLeft: "15px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: "4px",
                    height: "20px",
                    backgroundColor: "var(--primary)",
                    borderRadius: "2px",
                  }}
                />
                Other Events
              </h4>

              {/* Event cards */}
              <div
                style={{
                  display: "flex",
                  gap: "15px",
                  overflowX: "auto",
                  padding: "5px 0 15px 0",
                }}
              >
                {organizerEvents.length > 0 ? (
                  organizerEvents.map((orgEvent) => (
                    <div
                      key={orgEvent.id}
                      style={{
                        flex: "0 0 250px",
                        borderRadius: "12px",
                        overflow: "hidden",
                        boxShadow: "0 5px 15px rgba(0, 0, 0, 0.05)",
                        border: "1px solid var(--purple-100)",
                        transition: "all 0.3s ease",
                        cursor: "pointer",
                      }}
                      onClick={() => navigate(`/events/${orgEvent.id}`)}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-5px)";
                        e.currentTarget.style.boxShadow =
                          "0 10px 25px rgba(111, 68, 255, 0.12)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow =
                          "0 5px 15px rgba(0, 0, 0, 0.05)";
                      }}
                    >
                      <div
                        style={{
                          height: "120px",
                          backgroundImage: `url(${orgEvent.eventPoster})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                        }}
                      />
                      <div
                        style={{
                          padding: "15px",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "14px",
                            color: "var(--primary)",
                            fontWeight: "600",
                            marginBottom: "5px",
                          }}
                        >
                          {orgEvent.date?.split(',')[0]}
                        </div>
                        <div
                          style={{
                            fontSize: "16px",
                            fontWeight: "700",
                            color: "var(--dark)",
                            marginBottom: "10px",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {orgEvent.eventName}
                        </div>
                        <div
                          style={{
                            fontSize: "13px",
                            color: "var(--gray-medium)",
                          }}
                        >
                          {orgEvent.venueName || orgEvent.eventAddress}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={{ padding: "15px 0", color: "var(--gray-medium)", fontStyle: "italic" }}>
                    No other events found for this organizer.
                  </div>
                )}
              </div>

              {organizerEvents.length > 0 && (
                <button
                  style={{
                    marginTop: "20px",
                    padding: "10px 20px",
                    backgroundColor: "transparent",
                    color: "var(--primary)",
                    borderRadius: "10px",
                    border: "1px solid var(--purple-200)",
                    fontSize: "14px",
                    fontWeight: "600",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    justifyContent: "center",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor =
                      "var(--purple-50)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }}
                  onClick={() => navigate(`/page-not-found?organizer=${event.organizer.id}`)}
                >
                  View All Events by {event.organizer.name}
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
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </ScrollAnimation>
  );
};

export default NewOrganizerInfo;