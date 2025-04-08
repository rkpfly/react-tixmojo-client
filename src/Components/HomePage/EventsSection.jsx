import React, {
  useState,
  useRef,
  useCallback,
  useMemo,
  useEffect,
} from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { MdNavigateNext, MdNavigateBefore } from "react-icons/md";
import Cards from "./Cards.jsx";
import { getLocationDetails } from "../../services/api.js";

const EventsSection = ({
  title,
  location,
  events = [],
  containerId = "scrollContainer",
  onLocationChange = () => {},
  availableLocations,
}) => {
  // Set default filter to "All"
  const [activeFilter, setActiveFilter] = useState("All");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(location);
  const [locationData, setLocationData] = useState({
    title: `Event in`,
    subtitle: `Discover the most popular events happening in ${location} right now`,
    image: "",
    description: "",
  });
  const scrollContainerRef = useRef(null);
  const dropdownRef = useRef(null);

  const { t } = useTranslation();

  // Fetch location data from backend
  useEffect(() => {
    const fetchLocationData = async () => {
      try {
        const data = await getLocationDetails(selectedLocation);
        if (data) {
          setLocationData(data);
        }
      } catch (error) {
        console.error("Error fetching location data:", error);
        // Fallback to basic data if API fails
        setLocationData({
          title: `Event in`,
          subtitle: `Discover the most popular events happening in ${selectedLocation} right now`,
          image: "",
          description: "",
        });
      }
    };

    fetchLocationData();
  }, [selectedLocation]);

  // Filter options - keep them consistent with what's expected in the filter logic
  const filterOptions = [
    "All",
    "Today",
    "Tomorrow", 
    "This Week"
  ];

  // Keep selectedLocation in sync with location prop
  useEffect(() => {
    setSelectedLocation(location);
  }, [location]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Define handleFilterClick forward declaration to avoid dependency issues
  const handleFilterClickRef = useRef(null);


  // Filter the events based on the selected filter, location, and reassign sequential rankings
  const filteredEvents = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to beginning of day

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);

    // First, filter all events by location with better handling of data structure
    let locationFilteredEvents = events.filter(
      (event) => {
        // If event is null or undefined, skip it
        if (!event) return false;
        
        // Check eventLocation property (primary method)
        if (event.eventLocation && 
            event.eventLocation.toLowerCase() === location.toLowerCase()) {
          return true;
        }
        
        // Check eventAddress if eventLocation is not available
        if (!event.eventLocation && event.eventAddress && 
            event.eventAddress.toLowerCase().includes(location.toLowerCase())) {
          return true;
        }
        
        // Check venueAddress as fallback (from server data format)
        if (event.venueAddress && 
            event.venueAddress.toLowerCase().includes(location.toLowerCase())) {
          return true;
        }
        
        return false;
      }
    );

    // Then apply date filter
    let dateFilteredEvents = [];

    if (activeFilter === "All") {
      // For "All", include all events for this location
      dateFilteredEvents = [...locationFilteredEvents];
    } else {
      // For other filters, filter by date
      dateFilteredEvents = locationFilteredEvents.filter((event) => {
        // Handle server data format which might have full date as a string
        let eventDate;
        
        try {
          if (event.date && typeof event.date === 'string' && event.date.includes(',')) {
            // Format like "Thursday, 3 Apr, 2025"
            const serverDateParts = event.date.split(', ');
            if (serverDateParts.length >= 2) {
              const dayMonth = serverDateParts[1].split(' ');
              const day = parseInt(dayMonth[0], 10);
              const month = dayMonth[1];
              const year = serverDateParts[2] ? parseInt(serverDateParts[2], 10) : today.getFullYear();
              
              // Convert month name to month number (0-11)
              const monthMap = {
                Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
                Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
              };
              
              // Create date object
              eventDate = new Date(year, monthMap[month], day);
            }
          }
          // Fall back to original format if server format not recognized
          else if (event.eventDate) {
            // Extract start date from format like "25 Mar - 27 Mar"
            const dateParts = event.eventDate.split(" - ")[0].split(" ");
            const day = parseInt(dateParts[0], 10);
            
            // Convert month abbreviation to month number (0-11)
            const monthMap = {
              Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
              Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
            };
            const month = monthMap[dateParts[1]];
            
            // Create a date object for the event start date (use current year)
            eventDate = new Date(today.getFullYear(), month, day);
          } else {
            // Default to today if no date information is available
            eventDate = new Date(today);
          }
        } catch (error) {
          console.error("Error parsing event date:", error, event);
          // Default to today's date on error
          eventDate = new Date(today);
        }

        // Adjust for next year if month exists and is earlier than current (for events at end/beginning of year)
        try {
          if (typeof month !== 'undefined' && month < today.getMonth()) {
            eventDate.setFullYear(today.getFullYear() + 1);
          }
        } catch (error) {
          console.error("Error adjusting year:", error);
        }

        // First check if the server event has a specific eventDateType property we can use directly
        if (event.eventDateType) {
          // Early exit for "All" filter - show everything
          if (activeFilter === "All") {
            return true;
          }
          
          // Direct comparison of filters to eventDateType
          if (activeFilter === "Today" && event.eventDateType === 'today') {
            return true;
          }
          if (activeFilter === "Tomorrow" && event.eventDateType === 'tomorrow') {
            return true;
          }
          if (activeFilter === "This Week" && event.eventDateType === 'thisWeek') {
            return true;
          }
          
          // If we have a specific filter but this event doesn't match, filter it out
          return false;
        }
        
        // Fall back to date comparison if no eventDateType is available
        try {
          switch (activeFilter) {
            case "Today":
              return eventDate.getTime() === today.getTime();
            case "Tomorrow":
              return eventDate.getTime() === tomorrow.getTime();
            case "This Week":
              return eventDate >= today && eventDate < nextWeek;
            default:
              return true;
          }
        } catch (error) {
          console.error("Error filtering event by date:", error, event);
          // Default to showing the event if there's an error with date parsing
          return true;
        }
      });
    }

    // Sort filtered events by rankScore
    dateFilteredEvents.sort((a, b) => (b.rankScore || 0) - (a.rankScore || 0));

    // Create a new array with reassigned sequential rankings (1, 2, 3, 4...)
    const eventsWithSequentialRanking = dateFilteredEvents.map(
      (event, index) => {
        // Create a new object to avoid modifying the original
        return {
          ...event,
          // Assign sequential ranking starting from 1
          eventRanking: String(index + 1),
        };
      }
    );

    return eventsWithSequentialRanking;
  }, [events, activeFilter, location]);

  // Handle filter click
  const handleFilterClick = useCallback((filter) => {
    setActiveFilter(filter);

    // Scroll to the top of the container
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft = 0;
    }
  }, []);

  // Store the handle filter click function in a ref for use in handleLocationSelect
  useEffect(() => {
    handleFilterClickRef.current = handleFilterClick;
  }, [handleFilterClick]);

  // Handle location selection
  const handleLocationSelect = useCallback(
    (newLocation) => {
      // Don't do anything if the location is the same
      if (selectedLocation === newLocation) {
        setIsDropdownOpen(false);
        return;
      }
      
      // Update local state
      setSelectedLocation(newLocation);
      setIsDropdownOpen(false);

      // Show loading state temporarily while we transition data
      // This will be brief since we're using cached data
      // setLoading(true);
      
      // Reset filter to "All" when location changes
      if (handleFilterClickRef.current) {
        handleFilterClickRef.current("All");
      }

      // Scroll container back to start
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollLeft = 0;
      }
      
      // Call the parent's location change handler with the new location
      if (onLocationChange) {
        onLocationChange(newLocation);
      }
    },
    [selectedLocation, onLocationChange]
  );

  // Navigation handlers with useRef instead of direct DOM manipulation
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

  // Set up scroll event listener
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", updateNavigationButtons);
      // Initial check for button visibility
      updateNavigationButtons();
      return () => {
        container.removeEventListener("scroll", updateNavigationButtons);
      };
    }
  }, [updateNavigationButtons]);

  const handleScrollLeft = useCallback(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -scrollContainerRef.current.clientWidth / 2,
        behavior: "smooth",
      });
    }
  }, []);

  const handleScrollRight = useCallback(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: scrollContainerRef.current.clientWidth / 2,
        behavior: "smooth",
      });
    }
  }, []);

  // Handle keyboard navigation for accessibility
  const handleKeyDown = useCallback((e, action) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      action();
    }
  }, []);

  return (
    <div className="section-container">
      <div
        className="container"
        style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 20px" }}
      >
        {/* Section header with title and location selector */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "15px",
            marginBottom: "30px",
          }}
        >
          <div style={{ maxWidth: "600px", position: "relative", zIndex: 10 }}>
            <h2 className="section-title slide-up">
              {title}
              <span
                ref={dropdownRef}
                style={{
                  position: "relative",
                  display: "inline-flex",
                  cursor: "pointer",
                  alignItems: "center",
                  // backgroundColor: "var(--light)",
                  padding: "4px",
                  borderRadius: "30px",
                  marginLeft: "2px",
                  transition: "all 0.3s ease",
                  boxShadow: "none",
                }}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <span
                  style={{
                    color: "var(--primary)",
                    fontWeight: "700",
                    letterSpacing: "0.5px",
                    borderBottom: "2px solid var(--primary)",
                    paddingBottom: "2px",
                  }}
                >
                  {selectedLocation}
                </span>
                <span
                  style={{
                    marginLeft: "8px",
                    transform: isDropdownOpen ? "rotate(180deg)" : "none",
                    transition: "transform 0.3s ease",
                    fontSize: "14px",
                    color: "var(--primary)",
                  }}
                >
                  ▾
                </span>

                {isDropdownOpen && (
                  <div
                    className="location-dropdown-content"
                    style={{
                      // boxShadow: "0 10px 25px rgba(111, 68, 255, 0.15)",
                      border: "1px solid var(--purple-100)",
                      width: "240px",
                      borderRadius: "16px",
                      zIndex: 1000,
                    }}
                  >
                    {availableLocations.map((city) => (
                      <div
                        key={city}
                        className={`location-dropdown-item ${
                          selectedLocation === city ? "selected" : ""
                        }`}
                        onClick={() => handleLocationSelect(city)}
                        style={{
                          padding: "16px 18px",
                          fontSize: "15px",
                          borderBottom:
                            city !==
                            availableLocations[availableLocations.length - 1]
                              ? "1px solid var(--purple-100)"
                              : "none",
                          borderLeft:
                            selectedLocation === city
                              ? "3px solid var(--primary)"
                              : "3px solid transparent",
                        }}
                      >
                        {city}
                      </div>
                    ))}
                  </div>
                )}
              </span>
            </h2>
            <p
              className="section-subtitle slide-up"
              style={{ position: "relative", zIndex: -1 }}
            >
              {locationData.subtitle ||
                `Discover the most popular events happening in ${selectedLocation} right now`}
            </p>
          </div>

          {/* Filter options */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              flexWrap: "wrap",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                border: "1px solid rgba(107, 56, 251, 0.2)",
                borderRadius: "50px",
                padding: "4px",
                background: "rgba(107, 56, 251, 0.05)",
              }}
            >
              {filterOptions.map((filter) => (
                <button
                  key={filter}
                  onClick={() => handleFilterClick(filter)}
                  className={`filter-tab ${
                    activeFilter === filter ? "active" : ""
                  }`}
                  aria-pressed={activeFilter === filter}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Horizontal scrollable container with side navigation buttons */}
        <div
          style={{
            position: "relative",
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowLeft") {
              handleScrollLeft();
            } else if (e.key === "ArrowRight") {
              handleScrollRight();
            }
          }}
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

          {/* Scrollable content */}
          <div
            id={containerId}
            ref={scrollContainerRef}
            className="scrollbar-container"
            style={{
              display: "flex",
              overflowX: "auto",
              gap: "20px",
              padding: "10px 0 30px 0",
              scrollbarWidth: "thin",
              scrollBehavior: "smooth",
              position: "relative",
            }}
          >
            {/* Display empty state if no events */}
            {filteredEvents.length === 0 ? (
              <div
                style={{
                  width: "100%",
                  textAlign: "center",
                  padding: "60px 0",
                  color: "var(--gray-medium)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "15px",
                }}
              >
                <div
                  style={{
                    fontSize: "24px",
                    marginBottom: "10px",
                    color: "var(--dark)",
                  }}
                >
                  {t("eventsSection.noEvents.title")}
                </div>
                <div>
                  {t("eventsSection.noEvents.message", {
                    location: location,
                    filter: activeFilter,
                  })}
                </div>
                <button
                  className="btn btn-primary"
                  style={{ marginTop: "15px" }}
                  onClick={() => handleFilterClick("All")}
                >
                  {t("eventsSection.noEvents.viewAll")}
                </button>
              </div>
            ) : (
              /* Display all event cards */
              filteredEvents.map((event, index) => {
                
                return (
                  <div
                    key={index}
                    className="fade-in"
                    style={{
                      flex: "0 0 auto",
                      animationDelay: `${index * 0.1}s`,
                    }}
                  >
                    <Cards
                      eventName={event.eventName}
                      eventDate={event.eventDate || "Upcoming"}
                      eventAddress={event.eventAddress || `${event.venueName || ''}, ${event.venueAddress || ''}`}
                      eventPrice={event.eventPrice || "Free"}
                      eventPoster={event.eventPoster || "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3"}
                      eventRanking={event.eventRanking || String(index + 1)}
                      rankScore={event.rankScore || 100 - index}
                      eventLocation={event.eventLocation || "TBA"}
                      isRecommendation={true}
                      id={event.id}
                    />
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// PropTypes validation
EventsSection.propTypes = {
  title: PropTypes.string,
  location: PropTypes.string,
  events: PropTypes.arrayOf(
    PropTypes.shape({
      eventName: PropTypes.string.isRequired,
      eventDate: PropTypes.string.isRequired,
      eventAddress: PropTypes.string.isRequired,
      eventPrice: PropTypes.string.isRequired,
      eventPoster: PropTypes.string.isRequired,
      eventRanking: PropTypes.string.isRequired,
      eventLocation: PropTypes.string,
      rankScore: PropTypes.number,
    })
  ),
  containerId: PropTypes.string,
  onLocationChange: PropTypes.func,
  availableLocations: PropTypes.arrayOf(PropTypes.string),
};

export default EventsSection;