import React from 'react';

const LoginToggle = ({ usePhoneNumber, setUsePhoneNumber }) => {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px',
    }}>
      <div style={{
        fontWeight: '600',
        fontSize: '16px',
      }}>
        {usePhoneNumber ? 'Phone' : 'Email'}
      </div>
      
      <label style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        cursor: 'pointer',
        fontSize: '14px',
        color: 'var(--neutral-600)',
      }}>
        Use Phone Number
        <div style={{
          position: 'relative',
          width: '34px',
          height: '18px',
        }}>
          <input
            type="checkbox"
            checked={usePhoneNumber}
            onChange={() => setUsePhoneNumber(!usePhoneNumber)}
            style={{
              opacity: 0,
              width: 0,
              height: 0,
            }}
          />
          <span style={{
            position: 'absolute',
            cursor: 'pointer',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: usePhoneNumber ? 'var(--primary)' : '#ccc',
            transition: '0.4s',
            borderRadius: '34px',
          }}>
            <span style={{
              position: 'absolute',
              content: '',
              height: '14px',
              width: '14px',
              left: usePhoneNumber ? '17px' : '3px',
              bottom: '2px',
              backgroundColor: 'white',
              transition: '0.4s',
              borderRadius: '50%',
            }}></span>
          </span>
        </div>
      </label>
    </div>
  );
};

export default LoginToggle;