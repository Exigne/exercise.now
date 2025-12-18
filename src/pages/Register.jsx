import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    // Simulate API call to save user
    const newUser = { 
      email, 
      id: Date.now(),
      username: email.split('@')[0] 
    };
    
    login(newUser);
    navigate('/dashboard');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <div className="p-8 bg-gray-800 rounded-3xl border border-gray-700 w-full max-w-md shadow-2xl">
        <h2 className="text-3xl font-bold mb-2 text-blue-500">Join Fitness Now</h2>
        <p className="text-gray-400 mb-8">Start tracking your progress today.</p>
        
        <form onSubmit={handleRegister} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Email Address</label>
            <input 
              type="email" 
              required
              className="w-full bg-gray-900 border border-gray-700 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              placeholder="name@email.com"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Password</label>
            <input 
              type="password" 
              required
              className="w-full bg-gray-900 border border-gray-700 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              placeholder="••••••••"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="w-full py-4 bg-blue-600 rounded-xl font-bold text-lg hover:bg-blue-700 active:scale-[0.98] transition-all">
            Create Account
          </button>
        </form>
        
        <p className="mt-8 text-center text-gray-400">
          Already have an account? <Link to="/login" className="text-blue-500 font-semibold hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
