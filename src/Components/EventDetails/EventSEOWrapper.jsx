import React from 'react';
import { EventSEO } from "../../utils/SEO.jsx";

const EventSEOWrapper = ({ event, eventId }) => {
  return (
    <EventSEO
      event={{
        title: event.title,
        description: `Join us for ${event.title} - ${event.tags[0]} on ${event.date}. Get tickets now!`,
        date: event.date,
        endDate: event.date, // If no specific end date is available
        location: {
          name: event.venueName,
          address: event.venueAddress,
        },
        image: event.image,
        price: {
          currency: event.price.currency,
          value: event.price.value,
        },
        performer: {
          name: event.organizer.name,
          type: "Organization",
        },
        offers: [
          {
            name: "Standard Ticket",
            price: event.price.value,
          },
        ],
      }}
      path={`/events/${eventId}`}
    />
  );
};

export default EventSEOWrapper;