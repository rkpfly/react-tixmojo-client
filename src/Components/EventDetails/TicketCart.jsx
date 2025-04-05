import React, { useState, useEffect } from 'react';
import CartItem from './CartItem';
import PromoCode from './PromoCode';

const TicketCart = ({ cartItems, onRemoveItem, onProceedToCheckout }) => {
  const [discount, setDiscount] = useState(0);
  const [total, setTotal] = useState(0);
  const [totalTickets, setTotalTickets] = useState(0);

  // Calculate total whenever cart items or discount change
  useEffect(() => {
    let ticketCount = 0;
    let subtotal = 0;

    cartItems.forEach(item => {
      ticketCount += item.quantity;
      subtotal += parseFloat(item.ticket.price) * item.quantity;
    });

    setTotalTickets(ticketCount);

    // Apply discount if there is one
    const discountAmount = subtotal * discount;
    const finalTotal = subtotal - discountAmount;

    setTotal(finalTotal);
  }, [cartItems, discount]);

  const handleApplyPromo = (discountPercentage) => {
    setDiscount(discountPercentage);
  };

  return (
    <div
      style={{
        borderRadius: '0 0 16px 16px',
        overflow: 'hidden',
        boxShadow: '0 5px 20px rgba(0, 0, 0, 0.05)',
        background: 'white',
        border: '1px solid var(--purple-100)',
        padding: '20px',
      }}
    >
      {cartItems.length > 0 ? (
        <>
          <div
            style={{
              maxHeight: '240px',
              overflowY: 'auto',
              marginBottom: '20px',
            }}
          >
            {cartItems.map((item) => (
              <CartItem
                key={item.ticket.id}
                ticket={item.ticket}
                quantity={item.quantity}
                onRemove={onRemoveItem}
              />
            ))}
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '10px',
              fontSize: '14px',
              color: 'var(--neutral-600)',
            }}
          >
            <span>Tickets Selected</span>
            <span>{totalTickets}</span>
          </div>

          {discount > 0 && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '10px',
                fontSize: '14px',
                color: 'var(--neutral-600)',
              }}
            >
              <span>Discount</span>
              <span>-{(discount * 100).toFixed(0)}%</span>
            </div>
          )}

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '20px',
              paddingTop: '10px',
              borderTop: '1px solid var(--purple-100)',
            }}
          >
            <span style={{ fontWeight: '700', fontSize: '16px', color: 'var(--neutral-800)' }}>
              Total
            </span>
            <span style={{ fontWeight: '700', fontSize: '16px', color: 'var(--neutral-800)' }}>
              ${total.toFixed(2)}
            </span>
          </div>

          <PromoCode onApplyPromo={handleApplyPromo} />

          <button
            onClick={() => onProceedToCheckout(total, discount)}
            style={{
              width: '100%',
              padding: '14px',
              backgroundColor: '#ff5757',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              marginTop: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#e04949';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#ff5757';
              e.currentTarget.style.transform = 'translateY(0)';
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
            >
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            Go to Cart
          </button>
        </>
      ) : (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '30px 0',
            color: 'var(--neutral-500)',
          }}
        >
          <svg
            width="50"
            height="50"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ color: 'var(--neutral-300)', marginBottom: '15px' }}
          >
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
          <div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '5px' }}>
            Your cart is empty
          </div>
          <div style={{ fontSize: '14px', textAlign: 'center', maxWidth: '200px' }}>
            Select tickets from the left panel to add them to your cart
          </div>
        </div>
      )}
    </div>
  );
};

export default TicketCart;