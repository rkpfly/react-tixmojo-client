import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TicketTable from './TicketTable';
import TicketCart from './TicketCart';
import CountdownTimer from './CountdownTimer';
import { useAuth } from '../../context/AuthContext';

const TicketSelection = ({ event, expiryTime, onExpire, showTimer, onProceedToPayment, savedCartItems, savedDiscount = 0 }) => {
  const navigate = useNavigate();
  const { isAuthenticated, currentUser } = useAuth();
  // Timer state
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [isAlmostExpired, setIsAlmostExpired] = useState(false);
  
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
    
    // Pass cart items, total, and discount to parent component
    if (typeof onProceedToPayment === 'function') {
      onProceedToPayment(cartItems, total, discount);
    } else {
      alert('This would navigate to the checkout page in a real application.');
    }
  };

  return (
    <div
      style={{
        borderRadius: '24px',
        padding: '30px',
        backgroundColor: 'var(--purple-50)',
        marginTop: '50px',
        marginBottom: '50px',
        boxShadow: '0 10px 30px rgba(111, 68, 255, 0.1)',
        border: '1px solid var(--purple-100)',
        position: 'relative',
      }}
    >
      {/* Header with title only */}
      <div style={{ 
        display: 'flex',
        alignItems: 'center',
        marginBottom: '15px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ color: 'var(--primary)' }}
          >
            <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
          </svg>
          <h2
            style={{
              fontSize: '28px',
              fontWeight: '800',
              color: 'var(--neutral-800)',
              fontFamily: 'var(--font-heading)',
              letterSpacing: '-0.01em',
              margin: 0
            }}
          >
            Select Your Tickets
          </h2>
        </div>
      </div>
      
      <p
        style={{
          color: 'var(--neutral-600)',
          marginBottom: '15px',
          fontSize: '15px',
          maxWidth: '80%',
        }}
      >
        Choose the tickets you want to purchase for {event.title}
      </p>
      
      {/* No login prompt here anymore - moved to PaymentPortal */}
      
      {/* Show welcome message if user is logged in */}
      {isAuthenticated() && currentUser && (
        <div style={{
          marginBottom: '25px',
          padding: '10px 15px',
          backgroundColor: 'rgba(52, 168, 83, 0.05)',
          border: '1px solid #34A853',
          borderRadius: '10px',
          color: '#34A853',
          maxWidth: '80%',
          fontSize: '14px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
          <span>Welcome back, {currentUser.firstName || currentUser.email}! Your details will be pre-filled during checkout.</span>
        </div>
      )}

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: '30px',
          position: 'relative'
        }}
      >
        {/* Left side - Ticket table */}
        <TicketTable
          tickets={tickets}
          onAddToCart={handleAddToCart}
          onQuantityChange={handleQuantityChange}
          ticketQuantities={ticketQuantities}
        />

        {/* Right side - Ticket cart with positioned timer */}
        <div style={{ position: 'relative', width: '35%' }}>
          {/* Timer positioned over the cart */}
          {showTimer && (
            <div style={{
              position: 'relative',
              width: '100%',
              zIndex: 5,
              background: 'linear-gradient(135deg, var(--purple-100), var(--purple-200))',
              borderRadius: '10px 10px 0 0',
              padding: '10px 15px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: '0 -2px 10px rgba(0,0,0,0.05)'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--purple-800)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10 2h4a2 2 0 0 1 2 2v2H8V4a2 2 0 0 1 2-2z"></path>
                  <path d="M8 4L6 7.5 8 10 6 13.5 8 16l-2 3.5 2 2.5"></path>
                  <path d="M16 4l2 3.5-2 2.5 2 3.5-2 2.5 2 3.5-2 2.5"></path>
                  <rect x="4" y="18" width="16" height="4" rx="2"></rect>
                </svg>
                <span style={{
                  fontSize: '16px',
                  fontWeight: '700',
                  color: 'var(--purple-800)'
                }}>
                  Session Expires In
                </span>
              </div>
              
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                fontFamily: 'var(--font-heading)',
                animation: isAlmostExpired ? 'pulse 1.5s infinite' : 'none'
              }}>
                <span style={{
                  background: 'var(--purple-600)',
                  color: 'white',
                  borderRadius: '6px',
                  padding: '5px 8px',
                  fontSize: '18px',
                  fontWeight: '700',
                  minWidth: '36px',
                  textAlign: 'center',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}>
                  {String(minutes).padStart(2, '0')}
                </span>
                <span style={{ 
                  color: 'var(--purple-900)', 
                  fontWeight: '700',
                  fontSize: '18px'
                }}>:</span>
                <span style={{
                  background: 'var(--purple-600)',
                  color: 'white',
                  borderRadius: '6px',
                  padding: '5px 8px',
                  fontSize: '18px',
                  fontWeight: '700',
                  minWidth: '36px',
                  textAlign: 'center',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}>
                  {String(seconds).padStart(2, '0')}
                </span>
              </div>
              
              {/* Add animation keyframes */}
              <style>
                {`
                  @keyframes pulse {
                    0% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0.9; transform: scale(1.02); }
                    100% { opacity: 1; transform: scale(1); }
                  }
                `}
              </style>
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
    </div>
  );
};

export default TicketSelection;