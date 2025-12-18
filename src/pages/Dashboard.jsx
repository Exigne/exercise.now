import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Activity, Zap, Trophy, LogOut, Plus, Trash2 } from 'lucide-react';

const Dashboard = () => {
  const { currentUser, logout } = useAuth();
  const [workouts, setWorkouts] = useState([]);
  const [exercise, setExercise] = useState('');
  const [sets, setSets] = useState('');
  const [reps, setReps] = useState('');

  // Load workouts from local storage on startup
  useEffect(() => {
    if (currentUser?.email) {
      const saved = localStorage.getItem(`workouts_${currentUser.email}`);
      if (saved) setWorkouts(JSON.parse(saved));
    }
  }, [currentUser]);

  // Save workouts whenever the list changes
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
    setExercise(''); setSets(''); setReps('');
  };

  const deleteWorkout = (id) => {
    setWorkouts(workouts.filter(w => w.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-2xl font-bold text-blue-500">Fitness Now</h1>
            <p className="text-gray-400 text-sm">{currentUser?.email}</p>
          </div>
          <button onClick={logout} className="p-2 hover:bg-red-900/20 rounded-lg text-red-500 transition-colors">
            <LogOut size={24} />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Form */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 p-6 rounded-3xl border border-gray-700 shadow-xl">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Plus className="text-blue-500" /> Log Workout
              </h2>
              <form onSubmit={addWorkout} className="space-y-4">
                <input 
                  type="text" placeholder="Exercise name"
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl p-3 outline-none focus:border-blue-500"
                  value={exercise} onChange={(e) => setExercise(e.target.value)}
                />
                <div className="grid grid-cols-2 gap-4">
                  <input 
                    type="number" placeholder="Sets"
                    className="w-full bg-gray-900 border border-gray-700 rounded-xl p-3 outline-none"
                    value={sets} onChange={(e) => setSets(e.target.value)}
                  />
                  <input 
                    type="number" placeholder="Reps"
                    className="w-full bg-gray-900 border border-gray-700 rounded-xl p-3 outline-none"
                    value={reps} onChange={(e) => setReps(e.target.value)}
                  />
                </div>
                <button type="submit" className="w-full py-3 bg-blue-600 rounded-xl font-bold hover:bg-blue-700 transition-all">
                  Add Workout
                </button>
              </form>
            </div>
          </div>

          {/* Right Column: Stats & History */}
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gray-800 p-4 rounded-2xl border border-gray-700 text-center">
                <Activity className="mx-auto mb-1 text-blue-500" size={20} />
                <p className="text-xl font-bold">{workouts.length}</p>
                <p className="text-[10px] text-gray-500 uppercase tracking-tighter">Total</p>
              </div>
              <div className="bg-gray-800 p-4 rounded-2xl border border-gray-700 text-center">
                <Zap className="mx-auto mb-1 text-yellow-500" size={20} />
                <p className="text-xl font-bold">1</p>
                <p className="text-[10px] text-gray-500 uppercase tracking-tighter">Streak</p>
              </div>
              <div className="bg-gray-800 p-4 rounded-2xl border border-gray-700 text-center">
                <Trophy className="mx-auto mb-1 text-green-500" size={20} />
                <p className="text-xl font-bold">100</p>
                <p className="text-[10px] text-gray-500 uppercase tracking-tighter">Level</
