import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Eye, EyeOff, LogIn, UserPlus, Dumbbell } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validation
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);

    try {
      // Call login with both email and password
      await login({ email, password });
      navigate('/dashboard');
    } catch (error) {
      setError(error.message || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  // Demo login for testing
  const handleDemoLogin = () => {
    setEmail('demo@fitnessapp.com');
    setPassword('demo123');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-4">
      <div className="p-8 bg-gray-800/50 backdrop-blur-sm rounded-3xl border border-gray-700/50 w-full max-w-md shadow-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Dumbbell size={32} className="text-white" />
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            FitTrack Pro
          </h2>
          <p className="text-gray-400 mt-2">Welcome back! Please login to continue</p>
        </div>
        
        {/* Error Message */}
        {error && (
          <div className="mb-6 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}
        
        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-6">
          {/* Email Input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail size={18} className="text-gray-400" />
            </div>
            <input 
              type="email" 
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 rounded-xl p-3 pl-10 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              required
              disabled={isLoading}
            />
          </div>

          {/* Password Input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock size={18} className="text-gray-400" />
            </div>
            <input 
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 rounded-xl p-3 pl-10 pr-10 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              required
              disabled={isLoading}
              minLength={6}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white transition-colors"
              disabled={isLoading}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center space-x-2 text-gray-400">
              <input 
                type="checkbox" 
                className="rounded bg-gray-700 border-gray-600 text-blue-500 focus:ring-blue-500"
                disabled={isLoading}
              />
              <span>Remember me</span>
            </label>
            <Link to="/forgot-password" className="text-blue-400 hover:text-blue-300 transition-colors">
              Forgot password?
            </Link>
          </div>

          {/* Login Button */}
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Logging in...</span>
              </>
            ) : (
              <>
                <LogIn size={20} />
                <span>Login</span>
              </>
            )}
          </button>

          {/* Demo Login Button */}
          <button
            type="button"
            onClick={handleDemoLogin}
            disabled={isLoading}
            className="w-full py-3 bg-gray-700 hover:bg-gray-600 rounded-xl font-medium transition-colors disabled:opacity-50"
          >
            Try Demo Account
          </button>
        </form>
        
        {/* Register Link */}
        <p className="mt-8 text-center text-gray-400">
          New to FitTrack Pro?{' '}
          <Link to="/register" className="text-blue-400 font-semibold hover:text-blue-300 transition-colors">
            Create an account
          </Link>
        </p>

        {/* Features Preview */}
        <div className="mt-6 pt-6 border-t border-gray-700">
          <p className="text-xs text-gray-500 text-center mb-3">Track your fitness journey with:</p>
          <div className="flex justify-center space-x-4 text-xs text-gray-400">
            <span>📊 Analytics</span>
            <span>⏱️ Rest Timer</span>
            <span>🏆 PR Tracking</span>
            <span>📈 Progress Charts</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
