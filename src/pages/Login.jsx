import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { login } = useAuth();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white font-sans">
      <div className="p-10 bg-gray-800 rounded-3xl border border-gray-700 w-full max-w-md text-center">
        <h1 className="text-4xl font-extrabold mb-8 text-blue-500">Fitness Now</h1>
        
        <Link 
          to="/dashboard"
          onClick={() => login({ email: 'user@test.com' })}
          className="block w-full py-4 bg-blue-600 rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all shadow-xl"
        >
          Enter Dashboard
        </Link>
      </div>
    </div>
  );
};

export default Login;
