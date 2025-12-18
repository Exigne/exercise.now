import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = () => {
  const { currentUser, loading } = useAuth();

  // If the app is still checking localStorage, show nothing or a spinner
  if (loading) return <div className="min-h-screen bg-gray-900" />;

  console.log("Final check - User is:", currentUser);

  return currentUser ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
