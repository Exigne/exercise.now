import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './src/context/AuthContext'; 
import Login from './src/pages/Login';
import Dashboard from './src/pages/Dashboard';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          {/* We removed ProtectedRoute here temporarily to test */}
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </HashRouter>
    </AuthProvider>
  </React.StrictMode>
);
