import React from 'react';

const OrganizerInfo = ({
  event,
  organizerEvents,
  setShowContactPopup,
  navigate,
  windowWidth
}) => {
  return (
    <div className="organizer-container">
      <div className="organizer-header">
        <h4 className="organizer-title">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="organizer-title-icon"
          >
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
          Organizer Information
        </h4>
      </div>

      <div className="organizer-content">
        <div className="organizer-profile">
          <div className="organizer-header-row">
            <div className="organizer-avatar">
              {event.organizer.name.charAt(0)}
            </div>

            <div className="organizer-info">
              <h5 className="organizer-name">
                {event.organizer.name}
              </h5>

              <div className="organizer-badge">
                <span className="organizer-verified-dot" />
                Verified Organizer
              </div>
            </div>
          </div>

          <p className="organizer-description">
            {event.organizer.description}
          </p>

          {event.organizer.specialization && event.organizer.specialization.length > 0 && (
            <div className="organizer-specializations">
              <div className="specialization-title">
                Specializations
              </div>

              <div className="specialization-tags">
                {event.organizer.specialization.map((specialty, index) => (
                  <span
                    key={index}
                    className="specialization-tag"
                  >
                    {specialty}
                  </span>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={() => setShowContactPopup(true)}
            className="contact-button"
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
          <div className="other-events">
            <h5 className="other-events-title">
              More Events by This Organizer
            </h5>

            <div className="other-events-list">
              {organizerEvents.slice(0, 2).map((orgEvent, index) => (
                <div
                  key={index}
                  className="event-card"
                  onClick={() => navigate(`/events/${orgEvent.id}`)}
                >
                  <div className="event-card-image">
                    <img
                      src={orgEvent.eventPoster}
                      alt={orgEvent.eventName}
                    />
                  </div>

                  <div>
                    <h6 className="event-card-title">
                      {orgEvent.eventName}
                    </h6>

                    <div className="event-card-date">
                      {orgEvent.date?.split(",")[0] || ""}
                    </div>

                    <div className="event-card-venue">
                      {orgEvent.venueName}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {organizerEvents.length > 2 && (
              <button
                onClick={() => navigate(`/page-not-found?organizer=${event.organizer.id}`)}
                className="view-all-button"
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