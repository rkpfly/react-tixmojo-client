import React, { createContext, useContext, useState, useEffect } from 'react';

// Create the Animation context
const AnimationContext = createContext({
  animationsEnabled: true,
  disableAnimations: () => {},
  enableAnimations: () => {},
});

// Custom hook to use the Animation context
export const useAnimation = () => useContext(AnimationContext);

// Animation provider component
export const AnimationProvider = ({ children }) => {
  const [animationsEnabled, setAnimationsEnabled] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Function to disable animations
  const disableAnimations = () => {
    setAnimationsEnabled(false);
  };

  // Function to enable animations
  const enableAnimations = () => {
    setAnimationsEnabled(true);
  };

  // Set sidebar open status
  const setSidebarStatus = (isOpen) => {
    setSidebarOpen(isOpen);
    // Optionally disable animations when sidebar is open
    setAnimationsEnabled(!isOpen);
  };

  // Share the animation context
  const contextValue = {
    animationsEnabled,
    disableAnimations,
    enableAnimations,
    sidebarOpen,
    setSidebarStatus,
  };

  return (
    <AnimationContext.Provider value={contextValue}>
      {children}
    </AnimationContext.Provider>
  );
};

export default AnimationProvider;