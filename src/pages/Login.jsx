import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const auth = useAuth();

  const handleLogin = (e) => {
    e.preventDefault();
    console.log("Login button clicked!"); // Check 1

    if (!auth) {
      console.error("Auth Context is MISSING! Check if AuthProvider is in app.jsx");
      return;
    }

    // Perform the login
    auth.login({ email: 'user@test.com' });
    console.log("Login function called. User set to:", auth.currentUser); // Check 2

    // Move to dashboard
    navigate('/dashboard');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white font-sans">
      <div className="p-8 bg-gray-800 rounded-2xl shadow-2xl border border-gray-700 w-full max-w-md">
        <h1 className="text-3xl font-bold mb-2 text-center text-blue-500">Fitness Now</h1>
        <p className="text-gray-400 text-center mb-8">Sign in to track your progress</p>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <button 
            type="submit" 
            className="w-full py-4 bg-blue-600 rounded-xl font-bold hover:bg-blue-700 active:scale-95 transition-all shadow-lg shadow-blue-900/20"
          >
            Enter Dashboard
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
