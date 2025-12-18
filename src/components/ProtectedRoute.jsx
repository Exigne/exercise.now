import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = () => {
  const { currentUser, isLoading } = useAuth();

  console.log("Protected Route Check - User:", currentUser, "Loading:", isLoading);

  if (isLoading) {
    return <div className="bg-gray-900 min-h-screen text-white p-10">Loading...</div>;
  }
  
  // If no user, send back to login
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
