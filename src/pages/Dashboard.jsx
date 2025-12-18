import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Activity, Zap, Trophy, LogOut, Plus, Trash2 } from 'lucide-react';

const Dashboard = () => {
  const { currentUser, logout } = useAuth();
  const [workouts, setW] = useState([]);
  const [ex, setEx] = useState('');
  const [s, setS] = useState('');
  const [r, setR] = useState('');

  useEffect(() => {
    const d = localStorage.getItem(`workouts_${currentUser?.email}`);
    if (d) setW(JSON.parse(d));
  }, [currentUser]);

  useEffect(() => {
    if (currentUser?.email) localStorage.setItem(`workouts_${currentUser.email}`, JSON.stringify(workouts));
  }, [workouts, currentUser]);

  const add = (e) => {
    e.preventDefault();
    if (!ex || !s || !r) return;
    setW([{ id: Date.now(), date: new Date().toLocaleDateString(), ex, s, r }, ...workouts]);
    setEx(''); setS(''); setR('');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-bold text-blue-500">Fitness Now</h1>
          <button onClick={logout} className="text-red-500"><LogOut size={20} /></button>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-gray-800 p-5 rounded-2xl border border-gray-700">
            <form onSubmit={add} className="space-y-3">
              <input className="w-full bg-gray-900 border border-gray-700 rounded p-2" placeholder="Exercise" value={ex} onChange={e=>setEx(e.target.value)} />
              <input className="w-full bg-gray-900 border border-gray-700 rounded p-2" placeholder="Sets" value={s} onChange={e=>setS(e.target.value)} />
              <input className="w-full bg-gray-900 border border-gray-700 rounded p-2" placeholder="Reps" value={r} onChange={e=>setR(e.target.value)} />
              <button className="w-full bg-blue-600 p-2 rounded font-bold">Add Workout</button>
            </form>
          </div>
          <div className="md:col-span-2 space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-gray-800 p-3 rounded-xl border border-gray-700 text-center"><Activity size={16} className="mx-auto"/><p>{workouts.length}</p></div>
              <div className="bg-gray-800 p-3 rounded-xl border border-gray-700 text-center"><Zap size={16} className="mx-auto"/><p>1</p></div>
              <div className="bg-gray-800 p-3 rounded-xl border border-gray-700 text-center"><Trophy size={16} className="mx-auto"/><p>100</p></div>
            </div>
            {workouts.map(w => (
              <div key={w.id} className="bg-gray-800 p-3 rounded-xl border border-gray-700 flex justify-between">
                <div><p className="text-blue-400 text-xs">{w.date}</p><p className="font-bold">{w.ex}</p><p className="text-gray-400 text-xs">{w.s} sets x {w.r} reps</p></div>
                <button onClick={() => setW(workouts.filter(x => x.id !== w.id))} className="text-gray-500"><Trash2 size={16} /></button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Dashboard;
