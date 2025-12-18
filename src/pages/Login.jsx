import React from 'react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { login } = useAuth();

  const handleLogin = (e) => {
    e.preventDefault();
    // 1. Set the user in state/localStorage
    login({ email: 'user@test.com' });
    
    // 2. Hard redirect to the dashboard
    // This forces the browser to refresh and find the new route
    window.location.href = "/#/dashboard";
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white font-sans">
      <div className="p-10 bg-gray-800 rounded-3xl shadow-2xl border border-gray-700 w-full max-w-md text-center">
        <h1 className="text-4xl font-extrabold mb-2 text-blue-500 tracking-tight">Fitness Now</h1>
        <p className="text-gray-400 mb-10">Welcome back! Ready to sweat?</p>
        
        <button 
          onClick={handleLogin}
          className="w-full py-4 bg-blue-600 rounded-2xl font-bold text-lg hover:bg-blue-700 active:scale-95 transition-all shadow-xl shadow-blue-500/20"
        >
          Enter Dashboard
        </button>
      </div>
    </div>
  );
};

export default Login;
