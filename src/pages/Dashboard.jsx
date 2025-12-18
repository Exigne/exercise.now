import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Activity, LogOut, User, Zap } from 'lucide-react';

const Dashboard = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const stats = [
    { label: 'Workouts', value: '12', icon: Activity, color: 'text-blue-500' },
    { label: 'Calories', value: '1,250', icon: Zap, color: 'text-yellow-500' },
    { label: 'Streak', value: '5 Days', icon: User, color: 'text-green-500' },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Navigation Bar */}
      <nav className="border-b border-gray-800 bg-gray-800/50 px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold tracking-tight">Fitness Now</h1>
        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition"
        >
          <LogOut size={18} />
          Logout
        </button>
      </nav>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto p-6 space-y-8">
        <header>
          <h2 className="text-3xl font-bold">Welcome back!</h2>
          <p className="text-gray-400">Here is your progress for this week.</p>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <stat.icon className={stat.color} size={24} />
              </div>
              <p className="text-sm text-gray-400 uppercase tracking-wider">{stat.label}</p>
              <h3 className="text-2xl font-bold">{stat.value}</h3>
            </div>
          ))}
        </div>

        {/* Placeholder for future features */}
        <div className="bg-gray-800/30 border-2 border-dashed border-gray-700 rounded-xl p-12 text-center">
          <p className="text-gray-500 italic">Recent activity charts will appear here.</p>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
