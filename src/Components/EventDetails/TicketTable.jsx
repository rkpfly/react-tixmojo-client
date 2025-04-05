import React from 'react';
import TicketType from './TicketType';

const TicketTable = ({ tickets, onAddToCart, onQuantityChange, ticketQuantities }) => {
  return (
    <div
      style={{
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 5px 20px rgba(0, 0, 0, 0.05)',
        background: 'white',
        border: '1px solid var(--purple-100)',
        width: '60%',
      }}
    >
      {/* Table header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          padding: '15px 20px',
          borderBottom: '2px solid var(--purple-100)',
          backgroundColor: 'var(--purple-50)',
        }}
      >
        <div style={{ flex: '2', fontWeight: '700', color: '#ff5757', fontSize: '14px' }}>
          TYPE
        </div>
        <div style={{ flex: '1', textAlign: 'center', fontWeight: '700', color: '#ff5757', fontSize: '14px' }}>
          PRICE
        </div>
        <div style={{ flex: '1', textAlign: 'right', fontWeight: '700', color: '#ff5757', fontSize: '14px' }}>
          ACTION
        </div>
      </div>

      {/* Ticket list */}
      <div
        style={{
          maxHeight: '400px',
          overflowY: 'auto',
          padding: '0 20px',
        }}
      >
        {tickets.map((ticket) => (
          <TicketType
            key={ticket.id}
            ticket={ticket}
            onAddToCart={onAddToCart}
            onQuantityChange={onQuantityChange}
            quantity={ticketQuantities[ticket.id] || 0}
          />
        ))}
      </div>
    </div>
  );
};

export default TicketTable;