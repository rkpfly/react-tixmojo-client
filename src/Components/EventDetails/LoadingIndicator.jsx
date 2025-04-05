import React from 'react';
import Loader from '../Loader';

const LoadingIndicator = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "70vh",
      }}
    >
      <Loader size="large" text="Loading event details..." />
    </div>
  );
};

export default LoadingIndicator;