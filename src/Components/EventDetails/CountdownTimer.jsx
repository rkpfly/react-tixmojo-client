import React, { useState, useEffect } from 'react';
import { BiTimer } from 'react-icons/bi';

const CountdownTimer = ({ expiryTime, onExpire }) => {
  const [timeLeft, setTimeLeft] = useState({
    minutes: 0,
    seconds: 0
  });
  
  // Calculate percentage of time remaining for the progress bar
  // Assuming we start with 10 minutes (600 seconds)
  const [progressPercentage, setProgressPercentage] = useState(100);
  const TOTAL_SECONDS = 600; // 10 minutes
  
  useEffect(() => {
    // Calculate initial time left
    const calculateTimeLeft = () => {
      const now = new Date();
      const difference = expiryTime - now;
      
      if (difference <= 0) {
        // Timer expired
        setTimeLeft({ minutes: 0, seconds: 0 });
        setProgressPercentage(0);
        
        // Call onExpire with appropriate guard
        if (typeof onExpire === 'function') {
          console.log("Countdown timer expired - calling parent handler");
          onExpire();
        }
        return;
      }
      
      // Calculate minutes and seconds
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);
      const totalSecondsLeft = minutes * 60 + seconds;
      
      // Calculate progress percentage (capped between 0-100)
      const progress = Math.min(100, Math.max(0, (totalSecondsLeft / TOTAL_SECONDS) * 100));
      
      setTimeLeft({ minutes, seconds });
      setProgressPercentage(progress);
    };

    // Call immediately to set initial state
    calculateTimeLeft();
    
    // Set up the interval with a shorter delay for smoother updates
    const timerId = setInterval(calculateTimeLeft, 500);
    
    // Force update using requestAnimationFrame for smoother updates during interactions
    const rafId = requestAnimationFrame(function updateFrame() {
      calculateTimeLeft();
      requestAnimationFrame(updateFrame);
    });
    
    // Clear interval and animation frame on component unmount
    return () => {
      clearInterval(timerId);
      cancelAnimationFrame(rafId);
    };
  }, [expiryTime, onExpire]);

  // Determine color based on time remaining
  const getTimerColor = () => {
    if (progressPercentage > 50) return 'var(--purple-600)';
    if (progressPercentage > 20) return 'var(--purple-800)';
    return 'var(--primary)';
  };
  
  const timerColor = getTimerColor();
  
  // Pulse animation for low time
  const shouldPulse = progressPercentage <= 20;

  return (
    <div 
      style={{ 
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
        fontFamily: 'var(--font-heading)',
        position: 'relative',
        backgroundColor: 'var(--purple-50)',
        padding: '15px 20px',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(111, 68, 255, 0.08)',
        width: '100%',
        border: '1px solid var(--purple-100)',
        animation: 'slideIn 0.3s forwards'
      }}
    >
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '8px',
        color: timerColor,
        fontWeight: '600',
        fontSize: '15px',
        animation: shouldPulse ? 'pulse 1.5s infinite' : 'none'
      }}>
        <BiTimer style={{ fontSize: '18px' }} />
        <span>Session Expires In</span>
      </div>
      
      {/* Timer Display */}
      <div 
        style={{ 
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          position: 'relative',
          zIndex: 2
        }}
      >
        <div 
          style={{ 
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: timerColor,
            color: 'white',
            width: '42px',
            height: '46px',
            borderRadius: '6px',
            fontSize: '24px',
            fontWeight: '700',
            boxShadow: '0 3px 6px rgba(111, 68, 255, 0.2)',
            position: 'relative',
            overflow: 'hidden',
            transition: 'background-color 0.3s ease'
          }}
        >
          {String(timeLeft.minutes).padStart(2, '0')}
        </div>
        <span style={{ 
          color: timerColor, 
          fontWeight: '700', 
          fontSize: '24px',
          animation: shouldPulse ? 'pulse 1.5s infinite' : 'none'
        }}>:</span>
        <div 
          style={{ 
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: timerColor,
            color: 'white',
            width: '42px',
            height: '46px',
            borderRadius: '6px',
            fontSize: '24px',
            fontWeight: '700',
            boxShadow: '0 3px 6px rgba(111, 68, 255, 0.2)',
            position: 'relative',
            overflow: 'hidden',
            transition: 'background-color 0.3s ease'
          }}
        >
          {String(timeLeft.seconds).padStart(2, '0')}
        </div>
      </div>
      
      {/* Progress Bar */}
      <div style={{
        width: '100%',
        height: '4px',
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        borderRadius: '2px',
        overflow: 'hidden',
        marginTop: '6px'
      }}>
        <div style={{
          height: '100%',
          width: `${progressPercentage}%`,
          backgroundColor: timerColor,
          borderRadius: '2px',
          transition: 'width 1s ease, background-color 0.3s ease'
        }} />
      </div>
      
      {/* Message */}
      <span 
        style={{ 
          fontSize: '12px', 
          color: 'var(--neutral-600)', 
          textAlign: 'center',
          fontWeight: '500',
          marginTop: '2px'
        }}
      >
        Please complete purchase before expiry
      </span>
      
      {/* Add CSS animations */}
      <style>
        {`
          @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.7; }
            100% { opacity: 1; }
          }
          
          @keyframes slideIn {
            0% { transform: translateX(100px); opacity: 0; }
            100% { transform: translateX(0); opacity: 1; }
          }
          
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
            20%, 40%, 60%, 80% { transform: translateX(2px); }
          }
          
          @media (max-width: 768px) {
            .timer-container {
              transform: scale(0.8);
              transform-origin: top right;
            }
          }
        `}
      </style>
    </div>
  );
};

export default CountdownTimer;