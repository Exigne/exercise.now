import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Activity, Zap, Trophy, LogOut, Trash2 } from 'lucide-react';

const Dashboard = () => {
  const { currentUser, logout } = useAuth();
  const [workouts, setWorkouts] = useState([]);
  const [exercise, setExercise] = useState('');
  const [sets, setSets] = useState('');
  const [reps, setReps] = useState('');

  useEffect(() => {
    const data = localStorage.getItem(`workouts_${currentUser?.email}`);
    if (data) setWorkouts(JSON.parse(data));
  }, [currentUser]);

  useEffect(() => {
    if (currentUser?.email) {
      localStorage.setItem(`workouts_${currentUser.email}`, JSON.stringify(workouts));
    }
  }, [workouts, currentUser]);

  const addWorkout = (e) => {
    e.preventDefault();
    if (!exercise || !sets || !reps) return;
    
    const newWorkout = {
      id: Date.now(),
      date: new Date().toLocaleDateString(),
      exercise,
      sets,
      reps
    };
    
    setWorkouts([newWorkout, ...workouts]);
    setExercise('');
    setSets('');
    setReps('');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-bold text-blue-500">Fitness Now</h1>
          <button onClick={logout} className="text-red-500">
            <LogOut size={20} />
          </button>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-gray-800 p-5 rounded-2xl border border-gray-700">
            <form onSubmit={addWorkout} className="space-y-3">
              <input
                className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2 text-sm focus:border-blue-500 focus:outline-none"
                placeholder="Exercise"
                value={exercise}
                onChange={e => setExercise(e.target.value)}
              />
              <input
                className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2 text-sm focus:border-blue-500 focus:outline-none"
                placeholder="Sets"
                value={sets}
                onChange={e => setSets(e.target.value)}
                type="number"
              />
              <input
                className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2 text-sm focus:border-blue-500 focus:outline-none"
                placeholder="Reps"
                value={reps}
                onChange={e => setReps(e.target.value)}
                type="number"
              />
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 p-2 rounded-lg font-bold transition-colors"
              >
                Add Workout
              </button>
            </form>
          </div>
          
          <div className="md:col-span-2 space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-gray-800 p-3 rounded-xl border border-gray-700 text-center">
                <Activity size={16} className="mx-auto" />
                <p>{workouts.length}</p>
              </div>
              <div className="bg-gray-800 p-3 rounded-xl border border-gray-700 text-center">
                <Zap size={16} className="mx-auto" />
                <p>1</p>
              </div>
              <div className="bg-gray-800 p-3 rounded-xl border border-gray-700 text-center">
                <Trophy size={16} className="mx-auto" />
                <p>100</p>
              </div>
            </div>
            
            {workouts.map(w => (
              <div key={w.id} className="bg-gray-800 p-3 rounded-xl border border-gray-700 flex justify-between">
                <div>
                  <p className="text-blue-400 text-xs">{w.date}</p>
                  <p className="font-bold">{w.exercise}</p>
                  <p className="text-gray-400 text-xs">{w.sets} sets x {w.reps} reps</p>
                </div>
                <button onClick={() => setWorkouts(workouts.filter(x => x.id !== w.id))} className="text-gray-500">
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
