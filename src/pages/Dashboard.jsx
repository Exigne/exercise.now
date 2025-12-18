import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Activity, Zap, Trophy, LogOut, Plus, Trash2 } from 'lucide-react';

const Dashboard = () => {
  const { currentUser, logout } = useAuth();
  const [workouts, setWorkouts] = useState([]);
  const [exercise, setExercise] = useState('');
  const [sets, setSets] = useState('');
  const [reps, setReps] = useState('');

  useEffect(() => {
    if (currentUser?.email) {
      const saved = localStorage.getItem(`workouts_${currentUser.email}`);
      if (saved) setWorkouts(JSON.parse(saved));
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser?.email) {
      localStorage.setItem(`workouts_${currentUser.email}`, JSON.stringify(workouts));
    }
  }, [workouts, currentUser]);

  const addWorkout = (e) => {
    e.preventDefault();
    if (!exercise || !sets || !reps) return;
    const item = { id: Date.now(), date: new Date().toLocaleDateString(), exercise, sets, reps };
    setWorkouts([item, ...workouts]);
    setExercise(''); setSets(''); setReps('');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div><h1 className="text-xl font-bold text-blue-500">Fitness Now</h1><p className="text-xs text-gray-400">{currentUser?.email}</p></div>
          <button onClick={logout} className="p-2 text-red-500"><LogOut size={20} /></button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 bg-gray-800 p-5 rounded-2xl border border-gray-700 h-fit">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><Plus size={18}/> Log</h2>
            <form onSubmit={addWorkout} className="space-y-3">
              <input className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2 text-sm" placeholder="Exercise" value={exercise}
