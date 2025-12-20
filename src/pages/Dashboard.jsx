import React, { useState, useEffect } from 'react';

const Dashboard = ({ user }) => {
  const [exercise, setExercise] = useState('');
  const [sets, setSets]         = useState('');
  const [reps, setReps]         = useState('');
  const [weight, setWeight]     = useState('');
  const [history, setHistory]   = useState([]);
  const [loading, setLoading]   = useState(false);

  // guard – don’t render until we have a user
  if (!user?.email) return <p style={{ padding: 20 }}>Loading…</p>;

/* ---------- READ ---------- */
  const fetchWorkoutHistory = async () => {
    // Bit 1: Safe check before fetching
    if (!user?.email) return; 

    const res = await fetch('/api/workouts?user=' + encodeURIComponent(user.email));
    if (!res.ok) return console.error('DB read failed');
    const data = await res.json();
    setHistory(data);
  };

  useEffect(() => {
    fetchWorkoutHistory();
  }, [user.email]);

  /* ---------- WRITE ---------- */
  const handleLogWorkout = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      user_email: user.email,
      exercise,
      sets:   Number(sets),
      reps:   Number(reps),
      weight: Number(weight),
    };

    const res = await fetch('/api/workouts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      alert('Save failed');
    } else {
      alert('Workout logged!');
      setExercise(''); setSets(''); setReps(''); setWeight('');
      fetchWorkoutHistory();
    }
    setLoading(false);
  };

  /* ---------- RENDER ---------- */
  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>Welcome, {user.email}</h2>

      <form onSubmit={handleLogWorkout} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input
          value={exercise}
          onChange={(e) => setExercise(e.target.value)}
          placeholder="Exercise (e.g. Bench Press)"
          required
        />
        <input
          type="number"
          value={sets}
          onChange={(e) => setSets(e.target.value)}
          placeholder="Sets"
          required
        />
        <input
          type="number"
          value={reps}
          onChange={(e) => setReps(e.target.value)}
          placeholder="Reps"
          required
        />
        <input
          type="number"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          placeholder="Weight (kg)"
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Logging…' : 'Log session'}
        </button>
      </form>

      <hr style={{ margin: '30px 0' }} />

      <h3>Recent workouts</h3>
      {history.length === 0 ? (
        <p>No workouts found.</p>
      ) : (
        <ul>
          {history.map((w) => (
            <li key={w.id}>
              <strong>{w.exercise}</strong>: {w.sets} × {w.reps} @ {w.weight} kg
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dashboard;
