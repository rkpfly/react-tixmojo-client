import React from 'react';

const CartItem = ({ ticket, quantity, onRemove }) => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '15px 0',
        borderBottom: '1px solid var(--purple-100)',
      }}
    >
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--neutral-800)' }}>
          {ticket.name}
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            marginTop: '4px',
          }}
        >
          <div style={{ fontSize: '14px', color: 'var(--neutral-600)' }}>
            {ticket.price} {ticket.currency}
          </div>
          <span style={{ color: 'var(--primary)', fontWeight: '600' }}>×{quantity}</span>
        </div>
      </div>

      <button
        onClick={() => onRemove(ticket.id)}
        style={{
          backgroundColor: 'transparent',
          border: 'none',
          color: 'var(--neutral-400)',
          fontSize: '18px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '30px',
          height: '30px',
          borderRadius: '50%',
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'var(--purple-100)';
          e.currentTarget.style.color = 'var(--primary)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent';
          e.currentTarget.style.color = 'var(--neutral-400)';
        }}
      >
        ×
      </button>
    </div>
  );
};

export default CartItem;