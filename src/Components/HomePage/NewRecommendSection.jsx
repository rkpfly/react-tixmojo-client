import React, { useState, useRef, useCallback, useEffect } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { MdNavigateNext, MdNavigateBefore } from "react-icons/md";
import Cards from "./Cards.jsx";
import { useScrollAnimation } from "../../utils/ScrollAnimation.jsx";

function NewRecommendSection({
  title = "Trending Now",
  subtitle = "Check out what's hot this month",
  events = [],
  containerId = "newRecommendContainer",
}) {
  const { t } = useTranslation();
  const scrollContainerRef = useRef(null);
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(true);

  // Update navigation buttons based on scroll position
  const updateNavigationButtons = useCallback(() => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;
      setShowLeftButton(scrollLeft > 0);
      setShowRightButton(scrollLeft < scrollWidth - clientWidth - 10);
    }
  }, []);

  // Scroll handlers
  const handleScrollLeft = useCallback(() => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const cardWidth = container.querySelector("div")?.offsetWidth || 320;
      container.scrollBy({ left: -cardWidth, behavior: "smooth" });
    }
  }, []);

  const handleScrollRight = useCallback(() => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const cardWidth = container.querySelector("div")?.offsetWidth || 320;
      container.scrollBy({ left: cardWidth, behavior: "smooth" });
    }
  }, []);

  // Register scroll listener
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", updateNavigationButtons);
      updateNavigationButtons();
      return () => {
        scrollContainer.removeEventListener("scroll", updateNavigationButtons);
      };
    }
  }, [updateNavigationButtons]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "ArrowLeft") {
        handleScrollLeft();
      } else if (e.key === "ArrowRight") {
        handleScrollRight();
      }
    },
    [handleScrollLeft, handleScrollRight]
  );

  // Scroll animations
  const [cardsContainerRef, isCardsContainerVisible] = useScrollAnimation({
    threshold: 0.1,
    once: true,
  });

  const [titleRef, isTitleVisible] = useScrollAnimation({
    threshold: 0.1,
    once: true,
  });

  return (
    <div
      className="section-container"
      style={{
        padding: "20px 0",
        marginBottom: "40px",
        background:
          "linear-gradient(170deg, var(--purple-50) 0%, var(--neutral-50) 100%)",
        borderRadius: "30px",
        boxShadow: "0 5px 20px rgba(111, 68, 255, 0.05)",
      }}
    >
      <div
        className="container"
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 20px",
        }}
      >
        <div
          className="section-header"
          style={{
            marginBottom: "20px",
            position: "relative",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <div
            ref={titleRef}
            style={{
              position: "relative",
              marginBottom: "10px",
              display: "inline-block",
              opacity: isTitleVisible ? 1 : 0,
              transform: isTitleVisible ? "translateY(0)" : "translateY(20px)",
              transition: "opacity 0.8s ease, transform 0.8s ease",
            }}
          >
            <span
              style={{
                position: "absolute",
                height: "12px",
                width: "100%",
                bottom: "8px",
                left: "0",
                background: "rgba(111, 68, 255, 0.15)",
                zIndex: "0",
                borderRadius: "4px",
              }}
            ></span>
            <h2
              className="section-title slide-up"
              style={{
                position: "relative",
                zIndex: "1",
                marginBottom: "0",
                display: "inline-block",
                fontSize: "42px",
              }}
            >
              {title}
            </h2>
          </div>
          <p
            className="section-subtitle slide-up"
            style={{
              maxWidth: "600px",
              fontWeight: "500",
            }}
          >
            {subtitle}
          </p>
        </div>

        <div
          style={{
            position: "relative",
          }}
          onKeyDown={handleKeyDown}
          tabIndex="0"
        >
          {/* Navigation Buttons */}
          {window.innerWidth > 768 && <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              position: "absolute",
              top: "50%",
              left: "-24px",
              right: "-24px",
              transform: "translateY(-50%)",
              zIndex: 5,
              pointerEvents: "none",
            }}
          >
            <button
              onClick={handleScrollLeft}
              disabled={!showLeftButton}
              aria-label="Scroll left"
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "50%",
                background: "var(--light)",
                color: "var(--primary)",
                border: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "all 0.3s ease",
                boxShadow: "0 4px 20px rgba(111, 68, 255, 0.2)",
                opacity: showLeftButton ? 1 : 0,
                pointerEvents: showLeftButton ? "auto" : "none",
                transform: showLeftButton ? "scale(1)" : "scale(0.9)",
              }}
              onMouseEnter={(e) => {
                if (showLeftButton) {
                  e.currentTarget.style.background = "var(--primary)";
                  e.currentTarget.style.color = "var(--light)";
                  e.currentTarget.style.transform = "scale(1.1)";
                }
              }}
              onMouseLeave={(e) => {
                if (showLeftButton) {
                  e.currentTarget.style.background = "var(--light)";
                  e.currentTarget.style.color = "var(--primary)";
                  e.currentTarget.style.transform = "scale(1)";
                }
              }}
            >
              <MdNavigateBefore style={{ fontSize: "28px" }} />
            </button>

            <button
              onClick={handleScrollRight}
              disabled={!showRightButton}
              aria-label="Scroll right"
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "50%",
                background: "var(--light)",
                color: "var(--primary)",
                border: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "all 0.3s ease",
                boxShadow: "0 4px 20px rgba(111, 68, 255, 0.2)",
                opacity: showRightButton ? 1 : 0,
                pointerEvents: showRightButton ? "auto" : "none",
                transform: showRightButton ? "scale(1)" : "scale(0.9)",
              }}
              onMouseEnter={(e) => {
                if (showRightButton) {
                  e.currentTarget.style.background = "var(--primary)";
                  e.currentTarget.style.color = "var(--light)";
                  e.currentTarget.style.transform = "scale(1.1)";
                }
              }}
              onMouseLeave={(e) => {
                if (showRightButton) {
                  e.currentTarget.style.background = "var(--light)";
                  e.currentTarget.style.color = "var(--primary)";
                  e.currentTarget.style.transform = "scale(1)";
                }
              }}
            >
              <MdNavigateNext style={{ fontSize: "28px" }} />
            </button>
          </div>}

          {/* Scrollable Container */}
          <div
            id={containerId}
            ref={(el) => {
              // Assign both refs to the same element
              scrollContainerRef.current = el;
              if (cardsContainerRef) cardsContainerRef.current = el;
            }}
            className="scrollbar-container"
            style={{
              display: "flex",
              overflowX: "auto",
              gap: "24px",
              padding: "20px 10px 30px",
              position: "relative",
              marginTop: "10px",
              opacity: isCardsContainerVisible ? 1 : 0,
              transform: isCardsContainerVisible
                ? "translateY(0)"
                : "translateY(30px)",
              transition: "opacity 0.8s ease, transform 0.8s ease",
            }}
          >
            {events.map((event, index) => (
              <div
                key={index}
                className="fade-in"
                style={{
                  flex: "0 0 auto",
                  opacity: isCardsContainerVisible ? 1 : 0,
                  transform: isCardsContainerVisible
                    ? "translateY(0)"
                    : "translateY(40px)",
                  transition: `opacity 0.6s ease, 
                             transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)`,
                  transitionDelay: `${0.1 + index * 0.1}s`,
                }}
                onMouseEnter={(e) => {
                  // Only apply hover effect if animation has completed
                  if (isCardsContainerVisible) {
                    e.currentTarget.style.transform = "translateY(-12px)";
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                {/* Pass hideRanking=true to hide the ranking indicator */}
                <Cards
                  eventName={event.eventName}
                  eventDate={event.eventDate || "Upcoming"}
                  eventAddress={
                    event.eventAddress ||
                    `${event.venueName || ""}, ${event.venueAddress || ""}`
                  }
                  eventPrice={event.eventPrice || "Free"}
                  eventPoster={
                    event.eventPoster ||
                    "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3"
                  }
                  eventRanking={event.eventRanking || String(index + 1)}
                  rankScore={event.rankScore || 100 - index}
                  eventLocation={event.eventLocation || "TBA"}
                  isRecommendation={true}
                  hideRanking={true}
                  id={event.id}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

NewRecommendSection.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  events: PropTypes.array,
  containerId: PropTypes.string,
};

export default NewRecommendSection;
