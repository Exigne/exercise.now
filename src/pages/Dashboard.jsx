import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  // FIXED: Use useAuth hook instead of expecting user as a prop
  const { currentUser: user, loading: authLoading } = useAuth();
  
  const [exercise, setExercise] = useState('');
  const [sets, setSets] = useState('');
  const [reps, setReps] = useState('');
  const [weight, setWeight] = useState('');
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  // Guard – don't render until authentication is complete
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

  /* ---------- READ ---------- */
const fetchWorkoutHistory = async () => {
  if (!user?.email) return;

  try {
    // CHANGE THIS: Add your full Cloudflare Worker URL here
    const res = await fetch('https://exercisenow.mbibs81.workers.dev/api/workouts?user=' + encodeURIComponent(user.email));
    
    // CHECK: Make sure the response is actually okay before parsing
    if (!res.ok) {
        console.error('Server returned an error');
        return;
    }

    const data = await res.json();
    setHistory(data);
  } catch (err) {
    console.error("JSON Parsing failed:", err);
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
      const res = await fetch('/api/workouts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        alert('Save failed');
      } else {
        alert('Workout logged!');
        setExercise('');
        setSets('');
        setReps('');
        setWeight('');
        fetchWorkoutHistory();
      }
    } catch (error) {
      console.error('Error logging workout:', error);
      alert('Failed to log workout');
    } finally {
      setLoading(false);
    }
  };

  /* ---------- RENDER ---------- */
  return (
    <div className="p-5 max-w-xl mx-auto bg-gray-900 text-white min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Welcome, {user.email}</h2>

      <form onSubmit={handleLogWorkout} className="flex flex-col gap-3">
        <input
          className="p-2 rounded bg-gray-800 border border-gray-700 text-white"
          value={exercise}
          onChange={(e) => setExercise(e.target.value)}
          placeholder="Exercise (e.g. Bench Press)"
          required
        />
        <div className="grid grid-cols-3 gap-2">
          <input
            type="number"
            className="p-2 rounded bg-gray-800 border border-gray-700 text-white"
            value={sets}
            onChange={(e) => setSets(e.target.value)}
            placeholder="Sets"
            required
          />
          <input
            type="number"
            className="p-2 rounded bg-gray-800 border border-gray-700 text-white"
            value={reps}
            onChange={(e) => setReps(e.target.value)}
            placeholder="Reps"
            required
          />
          <input
            type="number"
            className="p-2 rounded bg-gray-800 border border-gray-700 text-white"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="kg"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 p-2 rounded font-bold disabled:opacity-50"
        >
          {loading ? 'Logging…' : 'Log session'}
        </button>
      </form>

      <hr className="my-8 border-gray-700" />

      <h3 className="text-xl font-semibold mb-3">Recent workouts</h3>
      {history.length === 0 ? (
        <p className="text-gray-400">No workouts found.</p>
      ) : (
        <ul className="space-y-2">
          {history.map((w) => (
            <li key={w.id} className="bg-gray-800 p-3 rounded border border-gray-700">
              <span className="font-bold text-blue-400">{w.exercise}</span>: {w.sets} × {w.reps} @ {w.weight} kg
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dashboard;
