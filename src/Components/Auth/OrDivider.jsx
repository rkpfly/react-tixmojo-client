import React from 'react';

const OrDivider = () => {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      margin: '20px 0',
    }}>
      <div style={{
        flex: 1,
        height: '1px',
        backgroundColor: 'var(--neutral-200)',
      }} />
      <span style={{
        padding: '0 10px',
        color: 'var(--neutral-500)',
        fontSize: '14px',
      }}>
        or
      </span>
      <div style={{
        flex: 1,
        height: '1px',
        backgroundColor: 'var(--neutral-200)',
      }} />
    </div>
  );
};

export default OrDivider;