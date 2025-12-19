import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Activity, Zap, Trophy, LogOut, Trash2, Plus, 
  Dumbbell, Play, Pause, RotateCcw, Flame
} from 'lucide-react';

import { 
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, 
  CartesianGrid, Tooltip, PieChart, Pie, Cell 
} from 'recharts';

import ExerciseSelector from './ExerciseSelector';

const Dashboard = () => {
  const { currentUser, logout } = useAuth();
  const [workouts, setWorkouts] = useState([]);
  
  // Exercise states
  const [exercise, setExercise] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('strength');
  
  // Strength states
  const [sets, setSets] = useState('');
  const [reps, setReps] = useState('');
  const [weight, setWeight] = useState('');
  
  // Cardio/Flex states
  const [duration, setDuration] = useState('');
  const [distance, setDistance] = useState('');
  const [intensity, setIntensity] = useState('medium');
  
  // UI states
  const [showAddForm, setShowAddForm] = useState(true);
  const [restTimeLeft, setRestTimeLeft] = useState(90);
  const [isRestTimerActive, setIsRestTimerActive] = useState(false);

  // Load data
  useEffect(() => {
    const saved = localStorage.getItem(`workouts_${currentUser?.email}`);
    if (saved) setWorkouts(JSON.parse(saved));
  }, [currentUser]);

  // Save data
  useEffect(() => {
    if (currentUser?.email) {
      localStorage.setItem(`workouts_${currentUser.email}`, JSON.stringify(workouts));
    }
  }, [workouts, currentUser]);

  // Rest Timer logic
  useEffect(() => {
    let interval = null;
    if (isRestTimerActive && restTimeLeft > 0) {
      interval = setInterval(() => setRestTimeLeft(prev => prev - 1), 1000);
    } else if (restTimeLeft === 0) {
      setIsRestTimerActive(false);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRestTimerActive, restTimeLeft]);

  const categories = [
    { id: 'strength', name: 'Strength', icon: Dumbbell, color: 'text-blue-400', description: 'Weights & Reps' },
    { id: 'cardio', name: 'Cardio', icon: Zap, color: 'text-green-400', description: 'Heart & Endurance' },
    { id: 'flexibility', name: 'Flexibility', icon: Activity, color: 'text-purple-400', description: 'Stretching & Yoga' },
  ];

  const addWorkout = (e) => {
    e.preventDefault();
    if (!exercise) return;
    
    const workoutData = {
      id: Date.now(),
      date: new Date().toLocaleDateString(),
      exercise,
      category: selectedCategory,
      sets: sets || null,
      reps: reps || null,
      weight: weight || null,
      duration: duration || null,
      distance: distance || null,
      intensity
    };

    setWorkouts([workoutData, ...workouts]);
    resetForm();
    // Start rest timer automatically for strength
    if (selectedCategory === 'strength') {
        setRestTimeLeft(90);
        setIsRestTimerActive(true);
    }
  };

  const resetForm = () => {
    setExercise(''); setSets(''); setReps(''); setWeight('');
    setDuration(''); setDistance(''); setIntensity('medium');
  };

  // Chart Data: Grouping workouts by date
  const chartData = workouts.slice().reverse().map(w => ({
    name: w.date,
    value: w.weight || w.duration || 0
  }));

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8 bg-gray-800 p-6 rounded-2xl border border-gray-700">
          <div>
            <h1 className="text-2xl font-bold text-blue-500">Fitness Now</h1>
            <p className="text-gray-400 text-sm">Welcome back, {currentUser?.email?.split('@')[0]}</p>
          </div>
          <button onClick={logout} className="flex items-center gap-2 bg-red-500/10 text-red-500 px-4 py-2 rounded-lg hover:bg-red-500/20 transition-all">
            <LogOut size={18} /> Logout
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Form & Timer */}
          <div className="space-y-6">
            <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><Plus size={20}/> Log Activity</h2>
              
              <div className="grid grid-cols-3 gap-2 mb-6">
                {categories.map(cat => (
                  <button key={cat.id} onClick={() => setSelectedCategory(cat.id)}
                    className={`p-2 rounded-lg border text-center transition-all ${selectedCategory === cat.id ? 'border-blue-500 bg-blue-500/10' : 'border-gray-700'}`}>
                    <cat.icon size={20} className={`mx-auto mb-1 ${cat.color}`} />
                    <span className="text-[10px] uppercase font-bold">{cat.name}</span>
                  </button>
                ))}
              </div>

              <form onSubmit={addWorkout} className="space-y-4">
                <ExerciseSelector selectedCategory={selectedCategory} onExerciseSelect={setExercise} currentExercise={exercise} />
                
                {selectedCategory === 'strength' ? (
                  <div className="grid grid-cols-3 gap-2">
                    <input type="number" placeholder="Sets" value={sets} onChange={e=>setSets(e.target.value)} className="bg-gray-900 border border-gray-700 p-2 rounded text-sm" />
                    <input type="number" placeholder="Reps" value={reps} onChange={e=>setReps(e.target.value)} className="bg-gray-900 border border-gray-700 p-2 rounded text-sm" />
                    <input type="number" placeholder="Lbs" value={weight} onChange={e=>setWeight(e.target.value)} className="bg-gray-900 border border-gray-700 p-2 rounded text-sm" />
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <input type="number" placeholder="Mins" value={duration} onChange={e=>setDuration(e.target.value)} className="bg-gray-900 border border-gray-700 p-2 rounded text-sm" />
                    <input type="number" placeholder="Miles (opt)" value={distance} onChange={e=>setDistance(e.target.value)} className="bg-gray-900 border border-gray-700 p-2 rounded text-sm" />
                  </div>
                )}
                
                <button className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-xl font-bold transition-transform active:scale-95">Add to Log</button>
              </form>
            </div>

            {/* Rest Timer Widget */}
            <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 text-center">
              <h3 className="text-gray-400 text-xs font-bold uppercase mb-2">Rest Timer</h3>
              <div className="text-4xl font-mono font-bold text-blue-400 mb-4">
                {Math.floor(restTimeLeft / 60)}:{(restTimeLeft % 60).toString().padStart(2, '0')}
              </div>
              <div className="flex justify-center gap-4">
                <button onClick={() => setIsRestTimerActive(!isRestTimerActive)} className="p-2 bg-gray-700 rounded-full">
                  {isRestTimerActive ? <Pause size={20}/> : <Play size={20}/>}
                </button>
                <button onClick={() => {setRestTimeLeft(90); setIsRestTimerActive(false)}} className="p-2 bg-gray-700 rounded-full">
                  <RotateCcw size={20}/>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Charts & History */}
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {/* Line Chart */}
               <div className="bg-gray-800 p-4 rounded-2xl border border-gray-700 h-64">
                  <h3 className="text-sm font-bold mb-4">Progress Trend</h3>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="name" hide />
                      <YAxis stroke="#9CA3AF" fontSize={12} />
                      <Tooltip contentStyle={{backgroundColor: '#1F2937', border: 'none'}} />
                      <Line type="monotone" dataKey="value" stroke="#3B82F6" strokeWidth={3} dot={{r: 4}} />
                    </LineChart>
                  </ResponsiveContainer>
               </div>
               
               {/* Quick Stats */}
               <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-500/10 border border-blue-500/20 p-6 rounded-2xl text-center">
                    <Flame className="text-orange-500 mx-auto mb-2" size={24} />
                    <div className="text-2xl font-bold">{workouts.length}</div>
                    <div className="text-[10px] text-gray-400 uppercase">Workouts</div>
                  </div>
                  <div className="bg-purple-500/10 border border-purple-500/20 p-6 rounded-2xl text-center">
                    <Trophy className="text-yellow-500 mx-auto mb-2" size={24} />
                    <div className="text-2xl font-bold">Lvl 1</div>
                    <div className="text-[10px] text-gray-400 uppercase">Current Rank</div>
                  </div>
               </div>
            </div>

            {/* History List */}
            <div className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden">
              <div className="p-4 border-b border-gray-700 bg-gray-800/50 flex justify-between items-center">
                <h3 className="font-bold">Recent History</h3>
                <Activity size={18} className="text-gray-500" />
              </div>
              <div className="divide-y divide-gray-700 max-h-[400px] overflow-y-auto">
                {workouts.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">No workouts recorded yet.</div>
                ) : (
                  workouts.map(w => (
                    <div key={w.id} className="p-4 flex justify-between items-center hover:bg-gray-700/30 transition-colors">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono text-blue-400 bg-blue-400/10 px-2 py-0.5 rounded">{w.date}</span>
                          <span className="font-bold">{w.exercise}</span>
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          {w.category === 'strength' ? `${w.sets} sets × ${w.reps} reps @ ${w.weight} lbs` : `${w.duration} mins • ${w.intensity} intensity`}
                        </div>
                      </div>
                      <button onClick={() => setWorkouts(workouts.filter(item => item.id !== w.id))} className="text-gray-500 hover:text-red-500 p-2">
                        <Trash2 size={18} />
                      </button>
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
