import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = () => {
  const { currentUser, isLoading } = useAuth();

  // This log will now show the actual user object instead of 'undefined'
  console.log("Checking Access. Current User:", currentUser);

  if (isLoading) {
    return <div className="bg-gray-900 min-h-screen text-white p-10">Loading...</div>;
  }
  
  // If there is no user, redirect to login
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // If there is a user, allow them into the Dashboard
  return <Outlet />;
};

export default ProtectedRoute;
