import React from 'react';

const EventContainer = ({ children }) => {
  return (
    <div
      style={{
        padding: "110px 32px 60px 32px",
        maxWidth: "1200px",
        margin: "0 auto",
        minHeight: "90vh",
      }}
    >
      {children}
    </div>
  );
};

export default EventContainer;