import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Activity, Zap, Trophy, LogOut, Trash2, Plus, Calendar, TrendingUp, Target, 
  Clock, Award, Flame, Dumbbell, BarChart3, Play, Pause, RotateCcw, Bell, Loader2,
  ChevronRight
} from 'lucide-react';

import { 
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, AreaChart, Area
} from 'recharts';

import ExerciseSelector from '../components/ExerciseSelector';

const Dashboard = () => {
  const { currentUser, logout } = useAuth();
  
  // Data States
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Form States
  const [exercise, setExercise] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('strength');
  const [sets, setSets] = useState('');
  const [reps, setReps] = useState('');
  const [weight, setWeight] = useState('');
  const [intensity, setIntensity] = useState('medium');
  
  // UI States
  const [showAddForm, setShowAddForm] = useState(false);
  const [sortBy, setSortBy] = useState('date');
  
  // Rest Timer States
  const [restTime, setRestTime] = useState(90);
  const [isRestTimerActive, setIsRestTimerActive] = useState(false);
  const [restTimeLeft, setRestTimeLeft] = useState(90);

  const categories = [
    { id: 'strength', name: 'Strength', icon: Dumbbell, color: 'text-blue-400' },
    { id: 'cardio', name: 'Cardio', icon: Zap, color: 'text-green-400' },
    { id: 'flexibility', name: 'Flexibility', icon: Activity, color: 'text-purple-400' },
  ];

  // --- INITIAL FETCH ---
  useEffect(() => {
    const fetchWorkouts = async () => {
      if (!currentUser?.email) return;
      try {
        setLoading(true);
        const response = await fetch(`/api/workouts?email=${currentUser.email}`);
        if (!response.ok) throw new Error('Failed to fetch workouts');
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

  // --- REST TIMER LOGIC ---
  useEffect(() => {
    let interval = null;
    if (isRestTimerActive && restTimeLeft > 0) {
      interval = setInterval(() => setRestTimeLeft(prev => prev - 1), 1000);
    } else if (restTimeLeft === 0) {
      setIsRestTimerActive(false);
      // Optional: Play a sound here
    }
    return () => clearInterval(interval);
  }, [isRestTimerActive, restTimeLeft]);

  // --- ACTIONS ---
  const addWorkout = async (e) => {
    e.preventDefault();
    if (!exercise || !currentUser?.email) return;

    const workoutData = {
      id: Date.now(), // Temporary ID for list rendering
      user_email: currentUser.email,
      exercise,
      category: selectedCategory,
      sets: sets ? parseInt(sets) : 0,
      reps: reps ? parseInt(reps) : 0,
      weight: weight ? parseFloat(weight) : 0,
      intensity,
      created_at: new Date().toISOString()
    };

    // 1. Optimistic Update (Show instantly)
    setWorkouts(prev => [workoutData, ...prev]);
    const originalWorkouts = [...workouts]; // Backup for rollback
    resetForm();

    try {
      // 2. Database Sync
      const response = await fetch('/api/workouts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(workoutData),
      });

      if (!response.ok) throw new Error('Failed to save');
      
      // 3. Re-fetch to get real DB IDs
      const res = await fetch(`/api/workouts?email=${currentUser.email}`);
      const freshData = await res.json();
      setWorkouts(freshData);

    } catch (err) {
      setWorkouts(originalWorkouts); // Rollback on error
      alert("Error saving workout. Please try again.");
    }
  };

  const deleteWorkout = async (id) => {
    try {
      const response = await fetch('/api/workouts', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (response.ok) {
        setWorkouts(prev => prev.filter(w => w.id !== id));
      }
    } catch (err) {
      console.error("Delete failed");
    }
  };

  const resetForm = () => {
    setExercise(''); setSets(''); setReps(''); setWeight('');
    setShowAddForm(false);
  };

  // --- ANALYTICS ---
  const totalVolume = workouts.reduce((acc, w) => acc + ((w.sets||0)*(w.reps||0)*(w.weight||0)), 0);
  
  const getChartData = () => {
    const last7Days = [...Array(7)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toLocaleDateString();
    }).reverse();

    return last7Days.map(date => {
      const dayVolume = workouts
        .filter(w => new Date(w.created_at).toLocaleDateString() === date)
        .reduce((sum, w) => sum + ((w.sets||0)*(w.reps||0)*(w.weight||0)), 0);
      return { date: date.split('/')[0] + '/' + date.split('/')[1], volume: dayVolume };
    });
  };

  const sortedWorkouts = [...workouts].sort((a, b) => {
    if (sortBy === 'date') return new Date(b.created_at) - new Date(a.created_at);
    return a.exercise.localeCompare(b.exercise);
  });

  if (loading) return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="animate-spin text-blue-500 mx-auto mb-4" size={48} />
        <p className="text-gray-400 animate-pulse">Syncing your progress...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-4 lg:p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* TOP NAVIGATION / HEADER */}
        <header className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 bg-gray-800/40 p-6 rounded-3xl border border-gray-700/50 backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Dumbbell size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight">WORKOUT<span className="text-blue-500">PRO</span></h1>
              <p className="text-xs text-gray-400 font-medium uppercase tracking-widest">{currentUser?.email?.split('@')[0]}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={logout} className="p-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl transition-all border border-red-500/20">
              <LogOut size={20} />
            </button>
          </div>
        </header>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT SIDE: STATS & TOOLS (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* STAT CARDS */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-800/40 p-5 rounded-3xl border border-gray-700/50">
                <p className="text-gray-400 text-xs font-bold uppercase mb-1">Workouts</p>
                <p className="text-2xl font-black">{workouts.length}</p>
              </div>
              <div className="bg-gray-800/40 p-5 rounded-3xl border border-gray-700/50">
                <p className="text-gray-400 text-xs font-bold uppercase mb-1">Volume</p>
                <p className="text-2xl font-black text-blue-400">{(totalVolume/1000).toFixed(1)}k</p>
              </div>
            </div>

            {/* REST TIMER TOOL */}
            <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 p-6 rounded-3xl border border-blue-500/20 shadow-xl">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2 text-orange-400">
                  <Clock size={18} />
                  <span className="text-xs font-bold uppercase tracking-wider">Rest Timer</span>
                </div>
                <span className="text-[10px] bg-orange-500/20 text-orange-400 px-2 py-1 rounded-full font-bold">ACTIVE</span>
              </div>
              <div className="text-5xl font-mono font-black text-center mb-6 tracking-tighter">
                {Math.floor(restTimeLeft / 60)}:{(restTimeLeft % 60).toString().padStart(2, '0')}
              </div>
              <div className="flex justify-center gap-3">
                <button 
                  onClick={() => setIsRestTimerActive(!isRestTimerActive)}
                  className={`flex-1 py-3 rounded-2xl font-bold transition-all flex justify-center items-center gap-2 ${isRestTimerActive ? 'bg-gray-700' : 'bg-orange-500 shadow-lg shadow-orange-500/20'}`}
                >
                  {isRestTimerActive ? <Pause size={20}/> : <Play size={20}/>}
                  {isRestTimerActive ? 'Pause' : 'Start'}
                </button>
                <button onClick={() => {setRestTimeLeft(restTime); setIsRestTimerActive(false)}} className="p-3 bg-gray-700 rounded-2xl hover:bg-gray-600 transition-all">
                  <RotateCcw size={20}/>
                </button>
              </div>
            </div>

            {/* ADD WORKOUT FORM */}
            <div className="bg-gray-800/40 p-6 rounded-3xl border border-gray-700/50">
              <button 
                onClick={() => setShowAddForm(!showAddForm)}
                className="w-full flex justify-between items-center text-lg font-bold mb-2"
              >
                Log Session {showAddForm ? <ChevronRight className="rotate-90"/> : <Plus/>}
              </button>
              
              {showAddForm && (
                <form onSubmit={addWorkout} className="space-y-4 mt-4 animate-in fade-in slide-in-from-top-2">
                  <div className="flex gap-2 p-1 bg-gray-900/50 rounded-2xl">
                    {categories.map(c => (
                      <button 
                        key={c.id} type="button" 
                        onClick={() => setSelectedCategory(c.id)}
                        className={`flex-1 flex flex-col items-center py-2 rounded-xl transition-all ${selectedCategory === c.id ? 'bg-gray-700 shadow-inner' : 'opacity-50 hover:opacity-100'}`}
                      >
                        <c.icon size={16} className={c.color}/>
                        <span className="text-[10px] mt-1 font-bold uppercase">{c.name}</span>
                      </button>
                    ))}
                  </div>

                  <ExerciseSelector 
                    selectedCategory={selectedCategory} 
                    onExerciseSelect={setExercise} 
                    currentExercise={exercise} 
                  />

                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-500 uppercase ml-1">Sets</label>
                      <input type="number" value={sets} onChange={e=>setSets(e.target.value)} placeholder="0" className="w-full bg-gray-900 border border-gray-700 rounded-xl p-3 focus:border-blue-500 outline-none transition-all" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-500 uppercase ml-1">Reps</label>
                      <input type="number" value={reps} onChange={e=>setReps(e.target.value)} placeholder="0" className="w-full bg-gray-900 border border-gray-700 rounded-xl p-3 focus:border-blue-500 outline-none transition-all" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-500 uppercase ml-1">Lbs</label>
                      <input type="number" value={weight} onChange={e=>setWeight(e.target.value)} placeholder="0" className="w-full bg-gray-900 border border-gray-700 rounded-xl p-3 focus:border-blue-500 outline-none transition-all" />
                    </div>
                  </div>

                  <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-xl shadow-blue-600/20 active:scale-95">
                    Save Workout
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* RIGHT SIDE: HISTORY & CHARTS (8 cols) */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* PROGRESS CHART */}
            <div className="bg-gray-800/40 p-6 rounded-3xl border border-gray-700/50 backdrop-blur-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold flex items-center gap-2">
                  <TrendingUp size={18} className="text-blue-400"/>
                  Weekly Volume (lbs)
                </h3>
              </div>
              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={getChartData()}>
                    <defs>
                      <linearGradient id="colorVol" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" />
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 10}} />
                    <Tooltip 
                      contentStyle={{backgroundColor: '#111827', borderRadius: '12px', border: '1px solid #374151'}}
                      itemStyle={{color: '#3B82F6', fontWeight: 'bold'}}
                    />
                    <Area type="monotone" dataKey="volume" stroke="#3B82F6" strokeWidth={3} fillOpacity={1} fill="url(#colorVol)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* RECENT HISTORY LIST */}
            <div className="bg-gray-800/40 rounded-3xl border border-gray-700/50 overflow-hidden">
              <div className="p-6 border-b border-gray-700/50 flex justify-between items-center">
                <h3 className="font-bold">Activity History</h3>
                <select 
                  value={sortBy} 
                  onChange={e => setSortBy(e.target.value)}
                  className="bg-gray-900 text-xs font-bold border-none rounded-lg p-2 outline-none focus:ring-1 ring-blue-500"
                >
                  <option value="date">Newest First</option>
                  <option value="exercise">Exercise A-Z</option>
                </select>
              </div>

              <div className="divide-y divide-gray-700/30 max-h-[500px] overflow-y-auto custom-scrollbar">
                {sortedWorkouts.length === 0 ? (
                  <div className="p-20 text-center text-gray-500 flex flex-col items-center gap-2">
                    <div className="p-4 bg-gray-700/20 rounded-full"><BarChart3 size={32}/></div>
                    <p className="font-medium">No sessions logged yet</p>
                  </div>
                ) : (
                  sortedWorkouts.map((w) => (
                    <div key={w.id} className="p-5 flex items-center justify-between hover:bg-white/5 transition-all group">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-2xl ${
                          w.category === 'strength' ? 'bg-blue-500/10 text-blue-400' : 
                          w.category === 'cardio' ? 'bg-green-500/10 text-green-400' : 
                          'bg-purple-500/10 text-purple-400'
                        }`}>
                          <Dumbbell size={20}/>
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-100 uppercase tracking-tight text-sm">{w.exercise}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs font-mono text-gray-400 bg-gray-900 px-2 py-0.5 rounded-md">
                              {w.sets}×{w.reps} @ {w.weight}lb
                            </span>
                            <span className="text-[10px] text-gray-500 flex items-center gap-1">
                              <Calendar size={10}/> {new Date(w.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="text-right hidden sm:block">
                          <p className="text-[10px] font-bold text-gray-500 uppercase">Volume</p>
                          <p className="font-mono text-blue-400 font-bold">{(w.sets * w.reps * w.weight).toLocaleString()}</p>
                        </div>
                        <button 
                          onClick={() => deleteWorkout(w.id)}
                          className="p-2 text-gray-600 hover:text-red-500 hover:bg-red-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-all"
                        >
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
