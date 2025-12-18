import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true); // New loading state

  useEffect(() => {
    // Check localStorage once when the app starts
    const saved = localStorage.getItem('fitness_user');
    if (saved) {
      console.log("Found user in storage:", JSON.parse(saved));
      setCurrentUser(JSON.parse(saved));
    }
    setLoading(false); // Done checking
  }, []);

  const login = (user) => {
    setCurrentUser(user);
    localStorage.setItem('fitness_user', JSON.stringify(user));
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('fitness_user');
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
