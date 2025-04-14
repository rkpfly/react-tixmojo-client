import React from 'react';
import TicketType from './TicketType';

const TicketTable = ({ tickets, onAddToCart, onQuantityChange, ticketQuantities }) => {
  return (
    <>
      {/* Table header */}
      <div className="ticket-table-header">
        <div className="ticket-type-header">
          TYPE
        </div>
        <div className="ticket-price-header">
          PRICE
        </div>
        <div className="ticket-action-header">
          ACTION
        </div>
      </div>

      {/* Ticket list */}
      <div className="ticket-table-body">
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
    </>
  );
};

export default TicketTable;