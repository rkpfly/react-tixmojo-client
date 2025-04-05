import React, { useState, useCallback, memo } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { SlCalender } from "react-icons/sl";
import { IoLocationOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const Cards = memo(function Cards({
  eventName,
  eventPoster,
  eventAddress,
  eventDate,
  eventPrice,
  eventRanking,
  isRecommendation = false,
  hideRanking = false,
  id, // Added id prop
}) {
  const { t } = useTranslation();
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  const handleMouseEnter = useCallback(() => setIsHovered(true), []);
  const handleMouseLeave = useCallback(() => setIsHovered(false), []);

  const handleClick = useCallback(() => {
    // Navigate to event details page using id if available or create from event name
    const eventId = id || eventName.toLowerCase().replace(/\s+/g, "-");
    navigate(`/events/${eventId}`);
  }, [eventName, navigate, id]);

  const handleButtonClick = useCallback(
    (e) => {
      e.stopPropagation(); // Prevent triggering card click event
      // Convert event name to URL-friendly format
      const eventId = eventName.toLowerCase().replace(/\s+/g, "-");
      // Navigate to event details page
      navigate(`/events/${eventId}`);
    },
    [eventName, eventPrice, navigate]
  );

  // Lu.ma inspired card design
  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      role="button"
      aria-label={`Event: ${eventName}`}
      tabIndex={0}
      style={{
        width: "330px",
        borderRadius: "16px",
        overflow: "hidden",
        backgroundColor: "var(--neutral-50)",
        boxShadow: isHovered
          ? "0 15px 30px rgba(22, 22, 43, 0.08)"
          : "0 8px 20px rgba(22, 22, 43, 0.04)",
        transition: "all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1)",
        transform: isHovered ? "translateY(-8px)" : "translateY(0)",
        cursor: "pointer",
        border: "1px solid var(--neutral-200)",
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      {/* Ranking badge */}
      {eventRanking && !hideRanking && (
        <div
          style={{
            position: "absolute",
            top: "12px",
            left: "12px",
            zIndex: 10,
            width: "40px",
            height: "40px",
            borderRadius: "12px",
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            backdropFilter: "blur(5px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
            transition: "transform 0.3s ease",
            border: "1px solid rgba(255, 255, 255, 0.2)",
          }}
        >
          <span
            style={{
              fontSize: "22px",
              fontWeight: "700",
              lineHeight: "1",
              color: "white",
              fontFamily: "var(--font-primary)",
            }}
          >
            #{eventRanking}
          </span>
        </div>
      )}

      {/* Event image */}
      <div
        style={{
          position: "relative",
          height: "200px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundImage: `url(${eventPoster})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            transition: "transform 0.8s cubic-bezier(0.165, 0.84, 0.44, 1)",
            transform: isHovered ? "scale(1.08)" : "scale(1)",
          }}
        ></div>

        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background:
              "linear-gradient(0deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.2) 50%, rgba(0, 0, 0, 0.1) 100%)",
            opacity: 0.6,
            transition: "opacity 0.3s ease",
          }}
        ></div>

        {/* Price badge on image */}
        <div
          style={{
            position: "absolute",
            bottom: "12px",
            right: "12px",
            zIndex: 10,
            backgroundColor: "rgba(0, 0, 0, 0.75)",
            color: "white",
            borderRadius: "30px",
            padding: "6px 12px",
            fontSize: "14px",
            fontWeight: "600",
            backdropFilter: "blur(5px)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            boxShadow: "0 2px 6px rgba(0, 0, 0, 0.2)",
          }}
        >
          AUD {eventPrice}
        </div>
      </div>

      {/* Content */}
      <div
        style={{
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}
      >
        {/* Date */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            fontSize: "14px",
            color: "var(--primary)",
            fontWeight: "600",
          }}
        >
          <SlCalender
            style={{
              marginRight: "8px",
              fontSize: "14px",
            }}
          />
          <span>{eventDate}</span>
        </div>

        {/* Title */}
        <h3
          style={{
            fontSize: "18px",
            fontWeight: "700",
            lineHeight: "1.4",
            color: "var(--dark)",
            margin: "0",
            transition: "color 0.3s ease",
            color: isHovered ? "var(--primary)" : "var(--dark)",
          }}
        >
          {eventName}
        </h3>

        {/* Location */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            fontSize: "14px",
            color: "var(--gray-medium)",
          }}
        >
          <IoLocationOutline
            style={{
              color: "var(--gray-medium)",
              marginRight: "8px",
              marginTop: "4px",
              flexShrink: 0,
              fontSize: "16px",
            }}
          />
          <span style={{ lineHeight: "1.4" }}>{eventAddress}</span>
        </div>

        {/* Button */}
        <button
          onClick={handleButtonClick}
          aria-label={`Book ticket for ${eventName}`}
          style={{
            marginTop: "10px",
            backgroundColor: isHovered
              ? "var(--primary)"
              : "var(--neutral-100)",
            color: isHovered ? "white" : "var(--dark)",
            border: "none",
            borderRadius: "10px",
            padding: "12px",
            fontWeight: "600",
            fontSize: "15px",
            cursor: "pointer",
            transition: "all 0.3s ease",
            width: "100%",
            textAlign: "center",
          }}
        >
          Get Tickets
        </button>
      </div>
    </div>
  );
});

// PropTypes validation
Cards.propTypes = {
  eventName: PropTypes.string,
  eventPoster: PropTypes.string,
  eventAddress: PropTypes.string,
  eventDate: PropTypes.string,
  eventPrice: PropTypes.string,
  eventRanking: PropTypes.string,
  rankScore: PropTypes.number,
  eventLocation: PropTypes.string,
  isRecommendation: PropTypes.bool,
  hideRanking: PropTypes.bool,
  id: PropTypes.string, // Added id prop
};

export default Cards;
