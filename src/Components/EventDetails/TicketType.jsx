import React from 'react';

const TicketType = ({ ticket, onAddToCart, onQuantityChange, quantity = 0 }) => {
  return (
    <div className="ticket-type-row">
      {/* Ticket name and description */}
      <div className="ticket-info">
        <div className="ticket-name">
          {ticket.name}
        </div>
        <div className="ticket-description">
          {ticket.description}
        </div>
      </div>

      {/* Price */}
      <div className="ticket-price">
        {`${ticket.price} ${ticket.currency}`}
      </div>

      {/* Action */}
      <div className="ticket-action">
        {quantity > 0 ? (
          <div className="quantity-control">
            <button
              onClick={() => onQuantityChange(ticket.id, Math.max(0, quantity - 1))}
              className="quantity-button"
              aria-label="Decrease quantity"
            >
              -
            </button>
            <span className="quantity-value">{quantity}</span>
            <button
              onClick={() => onQuantityChange(ticket.id, quantity + 1)}
              className="quantity-button"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
        ) : (
          <button
            onClick={() => onAddToCart(ticket)}
            className="add-to-cart-button"
          >
            Add to Cart
          </button>
        )}
      </div>
    </div>
  );
};

export default TicketType;