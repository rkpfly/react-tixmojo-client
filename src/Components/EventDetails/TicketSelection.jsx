import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TicketTable from './TicketTable';
import TicketCart from './TicketCart';
import CountdownTimer from './CountdownTimer';
import { useAuth } from '../../context/AuthContext';
import '../../Style/ticketSelection.css';
import { IoCartOutline, IoClose } from 'react-icons/io5';

const TicketSelection = ({ event, expiryTime, onExpire, showTimer, onProceedToPayment, savedCartItems, savedDiscount = 0 }) => {
  const navigate = useNavigate();
  const { isAuthenticated, currentUser } = useAuth();

  // Timer state
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [isAlmostExpired, setIsAlmostExpired] = useState(false);

  // Mobile cart visibility state
  const [showMobileCart, setShowMobileCart] = useState(false);

  // Update timer every second
  useEffect(() => {
    if (!showTimer || !expiryTime) return;

    const updateTimer = () => {
      try {
        // Ensure expiryTime is a Date object
        const expiry = expiryTime instanceof Date ? expiryTime : new Date(expiryTime);
        const now = new Date();
        const difference = expiry.getTime() - now.getTime();

        if (difference <= 0) {
          setMinutes(0);
          setSeconds(0);

          // Ensure the expiry handler is called properly
          if (typeof onExpire === 'function') {
            console.log("TicketSelection timer expired - calling parent handler");
            onExpire();
          }
          return;
        }

        // Calculate minutes and seconds
        const mins = Math.floor((difference / 1000 / 60) % 60);
        const secs = Math.floor((difference / 1000) % 60);

        setMinutes(mins);
        setSeconds(secs);
        setIsAlmostExpired(difference < 120000); // Less than 2 minutes
      } catch (error) {
        console.error("Error in countdown timer:", error);
        return;
      }
    };

    // Initial update
    updateTimer();

    // Update every second
    const interval = setInterval(updateTimer, 1000);

    // Clean up
    return () => clearInterval(interval);
  }, [expiryTime, onExpire, showTimer]);

  // Log when cart items are restored from saved state
  useEffect(() => {
    if (savedCartItems && savedCartItems.length > 0) {
      console.log("Restored", savedCartItems.length, "tickets from saved state");
    }
  }, [savedCartItems]);

  // Sample ticket data - in a real app, this would come from the API
  const [tickets, setTickets] = useState([
    {
      id: 1,
      name: 'Early Bird Ticket',
      description: 'Includes entry for 1 person',
      price: '29.00',
      currency: 'AUD',
      available: 10
    },
    {
      id: 2,
      name: 'General Admission',
      description: 'Standard entry ticket',
      price: '39.00',
      currency: 'AUD',
      available: 50
    },
    {
      id: 3,
      name: 'VIP Package',
      description: 'Premium entry with exclusive perks',
      price: '79.00',
      currency: 'AUD',
      available: 5
    },
    {
      id: 4,
      name: 'Group Ticket (4 people)',
      description: 'Discounted entry for 4 people',
      price: '99.00',
      currency: 'AUD',
      available: 8
    },
    {
      id: 5,
      name: 'Backstage Pass',
      description: 'General admission + backstage access',
      price: '149.00',
      currency: 'AUD',
      available: 3
    }
  ]);

  // Cart state - initialize from savedCartItems prop if provided
  const [cartItems, setCartItems] = useState([]);
  const [ticketQuantities, setTicketQuantities] = useState({});

  // Initialize from saved cart items if provided (when returning from payment portal)
  useEffect(() => {
    if (savedCartItems && savedCartItems.length > 0) {
      setCartItems(savedCartItems);

      // Rebuild ticket quantities from saved cart items
      const quantities = {};
      savedCartItems.forEach(item => {
        quantities[item.ticket.id] = item.quantity;
      });
      setTicketQuantities(quantities);
    }
  }, [savedCartItems]);

  // Add ticket to cart
  const handleAddToCart = (ticket) => {
    // Update quantities
    setTicketQuantities((prev) => ({
      ...prev,
      [ticket.id]: 1
    }));

    // Update cart
    setCartItems((prev) => [
      ...prev,
      { ticket, quantity: 1 }
    ]);
  };

  // Update ticket quantity
  const handleQuantityChange = (ticketId, newQuantity) => {
    // If quantity is 0, remove from cart
    if (newQuantity === 0) {
      handleRemoveFromCart(ticketId);
      return;
    }

    // Update quantities
    setTicketQuantities((prev) => ({
      ...prev,
      [ticketId]: newQuantity
    }));

    // Update cart items
    setCartItems((prev) =>
      prev.map(item =>
        item.ticket.id === ticketId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  // Remove ticket from cart
  const handleRemoveFromCart = (ticketId) => {
    // Update quantities
    setTicketQuantities((prev) => {
      const { [ticketId]: _, ...rest } = prev;
      return rest;
    });

    // Update cart
    setCartItems((prev) => prev.filter(item => item.ticket.id !== ticketId));
  };

  // Handle checkout
  const handleProceedToCheckout = (total, discount) => {
    console.log(`Proceeding to checkout: $${total.toFixed(2)} with ${discount * 100}% discount`);

    // Hide mobile cart if it's open
    setShowMobileCart(false);

    // Pass cart items, total, and discount to parent component
    if (typeof onProceedToPayment === 'function') {
      onProceedToPayment(cartItems, total, discount);
    } else {
      alert('This would navigate to the checkout page in a real application.');
    }
  };

  // Calculate total number of items in cart
  const totalCartItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="ticket-selection-container">
      {/* Header with title */}
      <div className="ticket-selection-header">
        <div className="ticket-selection-title-container">
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="ticket-selection-icon"
          >
            <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
          </svg>
          <h2 className="ticket-selection-title">
            Select Your Tickets
          </h2>
        </div>
      </div>

      <p className="ticket-selection-description">
        Choose the tickets you want to purchase for {event.title}
      </p>

      {/* Show welcome message if user is logged in */}
      {isAuthenticated() && currentUser && (
        <div className="welcome-message">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
          <span>Welcome back, {currentUser.firstName || currentUser.email}! Your details will be pre-filled during checkout.</span>
        </div>
      )}

      {/* Mobile timer that's always visible on mobile */}
      {window.innerWidth < 768 && showTimer && (
        <div className="mobile-timer-banner">
          <div className="timer-label">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--purple-800)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 2h4a2 2 0 0 1 2 2v2H8V4a2 2 0 0 1 2-2z"></path>
              <path d="M8 4L6 7.5 8 10 6 13.5 8 16l-2 3.5 2 2.5"></path>
              <path d="M16 4l2 3.5-2 2.5 2 3.5-2 2.5 2 3.5-2 2.5"></path>
              <rect x="4" y="18" width="16" height="4" rx="2"></rect>
            </svg>
            <span className="timer-label-text">
              Session Expires In
            </span>
          </div>

          <div className="timer-display" style={{ animation: isAlmostExpired ? 'pulse 1.5s infinite' : 'none' }}>
            <span className="timer-digit">
              {String(minutes).padStart(2, '0')}
            </span>
            <span className="timer-colon">:</span>
            <span className="timer-digit">
              {String(seconds).padStart(2, '0')}
            </span>
          </div>
        </div>
      )}

      <div className="ticket-selection-layout">
        {/* Left side - Ticket table */}
        <div className="ticket-table-container">
          <TicketTable
            tickets={tickets}
            onAddToCart={handleAddToCart}
            onQuantityChange={handleQuantityChange}
            ticketQuantities={ticketQuantities}
          />
        </div>

        {/* Right side - Ticket cart with positioned timer */}
        <div className="ticket-cart-container">
          {/* Timer positioned over the cart */}
          {showTimer && (
            <div className="timer-banner">
              <div className="timer-label">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--purple-800)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10 2h4a2 2 0 0 1 2 2v2H8V4a2 2 0 0 1 2-2z"></path>
                  <path d="M8 4L6 7.5 8 10 6 13.5 8 16l-2 3.5 2 2.5"></path>
                  <path d="M16 4l2 3.5-2 2.5 2 3.5-2 2.5 2 3.5-2 2.5"></path>
                  <rect x="4" y="18" width="16" height="4" rx="2"></rect>
                </svg>
                <span className="timer-label-text">
                  Session Expires In
                </span>
              </div>

              <div className="timer-display" style={{ animation: isAlmostExpired ? 'pulse 1.5s infinite' : 'none' }}>
                <span className="timer-digit">
                  {String(minutes).padStart(2, '0')}
                </span>
                <span className="timer-colon">:</span>
                <span className="timer-digit">
                  {String(seconds).padStart(2, '0')}
                </span>
              </div>
            </div>
          )}

          <TicketCart
            cartItems={cartItems}
            onRemoveItem={handleRemoveFromCart}
            onProceedToCheckout={handleProceedToCheckout}
            initialDiscount={savedDiscount}
          />
        </div>
      </div>

      {/* Mobile cart toggle button */}
      {cartItems.length > 0 && (
        <button
          className="cart-toggle-button"
          onClick={(e) => {
            e.stopPropagation(); // Prevent event from propagating
            setShowMobileCart(true);
          }}
        >
          <IoCartOutline size={24} />
          {totalCartItems > 0 && (
            <span className="cart-item-count">{totalCartItems}</span>
          )}
        </button>
      )}

      {/* Mobile cart overlay */}
      {showMobileCart && (
        <>
          <div 
            className="mobile-cart-overlay visible" 
            onClick={() => setShowMobileCart(false)}
          >
            <div 
              className="mobile-cart-popup"
              onClick={(e) => e.stopPropagation()} // Prevent clicking on the popup from closing it
            >
              <div className="cart-header">
                <h3 className="cart-title">Your Cart</h3>
                <button
                  className="cart-overlay-close-button"
                  onClick={() => setShowMobileCart(false)}
                >
                  <IoClose size={24} />
                </button>
              </div>

              <TicketCart
                cartItems={cartItems}
                onRemoveItem={handleRemoveFromCart}
                onProceedToCheckout={handleProceedToCheckout}
                initialDiscount={savedDiscount}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default TicketSelection;