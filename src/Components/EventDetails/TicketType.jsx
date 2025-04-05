import React from 'react';

const TicketType = ({ ticket, onAddToCart, onQuantityChange, quantity = 0 }) => {
  return (
    <div 
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '15px 0',
        borderBottom: '1px solid var(--purple-100)'
      }}
    >
      {/* Ticket name and description */}
      <div style={{ flex: '2' }}>
        <div style={{ fontSize: '15px', fontWeight: '600', color: 'var(--neutral-800)' }}>
          {ticket.name}
        </div>
        <div style={{ fontSize: '13px', color: 'var(--neutral-600)', marginTop: '3px' }}>
          {ticket.description}
        </div>
      </div>
      
      {/* Price */}
      <div 
        style={{ 
          flex: '1', 
          textAlign: 'center',
          fontSize: '15px',
          fontWeight: '600',
          color: 'var(--neutral-800)'
        }}
      >
        {`${ticket.price} ${ticket.currency}`}
      </div>
      
      {/* Action */}
      <div style={{ flex: '1', display: 'flex', justifyContent: 'flex-end' }}>
        {quantity > 0 ? (
          <div 
            style={{ 
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            <button
              onClick={() => onQuantityChange(ticket.id, Math.max(0, quantity - 1))}
              style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                backgroundColor: 'var(--purple-100)',
                border: 'none',
                color: 'var(--primary)',
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                fontSize: '18px',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--purple-200)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--purple-100)';
              }}
            >
              -
            </button>
            <span style={{ fontWeight: '600', color: 'var(--primary)' }}>{quantity}</span>
            <button
              onClick={() => onQuantityChange(ticket.id, quantity + 1)}
              style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                backgroundColor: 'var(--purple-100)',
                border: 'none',
                color: 'var(--primary)',
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                fontSize: '18px',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--purple-200)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--purple-100)';
              }}
            >
              +
            </button>
          </div>
        ) : (
          <button
            onClick={() => onAddToCart(ticket)}
            style={{
              backgroundColor: 'white',
              color: 'var(--primary)',
              border: '1px solid var(--purple-200)',
              borderRadius: '20px',
              padding: '5px 15px',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--purple-50)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'white';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            Add to Basket
          </button>
        )}
      </div>
    </div>
  );
};

export default TicketType;