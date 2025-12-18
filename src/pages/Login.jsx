import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    login({ email });
    navigate('/dashboard');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <div className="p-8 bg-gray-800 rounded-3xl border border-gray-700 w-full max-w-md shadow-2xl">
        <h2 className="text-3xl font-bold mb-2 text-blue-500 text-center">Fitness Now</h2>
        <p className="text-gray-400 mb-8 text-center">Welcome back!</p>
        
        <form onSubmit={handleLogin} className="space-y-5">
          <input 
            type="email" 
            placeholder="Email Address"
            className="w-full bg-gray-900 border border-gray-700 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit" className="w-full py-4 bg-blue-600 rounded-xl font-bold text-lg hover:bg-blue-700 transition-all">
            Login
          </button>
        </form>
        
        <p className="mt-8 text-center text-gray-400">
          New here? <Link to="/register" className="text-blue-500 font-semibold hover:underline">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
