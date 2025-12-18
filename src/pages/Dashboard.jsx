import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Activity, Zap, User, LogOut } from 'lucide-react';

const Dashboard = () => {
  const { logout } = useAuth();

  const stats = [
    { label: 'Workouts', value: '12', icon: <Activity className="text-blue-500" /> },
    { label: 'Calories', value: '1,250', icon: <Zap className="text-yellow-500" /> },
    { label: 'Streak', value: '5 Days', icon: <User className="text-green-500" /> },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-bold text-blue-500">Fitness Now</h1>
          <button 
            onClick={logout}
            className="flex items-center gap-2 bg-gray-800 hover:bg-red-900/30 px-4 py-2 rounded-lg transition-colors border border-gray-700"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>

        <h2 className="text-4xl font-bold mb-2">Welcome back!</h2>
        <p className="text-gray-400 mb-8">Here is your progress for this week.</p>

        {/* This grid makes it look like a pro dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {stats.map((stat, index) => (
            <div key={index} className="p-6 bg-gray-800 rounded-2xl border border-gray-700 shadow-xl">
              <div className="mb-4">{stat.icon}</div>
              <p className="text-gray-400 text-sm uppercase tracking-wider">{stat.label}</p>
              <p className="text-3xl font-bold">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="p-10 border-2 border-dashed border-gray-700 rounded-3xl text-center text-gray-500">
          Recent activity charts will appear here.
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
