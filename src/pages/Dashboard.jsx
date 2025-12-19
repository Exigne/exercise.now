import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Activity, Zap, Trophy, LogOut, Trash2, Plus, Calendar, TrendingUp, Target, 
  Clock, Award, Flame, Dumbbell, BarChart3, Play, Pause, RotateCcw, Bell, Loader2
} from 'lucide-react';

import { 
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, PieChart, Pie, Cell 
} from 'recharts';

import ExerciseSelector from '../components/ExerciseSelector';

const Dashboard = () => {
  const { currentUser, logout } = useAuth();
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Form states
  const [exercise, setExercise] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('strength');
  const [sets, setSets] = useState('');
  const [reps, setReps] = useState('');
  const [weight, setWeight] = useState('');
  const [duration, setDuration] = useState('');
  const [distance, setDistance] = useState('');
  const [intensity, setIntensity] = useState('medium');
  
  // UI states
  const [showAddForm, setShowAddForm] = useState(false);
  const [sortBy, setSortBy] = useState('date');
  const [showRestTimer, setShowRestTimer] = useState(false);
  const [restTime, setRestTime] = useState(90);
  const [isRestTimerActive, setIsRestTimerActive] = useState(false);
  const [restTimeLeft, setRestTimeLeft] = useState(90);

  const categories = [
    { id: 'strength', name: 'Strength', icon: Dumbbell, color: 'text-blue-400', description: 'Muscle building & power' },
    { id: 'cardio', name: 'Cardio', icon: Zap, color: 'text-green-400', description: 'Heart health & endurance' },
    { id: 'flexibility', name: 'Flexibility', icon: Activity, color: 'text-purple-400', description: 'Range of motion & recovery' },
  ];

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

  // --- DATA FETCHING ---
  useEffect(() => {
    const fetchWorkouts = async () => {
      if (!currentUser?.email) {
        setLoading(false);
        return;
      }
      try {
        setError(null);
        const response = await fetch(`/api/workouts?email=${currentUser.email}`);
        if (!response.ok) throw new Error(`Fetch failed: ${response.status}`);
        const data = await response.json();
        setWorkouts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchWorkouts();
  }, [currentUser]);

  // --- ACTIONS ---
  const addWorkout = async (e) => {
    e.preventDefault();
    if (!exercise || !currentUser?.email) return;

    const workoutData = {
      user_email: currentUser.email,
      exercise,
      category: selectedCategory,
      sets: sets ? parseInt(sets) : null,
      reps: reps ? parseInt(reps) : null,
      weight: weight ? parseFloat(weight) : null,
      duration: duration ? parseInt(duration) : null,
      distance: distance ? parseFloat(distance) : null,
      intensity: intensity || 'medium',
      created_at: new Date().toISOString()
    };

    try {
      const response = await fetch('/api/workouts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(workoutData),
      });

      if (response.ok) {
        const res = await fetch(`/api/workouts?email=${currentUser.email}`);
        const freshData = await res.json();
        setWorkouts(freshData);
        resetForm();
      }
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  const deleteWorkout = async (id) => {
    try {
      const response = await fetch('/api/workouts', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (response.ok) setWorkouts(workouts.filter(w => w.id !== id));
    } catch (err) {
      console.error("Delete failed");
    }
  };

  const resetForm = () => {
    setExercise(''); setSets(''); setReps(''); setWeight(''); setDuration(''); setDistance(''); setShowAddForm(false);
  };

  // --- ANALYTICS CALCULATIONS ---
  const getTotalVolume = () => workouts.reduce((t, w) => t + ((w.sets||0)*(w.reps||0)*(w.weight||0)), 0);
  
  const getVolumeData = () => {
    const volumeByDate = workouts.reduce((acc, w) => {
      const date = new Date(w.created_at).toLocaleDateString();
      acc[date] = (acc[date] || 0) + ((w.sets||0)*(w.reps||0)*(w.weight||1));
      return acc;
    }, {});
    return Object.entries(volumeByDate).map(([date, volume]) => ({ date, volume })).slice(-7);
  };

  const sortedWorkouts = [...workouts].sort((a, b) => {
    if (sortBy === 'date') return new Date(b.created_at) - new Date(a.created_at);
    if (sortBy === 'volume') return ((b.sets||0)*(b.reps||0)*(b.weight||0)) - ((a.sets||0)*(a.reps||0)*(a.weight||0));
    return a.exercise.localeCompare(b.exercise);
  });

  // Rest Timer Logic
  useEffect(() => {
    let interval = null;
    if (isRestTimerActive && restTimeLeft > 0) {
      interval = setInterval(() => setRestTimeLeft(prev => prev - 1), 1000);
    } else if (restTimeLeft === 0) {
      setIsRestTimerActive(false);
    }
    return () => clearInterval(interval);
  }, [isRestTimerActive, restTimeLeft]);

  if (loading) return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <Loader2 className="animate-spin text-blue-500" size={48} />
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER */}
        <div className="flex justify-between items-center mb-8 bg-gray-800/50 p-6 rounded-2xl border border-gray-700/50 backdrop-blur-md">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-lg"><Dumbbell size={24}/></div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">FitTrack Pro</h1>
              <p className="text-xs text-gray-400">{currentUser?.email}</p>
            </div>
          </div>
          <button onClick={logout} className="flex items-center space-x-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors">
            <LogOut size={16} /> <span className="text-sm">Logout</span>
          </button>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-blue-500/10 p-6 rounded-2xl border border-blue-500/30">
            <p className="text-blue-400 text-sm">Total Workouts</p>
            <p className="text-3xl font-bold">{workouts.length}</p>
          </div>
          <div className="bg-purple-500/10 p-6 rounded-2xl border border-purple-500/30">
            <p className="text-purple-400 text-sm">Total Volume</p>
            <p className="text-3xl font-bold">{getTotalVolume().toLocaleString()} lbs</p>
          </div>
          <div className="bg-orange-500/10 p-6 rounded-2xl border border-orange-500/30 text-center">
             <p className="text-orange-400 text-sm mb-1 uppercase font-bold tracking-wider">Rest Timer</p>
             <div className="text-3xl font-mono font-bold text-white">
               {Math.floor(restTimeLeft / 60)}:{(restTimeLeft % 60).toString().padStart(2, '0')}
             </div>
             <div className="flex justify-center gap-2 mt-2">
               <button onClick={() => setIsRestTimerActive(!isRestTimerActive)} className="p-1 bg-white/10 rounded-full hover:bg-white/20">
                 {isRestTimerActive ? <Pause size={18}/> : <Play size={18}/>}
               </button>
               <button onClick={() => {setRestTimeLeft(restTime); setIsRestTimerActive(false)}} className="p-1 bg-white/10 rounded-full hover:bg-white/20">
                 <RotateCcw size={18}/>
               </button>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT COLUMN: FORM & CHART */}
          <div className="space-y-8">
            <div className="bg-gray-800/50 p-6 rounded-2xl border border-gray-700/50">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Log Workout</h2>
                <button onClick={() => setShowAddForm(!showAddForm)} className="p-2 bg-blue-500/20 rounded-lg text-blue-400"><Plus size={20}/></button>
              </div>
              
              {showAddForm && (
                <form onSubmit={addWorkout} className="space-y-4">
                  <div className="grid grid-cols-3 gap-2">
                    {categories.map(c => (
                      <button key={c.id} type="button" onClick={() => setSelectedCategory(c.id)} className={`p-2 rounded-lg border text-center transition-all ${selectedCategory === c.id ? 'border-blue-500 bg-blue-500/20' : 'border-gray-700 hover:border-gray-600'}`}>
                        <c.icon size={16} className={`mx-auto mb-1 ${c.color}`}/><span className="text-[10px] uppercase font-bold">{c.name}</span>
                      </button>
                    ))}
                  </div>
                  <ExerciseSelector selectedCategory={selectedCategory} onExerciseSelect={setExercise} currentExercise={exercise} />
                  <div className="grid grid-cols-3 gap-2">
                    <input type="number" placeholder="Sets" value={sets} onChange={e=>setSets(e.target.value)} className="bg-gray-900 border border-gray-700 p-2 rounded-lg text-sm focus:border-blue-500 outline-none" />
                    <input type="number" placeholder="Reps" value={reps} onChange={e=>setReps(e.target.value)} className="bg-gray-900 border border-gray-700 p-2 rounded-lg text-sm focus:border-blue-500 outline-none" />
                    <input type="number" placeholder="Lbs" value={weight} onChange={e=>setWeight(e.target.value)} className="bg-gray-900 border border-gray-700 p-2 rounded-lg text-sm focus:border-blue-500 outline-none" />
                  </div>
                  <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-xl font-bold transition-all shadow-lg shadow-blue-900/20">Add Workout</button>
                </form>
              )}
            </div>

            <div className="bg-gray-800/50 p-6 rounded-2xl border border-gray-700/50 h-64">
              <h3 className="font-bold mb-4 flex items-center gap-2"><TrendingUp size={18} className="text-blue-400"/> Volume Trend</h3>
              <ResponsiveContainer width="100%" height="80%">
                <LineChart data={getVolumeData()}>
                  <CartesianGrid stroke="#374151" strokeDasharray="3 3" vertical={false}/>
                  <XAxis dataKey="date" hide/>
                  <YAxis hide/>
                  <Tooltip contentStyle={{backgroundColor: '#1F2937', border: '1px solid #374151'}}/>
                  <Line type="monotone" dataKey="volume" stroke="#3B82F6" strokeWidth={3} dot={false}/>
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* RIGHT COLUMN: HISTORY */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800/50 p-6 rounded-2xl border border-gray-700/50 backdrop-blur-md">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Recent History</h2>
                <select value={sortBy} onChange={e=>setSortBy(e.target.value)} className="bg-gray-900 border border-gray-700 p-2 rounded-lg text-sm outline-none">
                  <option value="date">Sort by Date</option>
                  <option value="volume">Sort by Volume</option>
                  <option value="exercise">Sort by Name</option>
                </select>
              </div>
              
              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                {sortedWorkouts.length === 0 ? (
                  <div className="text-center py-10 text-gray-500">No workouts recorded yet.</div>
                ) : (
                  sortedWorkouts.map(w => (
                    <div key={w.id} className="bg-gray-900/50 p-4 rounded-xl border border-gray-700/50 flex justify-between items-center group hover:border-gray-500 transition-all">
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-gray-800 rounded-lg">
                          <Dumbbell size={20} className="text-blue-400"/>
                        </div>
                        <div>
                          <h4 className="font-bold text-white">{w.exercise}</h4>
                          <div className="flex gap-3 text-xs text-gray-400">
                            <span>{w.sets} sets × {w.reps} reps</span>
                            {w.weight && <span>@ {w.weight} lbs</span>}
                            <span className="text-gray-600">{new Date(w.created_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-[10px] uppercase text-gray-500 font-bold">Volume</p>
                          <p className="font-mono font-bold text-blue-400 text-sm">
                            {((w.sets||0)*(w.reps||0)*(w.weight||0)).toLocaleString()}
                          </p>
                        </div>
                        <button onClick={() => deleteWorkout(w.id)} className="text-gray-600 hover:text-red-500 p-2 hover:bg-red-500/10 rounded-lg transition-all opacity-0 group-hover:opacity-100">
                          <Trash2 size={18}/>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
