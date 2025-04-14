import React, { createContext, useState, useEffect, useContext } from 'react';

// Create authentication context
const AuthContext = createContext(null);

// Custom hook to use the auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on initial load
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      setCurrentUser(JSON.parse(user));
    }
    setLoading(false);
  }, []);

  // Login user
  const login = (userData) => {
    // Process Google OAuth data if available
    let processedData = userData;
    
    if (userData.provider === 'google') {
      // Extract and normalize phone number from Google user data if available
      let phoneNumber = userData.phone || userData.phoneNumber || '';
      
      // If no phone number is available but we have a sub (Google ID), we can
      // simulate one for demo purposes with the last 8 digits of the ID
      if (!phoneNumber && userData.sub) {
        const lastEight = userData.sub.slice(-8);
        phoneNumber = `+1${lastEight}`; // Simulate a US phone number
      }
      
      // Extract profile picture if available
      const profilePicture = userData.picture || userData.profilePicture || '';
      
      // Format name components
      const firstName = userData.given_name || userData.firstName || userData.name?.split(' ')[0] || '';
      const lastName = userData.family_name || userData.lastName || (userData.name?.split(' ').length > 1 ? userData.name.split(' ').slice(1).join(' ') : '') || '';
      
      // Enhance the user data with normalized information
      processedData = {
        ...userData,
        phone: phoneNumber,
        profilePicture: profilePicture,
        firstName: firstName,
        lastName: lastName
      };
      
      console.log("Processed Google user data:", processedData);
    }
    
    localStorage.setItem('user', JSON.stringify(processedData));
    setCurrentUser(processedData);
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem('user');
    setCurrentUser(null);
  };

  // Update user data
  const updateUser = (userData) => {
    const updatedUser = { ...currentUser, ...userData };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setCurrentUser(updatedUser);
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    return !!currentUser;
  };

  const value = {
    currentUser,
    login,
    logout,
    updateUser,
    isAuthenticated,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};