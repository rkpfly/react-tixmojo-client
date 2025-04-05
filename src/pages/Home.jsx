import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
  useCallback,
} from "react";
import { useTranslation } from "react-i18next";
import EventsSection from "../Components/HomePage/EventsSection.jsx";
import FlyerCarousel from "../Components/HomePage/FlyerCarousel.jsx";
import NewRecommendSection from "../Components/HomePage/NewRecommendSection.jsx";
import { ScrollAnimation } from "../utils/ScrollAnimation.jsx";
import { PageSEO } from "../utils/SEO.jsx";
import { getAllAppData } from "../services/api.js";
import Loader from "../Components/Loader.jsx";

import "../i18n";

function Home() {
  const { t, i18n } = useTranslation();
  const [popularEventsLocation, setPopularEventsLocation] = useState("Sydney");
  const [allAppData, setAllAppData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Format date for display
  const formatDate = (date) => {
    const day = date.getDate();
    const monthNames = t("eventsSection.dateFormat.months", {
      returnObjects: true,
    });
    const month = monthNames[date.getMonth()];
    return `${day} ${month}`;
  };

  // Calculate dates for different event types
  const dates = useMemo(() => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 5); // 5 days from now

    const futureDate1 = new Date(today);
    futureDate1.setDate(futureDate1.getDate() + 14);

    const futureDate2 = new Date(today);
    futureDate2.setDate(futureDate2.getDate() + 30);

    return {
      today: formatDate(today),
      tomorrow: formatDate(tomorrow),
      thisWeek: formatDate(nextWeek),
      nextWeek: formatDate(futureDate1),
      nextMonth: formatDate(futureDate2),
    };
  }, [i18n.language]);

  // Format server events for display in EventsSection
  const formatServerEvents = (serverEvents) => {
    if (!Array.isArray(serverEvents) || serverEvents.length === 0) {
      console.warn("No events data received from server or invalid format");
      // Create some mock events as fallback
      return [
        {
          id: "mock-event-1",
          eventName: "SAMPLE EVENT 1",
          eventPoster:
            "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?q=80&w=2940&auto=format&fit=crop",
          eventAddress: "Sydney Opera House, Sydney",
          eventDate: "3 Apr",
          eventPrice: "299",
          eventRanking: "1",
          rankScore: 95,
          eventLocation: "Sydney",
        },
        {
          id: "mock-event-2",
          eventName: "SAMPLE EVENT 2",
          eventPoster:
            "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=80&w=2940&auto=format&fit=crop",
          eventAddress: "Olympic Park, Sydney",
          eventDate: "5 Apr",
          eventPrice: "199",
          eventRanking: "2",
          rankScore: 90,
          eventLocation: "Sydney",
        },
      ];
    }

    return serverEvents
      .map((event, index) => {
        if (!event) return null;

        try {

          // Handle different possible data structures safely
          const address =
            event.eventAddress ||
            (event.venueName && event.venueAddress
              ? `${event.venueName}, ${event.venueAddress}`
              : event.venueAddress || "Sydney, Australia");

          let displayDate = "Upcoming";
          try {
            // Try different date formats
            if (event.date && typeof event.date === "string") {
              const dateParts = event.date.split(",");
              if (dateParts.length >= 2) {
                displayDate = dateParts[1].trim();
              }
            } else if (event.eventDate) {
              displayDate = event.eventDate;
            }
          } catch (dateError) {
            console.warn("Error parsing date for event", event.id, dateError);
          }

          // Create display format expected by Cards component
          return {
            id: event.id || `event-${index}`,
            eventName: event.eventName || "Event " + (index + 1),
            eventPoster:
              event.eventPoster ||
              "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?q=80&w=2940&auto=format&fit=crop",
            eventAddress: address,
            eventDate: displayDate,
            eventPrice: event.eventPrice || "Free",
            eventRanking: event.eventRanking || String(index + 1),
            rankScore: event.rankScore || 100 - index,
            eventLocation: event.eventLocation || "Sydney",
            // Preserve the eventDateType field which is essential for filtering
            eventDateType: event.eventDateType,
            // Add any other fields needed by Cards component
            date: event.date,
            time: event.time,
            tags: event.tags || ["Event"],
            description:
              event.description || "Join us for this exciting event!",
          };
        } catch (error) {
          console.error("Error processing event:", error, event);
          return null;
        }
      })
      .filter((event) => event !== null); // Remove any null events
  };

  // Fetch all application data once
  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        // Get all data in a single API call
        const appData = await getAllAppData();

        // Store the complete data set
        setAllAppData(appData);
      } catch (error) {
        console.error("Error fetching application data:", error);
        // Could implement fallback or retry logic here
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []); // Only fetch once on component mount

  // Handle location change without fetching new data
  const handlePopularLocationChange = useCallback(
    (newLocation) => {
      if (newLocation === popularEventsLocation) return;
      setPopularEventsLocation(newLocation);
      // No need to fetch data - we already have everything
    },
    [popularEventsLocation]
  );

  // Format events for a specific location
  const getEventsForLocation = useCallback(
    (location) => {
      if (!allAppData || !allAppData.locationEvents) return [];

      // Get location events for the selected location
      const eventsForLocation = allAppData.locationEvents[location] || [];

      // Format and return
      return formatServerEvents(eventsForLocation);
    },
    [allAppData]
  );

  // Get current location events
  const currentLocationEvents = useMemo(() => {
    return getEventsForLocation(popularEventsLocation);
  }, [popularEventsLocation, getEventsForLocation]);

  // Get spotlight events (no location filtering)
  const currentSpotlightEvents = useMemo(() => {
    if (!allAppData || !allAppData.spotlightEvents) return [];

    // Format the dates properly for the spotlight events
    return formatServerEvents(allAppData.spotlightEvents);
  }, [allAppData]);

  // Get available locations
  const availableLocations = useMemo(() => {
    if (!allAppData || !allAppData.locations) {
      return ["Sydney", "Melbourne", "Brisbane", "Singapore"]; // Fallback
    }
    return allAppData.locations;
  }, [allAppData]);

  return (
    <>
      <PageSEO
        title="Find and Book Amazing Events"
        description="Discover top events, concerts, and shows in your area. TixMojo helps you find tickets for the best live entertainment experiences."
        path="/"
        keywords="events, tickets, concerts, shows, festivals, entertainment, live music"
      />

      {loading || !allAppData ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "70vh",
          }}
        >
          <Loader size="large" />
        </div>
      ) : (
        <>
          {/* Hero Section with Carousel */}
          <ScrollAnimation direction="down" distance={30} duration={1.2}>
            <FlyerCarousel flyers={allAppData.flyerData} />
          </ScrollAnimation>

          {/* Popular Events Section */}
          <ScrollAnimation
            direction="up"
            distance={40}
            duration={1}
            delay={0.2}
          >
            <EventsSection
              title="Events in"
              location={popularEventsLocation}
              events={currentLocationEvents}
              containerId="popularEventsContainer"
              onLocationChange={handlePopularLocationChange}
              availableLocations={availableLocations}
            />
          </ScrollAnimation>

          {/* New Recommendation Section without rankings - using spotlight events data */}
          <ScrollAnimation
            direction="up"
            distance={40}
            duration={1}
            delay={0.3}
          >
            <NewRecommendSection
              title={"Spotlight Events"}
              subtitle={
                "Curated selection of must-see events you don't want to miss"
              }
              events={currentSpotlightEvents}
              containerId="trendingRecommendations"
            />
          </ScrollAnimation>
        </>
      )}
    </>
  );
}

export default Home;
