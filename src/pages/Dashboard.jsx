import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// Replace these with your actual Supabase Project URL and Anon Key
const supabaseUrl = 'https://bpbbljmzgnjiusavpgdg.supabase.co';
const supabaseAnonKey = 'sb_publishable_YxNCAWQYsqTDlheTuzP6SA_5yffyH_S';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const Dashboard = ({ user }) => {
  const [exercise, setExercise] = useState('');
  const [sets, setSets] = useState('');
  const [reps, setReps] = useState('');
  const [weight, setWeight] = useState('');
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  
  if (!user?.email) return <p>Loading…</p>;
  
  // 1. Fetch history from Supabase on load
  useEffect(() => {
    fetchWorkoutHistory();
  }, [user.email]);

  const fetchWorkoutHistory = async () => {
    const { data, error } = await supabase
      .from('workouts')
      .select('*')
      .eq('user_email', user.email)
      .order('created_at', { ascending: false });

    if (error) console.error('Error fetching history:', error);
    else setHistory(data);
  };

  // 2. Save workout to Supabase
  const handleLogWorkout = async (e) => {
    e.preventDefault();
    setLoading(true);

    const newWorkout = {
      user_email: user.email,
      exercise: exercise,
      sets: parseInt(sets),
      reps: parseInt(reps),
      weight: parseFloat(weight),
    };

    const { data, error } = await supabase
      .from('workouts')
      .insert([newWorkout]);

    if (error) {
      alert('Error saving to Exigne\'s Project: ' + error.message);
    } else {
      alert('Workout logged successfully!');
      setExercise('');
      setSets('');
      setReps('');
      setWeight('');
      fetchWorkoutHistory(); // Refresh the list
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>Welcome, {user.email}</h2>
      
      <form onSubmit={handleLogWorkout} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input type="text" placeholder="Exercise (e.g. Bench Press)" value={exercise} onChange={(e) => setExercise(e.target.value)} required />
        <input type="number" placeholder="Sets" value={sets} onChange={(e) => setSets(e.target.value)} required />
        <input type="number" placeholder="Reps" value={reps} onChange={(e) => setReps(e.target.value)} required />
        <input type="number" placeholder="Weight (kg)" value={weight} onChange={(e) => setWeight(e.target.value)} required />
        <button type="submit" disabled={loading}>
          {loading ? 'Logging...' : 'Log Session'}
        </button>
      </form>

      <hr style={{ margin: '30px 0' }} />

      <h3>Recent Workouts</h3>
      {history.length === 0 ? <p>No workouts found.</p> : (
        <ul>
          {history.map((item) => (
            <li key={item.id}>
              <strong>{item.exercise}</strong>: {item.sets}x{item.reps} @ {item.weight}kg
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dashboard;
