import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { currentUser: user, loading: authLoading } = useAuth();
  
  const [exercise, setExercise] = useState('');
  const [sets, setSets] = useState('');
  const [reps, setReps] = useState('');
  const [weight, setWeight] = useState('');
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  // BIT 1: Set your API URL. 
  // If you later make a Render Web Service, put that URL here.
  // For now, it defaults to the same domain you are hosted on.
  const API_BASE_URL = ''; 

  /* ---------- READ ---------- */
  const fetchWorkoutHistory = async () => {
    if (!user?.email) return;

    try {
      // BIT 2: Updated to be more flexible and removed the hardcoded Cloudflare URL
      const res = await fetch(`${API_BASE_URL}/api/workouts?user=${encodeURIComponent(user.email)}`);
      
      if (!res.ok) {
          console.error('Database fetch failed. Status:', res.status);
          return;
      }

      const data = await res.json();
      // Ensure data is an array before setting state
      setHistory(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Connection to backend failed:", err);
    }
  };

  useEffect(() => {
    if (user?.email) {
      fetchWorkoutHistory();
    }
  }, [user?.email]);

  /* ---------- WRITE ---------- */
  const handleLogWorkout = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      user_email: user.email,
      exercise,
      sets: Number(sets),
      reps: Number(reps),
      weight: Number(weight),
    };

    try {
      const res = await fetch(`${API_BASE_URL}/api/workouts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error('Save failed');
      }
      
      alert('Workout logged!');
      setExercise('');
      setSets('');
      setReps('');
      setWeight('');
      fetchWorkoutHistory();
    } catch (error) {
      console.error('Error logging workout:', error);
      alert('Failed to connect to backend. Make sure your API is running.');
    } finally {
      setLoading(false);
    }
  };

  /* ---------- GUARDS ---------- */
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Loading authentication...</p>
        </div>
      </div>
    );
  }

  if (!user?.email) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <p>No user found. Please log in.</p>
      </div>
    );
  }

  /* ---------- RENDER ---------- */
  return (
    <div className="p-5 max-w-xl mx-auto bg-gray-900 text-white min-h-screen">
      <header className="mb-8 border-b border-gray-800 pb-4">
        <h2 className="text-2xl font-bold">Dashboard</h2>
        <p className="text-gray-400 text-sm">{user.email}</p>
      </header>

      <div className="bg-gray-800 p-6 rounded-xl shadow-lg mb-8">
        <h3 className="text-lg font-semibold mb-4 text-blue-400">Log New Session</h3>
        <form onSubmit={handleLogWorkout} className="flex flex-col gap-4">
          <input
            className="p-3 rounded-lg bg-gray-700 border border-gray-600 focus:border-blue-500 outline-none transition-all"
            value={exercise}
            onChange={(e) => setExercise(e.target.value)}
            placeholder="Exercise Name"
            required
          />
          <div className="grid grid-cols-3 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-400 ml-1">Sets</label>
              <input
                type="number"
                className="p-3 rounded-lg bg-gray-700 border border-gray-600"
                value={sets}
                onChange={(e) => setSets(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-400 ml-1">Reps</label>
              <input
                type="number"
                className="p-3 rounded-lg bg-gray-700 border border-gray-600"
                value={reps}
                onChange={(e) => setReps(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-400 ml-1">Weight (kg)</label>
              <input
                type="number"
                className="p-3 rounded-lg bg-gray-700 border border-gray-600"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                required
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-500 p-3 rounded-lg font-bold transition-colors disabled:opacity-50 mt-2"
          >
            {loading ? 'Logging…' : 'Save Workout'}
          </button>
        </form>
      </div>

      <h3 className="text-xl font-semibold mb-4">Workout History</h3>
      {history.length === 0 ? (
        <div className="text-center py-10 bg-gray-800/50 rounded-xl border border-dashed border-gray-700">
          <p className="text-gray-500">No records found yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {history.map((w) => (
            <div key={w.id} className="bg-gray-800 p-4 rounded-lg border border-gray-700 flex justify-between items-center">
              <div>
                <p className="font-bold text-blue-400 uppercase text-xs tracking-wider">{w.exercise}</p>
                <p className="text-lg">{w.sets} sets × {w.reps} reps</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">{w.weight}<span className="text-sm ml-1 text-gray-500">kg</span></p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
