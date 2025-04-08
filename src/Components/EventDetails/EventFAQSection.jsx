import React from 'react';

const EventFAQSection = ({ faq, showMoreOptions, setShowMoreOptions }) => {
  return (
    <>
      {faq && Object.entries(faq).map(([key, eventFaq], index) => (
        <>
          <div
            style={{
              backgroundColor: "white",
              padding: "25px",
              borderRadius: "16px",
              boxShadow: "0 5px 15px rgba(111, 68, 255, 0.08)",
              marginBottom: "25px",
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
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
              Event FAQ
            </h4>


            {/* FAQ Item - Expandable */}
            <div
              style={{
                marginBottom: "15px",
                borderBottom: "1px solid var(--purple-100)",
                paddingBottom: "15px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  cursor: "pointer",
                  padding: "10px 5px",
                }}
                onClick={() => setShowMoreOptions(!showMoreOptions)}
              >
                <h5
                  style={{
                    fontSize: "16px",
                    fontWeight: "600",
                    color: "var(--neutral-800)",
                    margin: 0,
                  }}
                >
                  {key}
                </h5>
                <span
                  style={{
                    transition: "transform 0.3s ease",
                    transform: showMoreOptions ? "rotate(180deg)" : "rotate(0deg)",
                    color: "var(--primary)",
                    fontSize: "12px",
                  }}
                >
                  ▼
                </span>
              </div>

              {/* FAQ Answer - Collapsible */}
              <div
                style={{
                  maxHeight: showMoreOptions ? "500px" : "0",
                  overflow: "hidden",
                  transition: "max-height 0.3s ease",
                }}
              >
                <p
                  style={{
                    fontSize: "14px",
                    lineHeight: 1.6,
                    color: "var(--neutral-700)",
                    marginTop: "10px",
                    padding: "0 5px 0 15px",
                    borderLeft: "2px solid var(--purple-200)",
                  }}
                >
                  {eventFaq}
                </p>
              </div>
            </div>
          </div>
        </>
      ))}
    </>
  );
};

export default EventFAQSection;