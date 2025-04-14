import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getEventById, getEventsByOrganizer } from "../services/api.js";
import { ScrollAnimation } from "../utils/ScrollAnimation.jsx";
import { useAuth } from "../context/AuthContext";
import { useAnimation } from "../context/AnimationContext";

// Import Modular Components
import EventDetailsHeader from "../Components/EventDetails/EventDetailsHeader.jsx";
import EventMainInfo from "../Components/EventDetails/EventMainInfo.jsx";
import EventTabs from "../Components/EventDetails/EventTabs.jsx";
import OrgContactPopup from "../Components/EventDetails/OrgContactPopup.jsx";
import LoadingIndicator from "../Components/EventDetails/LoadingIndicator.jsx";
import EventContainer from "../Components/EventDetails/EventContainer.jsx";
import EventSEOWrapper from "../Components/EventDetails/EventSEOWrapper.jsx";
import NewOrganizerInfo from "../Components/EventDetails/NewOrganizerInfo.jsx";
import TicketSelection from "../Components/EventDetails/TicketSelection.jsx";
import PaymentPortal from "../Components/EventDetails/PaymentPortal.jsx";
import CountdownTimer from "../Components/EventDetails/CountdownTimer.jsx";

function EventDetails(props) {
  const { t } = useTranslation();
  const { eventId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const { animationsEnabled, sidebarOpen } = useAnimation();  // Get animation context
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showContactPopup, setShowContactPopup] = useState(false);
  const [showTicketSelection, setShowTicketSelection] = useState(false);
  const [animationsInitialized, setAnimationsInitialized] = useState(false);
  const [showPaymentPortal, setShowPaymentPortal] = useState(false);
  const [showTimer, setShowTimer] = useState(false);
  const [expiryTime, setExpiryTime] = useState(null);
  const [showExpiryPopup, setShowExpiryPopup] = useState(false);
  const [isInTicketSection, setIsInTicketSection] = useState(false);
  const [organizerEvents, setOrganizerEvents] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [discount, setDiscount] = useState(0);
  
  // Check URL parameters for automatic ticket selection display
  const urlParams = new URLSearchParams(location.search);
  const shouldShowTickets = urlParams.get('showTickets') === 'true';

  // Force component re-render for timer updates
  const [, forceUpdate] = useState();

  // Reset session state on page load/refresh
  useEffect(() => {
    // Reset all session-related states when component mounts (page load/refresh)
    setShowTimer(false);
    setShowTicketSelection(false);
    setShowPaymentPortal(false);
    setShowExpiryPopup(false);
    setExpiryTime(null);
    setCartItems([]);
    setTotalAmount(0);
    setDiscount(0);

    // Listen for page visibility changes to reset session when returning to the page
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        setShowTimer(false);
        setShowTicketSelection(false);
        setShowPaymentPortal(false);
        setShowExpiryPopup(false);
        setExpiryTime(null);
        setCartItems([]);
        setTotalAmount(0);
        setDiscount(0);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    if (!showTimer) return;

    // Update every 500ms to ensure smooth timer display
    const timerUpdateInterval = setInterval(() => {
      forceUpdate({});
    }, 500);

    return () => clearInterval(timerUpdateInterval);
  }, [showTimer]);

  // Intersection Observer to detect if user is viewing the ticket selection section
  useEffect(() => {
    if (!showTicketSelection) return;

    const ticketSectionRef = document.getElementById('ticket-selection-section');
    if (!ticketSectionRef) return;

    const options = {
      root: null,
      rootMargin: '-100px 0px',
      threshold: 0.2
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        setIsInTicketSection(entry.isIntersecting);
      });
    }, options);

    observer.observe(ticketSectionRef);

    return () => {
      observer.disconnect();
    };
  }, [showTicketSelection]);

  useEffect(() => {
    // Validate the event ID format - only allow valid event names with "-" separators
    const isValidEventId = /^[a-z0-9-]+$/.test(eventId) && !eventId.match(/^event-\d+$/);
    if (!isValidEventId) {
      console.error("Invalid event ID format:", eventId);
      navigate("/page-not-found");
      return;
    }
    
    // Check if we have server-side data
    const hasServerData = props.serverData && 
      props.serverData.event && 
      props.serverData.eventId === eventId;
    
    if (hasServerData) {
      // Use server-side data for initial render
      console.log("Using server-side rendered data for Event Details page");
      
      // Set event data from server
      setEvent(props.serverData.event);
      setLoading(false);
      
      // If we have organizer events also from server, use them
      if (props.serverData.organizerEvents && props.serverData.organizerEvents.length > 0) {
        setOrganizerEvents(props.serverData.organizerEvents);
      } else {
        // Still fetch organizer events if not provided by server
        fetchOrganizerEvents(props.serverData.event.organizer?.id);
      }
      
      // Show tickets if URL parameter is set
      if (shouldShowTickets) {
        handleShowTicketSelection();
      }
      
      return; // Skip API fetch if we have server data
    }
    
    // Check for cached event data
    try {
      const cachedEventKey = `event_${eventId}`;
      const cachedEvent = localStorage.getItem(cachedEventKey);
      const cachedTimestamp = localStorage.getItem(`${cachedEventKey}_timestamp`);
      
      if (cachedEvent && cachedTimestamp) {
        const now = new Date().getTime();
        const then = parseInt(cachedTimestamp, 10);
        
        // Use cached data if less than 4 hours old
        if (now - then < 14400000) {
          const parsedEvent = JSON.parse(cachedEvent);
          setEvent(parsedEvent);
          setLoading(false);
          console.log("Using cached event data");
          
          // Still load organizer events
          if (parsedEvent.organizer?.id) {
            fetchOrganizerEvents(parsedEvent.organizer.id);
          }
          
          // Show tickets if needed
          if (shouldShowTickets && isAuthenticated()) {
            setTimeout(() => { handleGetTickets(); }, 300);
          }
          
          return; // Skip API fetch if we have valid cached data
        }
      }
    } catch (cacheError) {
      console.warn("Error using cached event data:", cacheError);
    }
    
    // Fetch event details from API
    const fetchEvent = async () => {
      setLoading(true);
      setError(null);
      try {
        const eventData = await getEventById(eventId);

        // Format the event data from the API
        const formattedEvent = {
          id: eventData.id,
          title: eventData.eventName,
          tags: Array.isArray(eventData.tags) ? eventData.tags : [eventData.tags],
          image: eventData.eventPoster,
          date: eventData.date,
          time: eventData.time,
          venueName: eventData.venueName,
          venueAddress: eventData.venueAddress,
          locationMap: eventData.locationMap ||
            `https://maps.google.com/?q=${encodeURIComponent(eventData.venueAddress)}`,
          price: {
            currency: eventData.currency || "AUD",
            value: eventData.eventPrice,
          },
          description: eventData.description,
          organizer: {
            id: eventData.organizerId || '',
            name: eventData.organizer?.name || '',
            description: eventData.organizer?.description || '',
            location: eventData.organizer?.location || '',
            contactEmail: eventData.organizer?.contactEmail || '',
            phone: eventData.organizer?.phone || '',
            website: eventData.organizer?.website || '',
            specialization: eventData.organizer?.specialization || [],
            yearEstablished: eventData.organizer?.yearEstablished || '',
            stats: eventData.organizer?.stats || {
              totalEvents: 0,
              rating: 0,
              ticketsSold: "0"
            }
          },
          sponsors: eventData.sponsors || [],
          faq: eventData.faq || [],
        };
        
        setEvent(formattedEvent);
        
        // Cache the event data for future use
        try {
          const cachedEventKey = `event_${eventId}`;
          localStorage.setItem(cachedEventKey, JSON.stringify(formattedEvent));
          localStorage.setItem(`${cachedEventKey}_timestamp`, new Date().getTime().toString());
        } catch (cacheError) {
          console.warn("Could not cache event data:", cacheError);
        }
        
        // Now fetch all events from the same organizer
        if (eventData.organizerId) {
          try {
            // Check if we have cached organizer events first
            let useOrgCache = false;
            try {
              const cachedOrgKey = `organizer_events_${eventData.organizerId}`;
              const cachedOrgEvents = localStorage.getItem(cachedOrgKey);
              const cachedOrgTimestamp = localStorage.getItem(`${cachedOrgKey}_timestamp`);
              
              if (cachedOrgEvents && cachedOrgTimestamp) {
                const now = new Date().getTime();
                const then = parseInt(cachedOrgTimestamp, 10);
                
                // Use cached data if less than 4 hours old
                if (now - then < 14400000) {
                  setOrganizerEvents(JSON.parse(cachedOrgEvents));
                  useOrgCache = true;
                  console.log("Using cached organizer events");
                }
              }
            } catch (orgCacheError) {
              console.warn("Error using cached organizer events:", orgCacheError);
            }
            
            if (!useOrgCache) {
              const orgEvents = await getEventsByOrganizer(eventData.organizerId);
              // Filter out the current event and limit to 3
              const sameOrganizerEvents = orgEvents
                .filter(e => e.id !== eventData.id)
                .slice(0, 3);
  
              setOrganizerEvents(sameOrganizerEvents);
              
              // Cache the organizer events
              try {
                const cachedOrgKey = `organizer_events_${eventData.organizerId}`;
                localStorage.setItem(cachedOrgKey, JSON.stringify(sameOrganizerEvents));
                localStorage.setItem(`${cachedOrgKey}_timestamp`, new Date().getTime().toString());
              } catch (orgCacheError) {
                console.warn("Could not cache organizer events:", orgCacheError);
              }
            }
          } catch (error) {
            console.error("Error fetching organizer events:", error);
            setOrganizerEvents([]);
          }
        }

        setLoading(false);
        
        // After loading is complete, check if we should automatically show tickets
        // Only show if the user is authenticated and the URL parameter is present
        if (shouldShowTickets && isAuthenticated()) {
          console.log("Automatically showing ticket selection from URL parameter");
          
          // Short delay to ensure event data is properly rendered
          setTimeout(() => {
            handleGetTickets();
          }, 300);
          
          // Clean up the URL parameter to prevent showing tickets again on refresh
          const newUrl = new URL(window.location.href);
          newUrl.searchParams.delete('showTickets');
          window.history.replaceState({}, document.title, newUrl.toString());
        }
      } catch (error) {
        console.error("Error fetching event:", error);
        setLoading(false);
        setError(`We couldn't find the event you're looking for. The event may no longer exist or there might be a temporary issue with our server.`);
      }
    };

    if (eventId) {
      fetchEvent();
    }
  }, [eventId, navigate, shouldShowTickets, isAuthenticated, props.serverData]);

  const handleGetTickets = () => {
    console.log("Getting tickets for:", event?.title);
    
    // Login is now optional - let the user proceed directly to ticket selection
    // regardless of authentication status
    
    // Show the ticket selection section
    setShowTicketSelection(true);

    // Initialize the timer (10 minutes from now)
    setExpiryTime(new Date(Date.now() + 600000));
    setShowTimer(true);

    // Scroll to ticket selection section after it's rendered
    setTimeout(() => {
      const ticketSection = document.getElementById('ticket-selection-section');
      if (ticketSection) {
        const yOffset = -20; // Small offset to show a bit of content above the section
        const y = ticketSection.getBoundingClientRect().top + window.pageYOffset + yOffset;

        window.scrollTo({
          top: y,
          behavior: 'smooth'
        });
      }
    }, 150); // Slightly longer timeout to ensure component is rendered
  };

  // Handle timer expiry
  const handleTimerExpire = () => {
    console.log("Timer expired - showing custom popup");

    // Reset ticket selection and payment state
    setShowTimer(false);
    setShowTicketSelection(false);
    setShowPaymentPortal(false);
    setCartItems([]);
    setTotalAmount(0);
    setDiscount(0);

    // Show custom expiry popup
    setShowExpiryPopup(true);
  };

  // Handle returning to the event after session expiry
  const handleReturnToEvent = () => {
    console.log("Returning to event - reloading page");

    // First reset all states
    setShowExpiryPopup(false);
    setShowTimer(false);
    setShowTicketSelection(false);
    setShowPaymentPortal(false);
    setExpiryTime(null);
    setCartItems([]);
    setTotalAmount(0);
    setDiscount(0);

    // Scroll to top
    window.scrollTo(0, 0);

    // Force a page reload after a short delay
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };
  
  // Handle proceeding to payment
  const handleProceedToPayment = (items, amount, discountAmount) => {
    console.log("Proceeding to payment with", items.length, "items");
    
    // Save cart data
    setCartItems(items);
    setTotalAmount(amount);
    setDiscount(discountAmount);
    
    // Hide ticket selection and show payment portal
    setShowTicketSelection(false);
    setShowPaymentPortal(true);
    
    // Scroll to payment section after it's rendered
    setTimeout(() => {
      const paymentSection = document.getElementById('payment-portal-section');
      if (paymentSection) {
        const yOffset = -20; // Small offset
        const y = paymentSection.getBoundingClientRect().top + window.pageYOffset + yOffset;
        
        window.scrollTo({
          top: y,
          behavior: 'smooth'
        });
      }
    }, 150);
  };
  
  // Handle back from payment to ticket selection
  const handleBackToTicketSelection = () => {
    // Hide payment portal and show ticket selection
    // Note: We don't reset cartItems, totalAmount, or discount
    // This ensures selected tickets remain intact
    setShowPaymentPortal(false);
    setShowTicketSelection(true);
    
    // Pass the saved cart data back to TicketSelection via a ref or state
    // The cartItems, totalAmount, and discount states are already maintained
    
    // Scroll to ticket selection after it's rendered
    setTimeout(() => {
      const ticketSection = document.getElementById('ticket-selection-section');
      if (ticketSection) {
        const yOffset = -20; // Small offset
        const y = ticketSection.getBoundingClientRect().top + window.pageYOffset + yOffset;
        
        window.scrollTo({
          top: y,
          behavior: 'smooth'
        });
      }
    }, 150);
  };
  
  // Handle cancel booking (cancels everything, reloads page)
  const handleCancelBooking = () => {
    // Reset all states and reload page
    window.location.reload();
  };

  if (loading) {
    return <LoadingIndicator />;
  }

  if (!event) {
    return null;
  }

  // Error State
  if (error) {
    return (
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        padding: "20px",
        paddingTop: "90px",
        textAlign: "center",
      }}>
        <div style={{
          fontSize: "1.2rem",
          color: "#e53935",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          maxWidth: "600px",
          padding: "2rem",
          borderRadius: "8px",
          background: "#ffebee",
          border: "1px solid #ffcdd2"
        }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="#e53935">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 style={{ marginTop: "1rem", color: "#d32f2f" }}>Event Not Found</h2>
          <p style={{ marginTop: "0.5rem" }}>{error}</p>
          <div style={{ display: "flex", gap: "16px", marginTop: "1.5rem" }}>
            <button 
              onClick={() => navigate("/")}
              style={{
                background: "white",
                color: "var(--primary)",
                border: "1px solid var(--primary)",
                borderRadius: "6px",
                padding: "10px 20px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.3s ease"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--purple-50)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "white";
              }}
            >
              Go Home
            </button>
            <button 
              onClick={() => window.location.reload()}
              style={{
                background: "var(--primary)",
                color: "white",
                border: "none",
                borderRadius: "6px",
                padding: "10px 20px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.3s ease"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 4px 8px rgba(111, 68, 255, 0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Event is ready to render
  return (
    <>
      <EventSEOWrapper event={event} eventId={eventId} />
      {/* Fixed Timer - Only shown when not in ticket section */}
      {showTimer && !isInTicketSection && (
        <div
          className="fixed-timer"
          style={{
            position: 'fixed',
            top: '90px',
            right: '20px',
            zIndex: 1000,
            width: '280px',
            transform: 'scale(0.85) translateX(0)',
            transformOrigin: 'top right',
            transition: 'all 0.3s ease',
            filter: 'drop-shadow(0 4px 20px rgba(0,0,0,0.15))',
            opacity: 1,
            animation: 'slideInFixed 0.3s ease-out'
          }}
        >
          <CountdownTimer expiryTime={expiryTime} onExpire={handleTimerExpire} />

          {/* Responsive styles */}
          <style>
            {`
              @keyframes slideInFixed {
                from {
                  opacity: 0;
                  transform: scale(0.85) translateX(50px);
                }
                to {
                  opacity: 1;
                  transform: scale(0.85) translateX(0);
                }
              }
              
              @media (max-width: 768px) {
                .fixed-timer {
                  top: 70px;
                  right: 10px;
                  width: 240px;
                  transform: scale(0.75);
                }
              }
              
              @media (max-width: 480px) {
                .fixed-timer {
                  top: auto;
                  bottom: 10px;
                  right: 10px;
                  width: 220px;
                  transform: scale(0.7);
                }
              }
            `}
          </style>
        </div>
      )}

      <EventContainer>
        <EventDetailsHeader event={event} />
        <EventMainInfo 
          event={event} 
          handleGetTickets={handleGetTickets} 
          hideTicketButton={showTicketSelection || showPaymentPortal} 
        />

        {/* Ticket Selection Component - Only shown when Get Tickets is clicked */}
        {showTicketSelection && (
          <ScrollAnimation
            direction="up"
            distance={20}
            duration={0.8}
            delay={0.5}
          >
            <div
              id="ticket-selection-section"
              style={{
                position: 'relative',
                marginTop: '40px',
                marginBottom: '50px'
              }}
            >
              <button
                onClick={() => setShowTicketSelection(false)}
                style={{
                  position: 'absolute',
                  top: '15px',
                  right: '15px',
                  background: 'var(--purple-50)',
                  border: '1px solid var(--purple-100)',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(111, 68, 255, 0.08)',
                  zIndex: 20,
                  color: 'var(--purple-600)',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                  e.currentTarget.style.background = 'var(--purple-100)';
                  e.currentTarget.style.color = 'var(--purple-800)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.background = 'var(--purple-50)';
                  e.currentTarget.style.color = 'var(--purple-600)';
                }}
              >
                ✕
              </button>
              <TicketSelection
                event={event}
                expiryTime={expiryTime}
                onExpire={handleTimerExpire}
                showTimer={showTimer && isInTicketSection}
                onProceedToPayment={handleProceedToPayment}
                savedCartItems={cartItems}
                savedDiscount={discount}
              />
            </div>
          </ScrollAnimation>
        )}
        
        {/* Payment Portal - Only shown after ticket selection is complete */}
        {showPaymentPortal && (
          <ScrollAnimation
            direction="up"
            distance={20}
            duration={0.8}
            delay={0.5}
          >
            <div
              id="payment-portal-section"
              style={{
                position: 'relative',
                marginTop: '40px',
                marginBottom: '50px'
              }}
            >
              <PaymentPortal
                event={event}
                expiryTime={expiryTime}
                onExpire={handleTimerExpire}
                cartItems={cartItems}
                totalAmount={totalAmount}
                discount={discount}
                onBack={handleBackToTicketSelection}
                onCancel={handleCancelBooking}
              />
            </div>
          </ScrollAnimation>
        )}

        {/* Visual separator after ticket/payment sections */}
        {(showTicketSelection || showPaymentPortal) && (
          <div style={{
            height: '1px',
            background: 'linear-gradient(to right, rgba(111, 68, 255, 0.05), rgba(111, 68, 255, 0.2), rgba(111, 68, 255, 0.05))',
            margin: '20px 0 40px 0',
            width: '100%'
          }} />
        )}

        <EventTabs
          event={event}
          setShowContactPopup={setShowContactPopup}
          organizerEvents={organizerEvents}
          handleGetTickets={handleGetTickets}
          navigate={navigate}
        />

        {/* Organizer info - New Modern Design */}
        <NewOrganizerInfo
          event={event}
          organizerEvents={organizerEvents}
          setShowContactPopup={setShowContactPopup}
          navigate={navigate}
        />

        {/* Contact Popup */}
        {showContactPopup && (
          <OrgContactPopup event={event} setShowContactPopup={setShowContactPopup} />
        )}

        {/* Session Expiry Popup */}
        {showExpiryPopup && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 10000,
              backdropFilter: 'blur(5px)'
            }}
            onClick={handleReturnToEvent}
          >
            <div
              style={{
                width: '90%',
                maxWidth: '450px',
                backgroundColor: 'white',
                borderRadius: '20px',
                padding: '30px',
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                position: 'relative',
                animation: 'fadeInPopup 0.3s ease-out'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Clock icon */}
              <div style={{
                width: '70px',
                height: '70px',
                backgroundColor: 'var(--purple-100)',
                borderRadius: '50%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: '20px'
              }}>
                <svg width="35" height="35" viewBox="0 0 24 24" fill="none" stroke="var(--purple-600)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
              </div>

              <h2 style={{
                fontSize: '24px',
                fontWeight: '800',
                color: 'var(--neutral-900)',
                marginBottom: '10px',
                fontFamily: 'var(--font-heading)'
              }}>Session Expired</h2>

              <p style={{
                fontSize: '16px',
                color: 'var(--neutral-600)',
                marginBottom: '25px',
                lineHeight: 1.5
              }}>
                Your ticket selection session has timed out. To purchase tickets, please start a new ticket selection.
              </p>

              <button
                onClick={handleReturnToEvent}
                style={{
                  backgroundColor: 'var(--purple-600)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '12px 25px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 4px 10px rgba(111, 68, 255, 0.2)',
                  fontFamily: 'var(--font-heading)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--purple-700)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--purple-600)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                Return to Event
              </button>

              {/* Animation keyframes */}
              <style>
                {`
                  @keyframes fadeInPopup {
                    from {
                      opacity: 0;
                      transform: translateY(20px) scale(0.95);
                    }
                    to {
                      opacity: 1;
                      transform: translateY(0) scale(1);
                    }
                  }
                `}
              </style>
            </div>
          </div>
        )}
      </EventContainer>
    </>
  );
}

// Use a standard export statement
export default EventDetails;