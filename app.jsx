import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter, Routes, Route } from 'react-router-dom'; // Switched to HashRouter
import { AuthProvider } from './src/context/AuthContext'; 
import Login from './src/pages/Login';
import Dashboard from './src/pages/Dashboard';
import ProtectedRoute from './src/components/ProtectedRoute';
import './index.css';

const rootElement = document.getElementById('root');

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <AuthProvider>
        <HashRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            {/* Protected routes wrapped together */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
            </Route>
            {/* Catch-all sends back to login */}
            <Route path="*" element={<Login />} />
          </Routes>
        </HashRouter>
      </AuthProvider>
    </React.StrictMode>
  );
}
