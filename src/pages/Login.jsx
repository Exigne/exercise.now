import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const auth = useAuth();

  const handleLogin = (e) => {
    e.preventDefault();
    if (auth?.login) {
      auth.login({ email: 'user@test.com' });
      navigate('/dashboard');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <form onSubmit={handleLogin} className="p-8 bg-gray-800 rounded-lg shadow-xl border border-gray-700">
        <h1 className="text-2xl font-bold mb-4">Fitness Now</h1>
        <button type="submit" className="w-full py-2 bg-blue-600 rounded hover:bg-blue-700 transition">
          Enter Dashboard
        </button>
      </form>
    </div>
  );
};

export default Login;
