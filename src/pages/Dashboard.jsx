import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Activity, Zap, Trophy, LogOut, Plus, Trash2 } from 'lucide-react';

const Dashboard = () => {
  const { currentUser, logout } = useAuth();
  const [workouts, setWorkouts] = useState([]);
  const [exercise, setEx] = useState('');
  const [sets, setS] = useState('');
  const [reps, setR] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem(`workouts_${currentUser?.email}`);
    if (saved) setWorkouts(JSON.parse(saved));
  }, [currentUser]);

  useEffect(() => {
    if (currentUser?.email) localStorage.setItem(`workouts_${currentUser.email}`, JSON.stringify(workouts));
  }, [workouts, currentUser]);

  const add = (e) => {
    e.preventDefault();
    if (!exercise || !sets || !reps) return;
    setWorkouts([{ id: Date.now(), date: new Date().toLocaleDateString(), exercise, sets, reps }, ...workouts]);
    setEx(''); setS(''); setR('');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div><h1 className="text-xl font-bold text-blue-500">Fitness Now</h1><p className="text-xs text-gray-400">{currentUser?.email}</p></div>
          <button onClick={logout} className="text-red-500"><LogOut size={20} /></button>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-gray-800 p-5 rounded-2xl border border-gray-700 h-fit">
            <h2 className="font-bold mb-4 flex items-center gap-2"><Plus size={18}/> Log</h2>
            <form onSubmit={add} className="space-y-3">
              <input className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2 text-sm" placeholder="Exercise" value={exercise} onChange={e=>setEx(e.target.value)} />
              <div className="flex gap-2">
                <input type="number" className="w-1/2 bg-gray-900 border border-gray-700 rounded-lg p-2 text-sm" placeholder="Sets" value={sets} onChange={e=>setS(e.target.value)} />
                <input type="number" className="w-1/2 bg-gray-900 border border-gray-700 rounded-lg p-2 text-sm" placeholder="Reps" value={reps} onChange={e=>setR(e.target.value)} />
              </div>
              <button className="w-full bg-blue-600 p-2 rounded-lg font-bold text-sm hover:bg-blue-700">Add</button>
            </form>
          </div>
          <div className="md:col-span-2 space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-gray-800 p-3 rounded-xl border border-gray-700 text-center"><Activity className="mx-auto text-blue-500 mb-1" size={16}/><p className="font-bold">{workouts.length}</p><p className="text-[10px] text-gray-500 uppercase">Workouts</p></div>
              <div className="bg-gray-800 p-3 rounded-xl border border-gray-700 text-center"><Zap className="mx-auto text-yellow-500 mb-1" size={16}/><p className="font-bold">1</p><p className="text-[10px] text-gray-500 uppercase">Streak</p></div>
              <div className="bg-gray-800 p-3 rounded-xl border border-gray-700 text-center"><Trophy className="mx-auto text-green-500 mb-1" size={16}/><p className="font-bold">100</p><p className="text-[10px] text-gray-500 uppercase">XP</p></div>
            </div>
            <div className="space-y-2">
              {workouts.map(w => (
                <div key={w.id} className="
