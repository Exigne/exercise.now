// NEW IMPORTS
import ExerciseSelector from './ExerciseSelector';
import { exerciseDatabase } from '../data/exercises';import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Activity, 
  Zap, 
  Trophy, 
  LogOut, 
  Trash2, 
  Plus, 
  Calendar,
  TrendingUp,
  Target,
  Clock,
  Award,
  Flame,
  Dumbbell,
  BarChart3,
  Play,
  Pause,
  RotateCcw,
  Bell
} from 'lucide-react';

// Import chart components from recharts
import { 
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell
} from 'recharts';

// NEW IMPORTS
import ExerciseSelector from './ExerciseSelector';
import { exerciseDatabase } from '../data/exercises';

const Dashboard = () => {
  const { currentUser, logout } = useAuth();
  const [workouts, setWorkouts] = useState([]);
  
  // Exercise selection states
  const [exercise, setExercise] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('strength');
  
  // Strength training states
  const [sets, setSets] = useState('');
  const [reps, setReps] = useState('');
  const [weight, setWeight] = useState('');
  
  // Cardio states
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
  const [newPRs, setNewPRs] = useState([]);

  // Updated categories
  const categories = [
    { 
      id: 'strength', 
      name: 'Strength', 
      icon: Dumbbell, 
      color: 'text-blue-400',
      description: 'Muscle building & power'
    },
    { 
      id: 'cardio', 
      name: 'Cardio', 
      icon: Zap, 
      color: 'text-green-400',
      description: 'Heart health & endurance'
    },
    { 
      id: 'flexibility', 
      name: 'Flexibility', 
      icon: Activity, 
      color: 'text-purple-400',
      description: 'Range of motion & recovery'
    },
  ];

  // Muscle groups for analytics
  const muscleGroups = {
    'Chest': ['bench press', 'push ups', 'dips', 'flyes', 'chest', 'press'],
    'Back': ['pull ups', 'rows', 'deadlifts', 'lat pulldown', 'back', 'pull'],
    'Legs': ['squats', 'lunges', 'leg press', 'calf raises', 'legs', 'squat'],
    'Shoulders': ['shoulder press', 'lateral raises', 'front raises', 'shoulders'],
    'Arms': ['bicep curls', 'tricep extensions', 'hammer curls', 'arms', 'curls'],
    'Core': ['planks', 'crunches', 'sit ups', 'russian twists', 'core', 'plank']
  };

  // Rest Timer Logic
  useEffect(() => {
    let interval = null;
    
    if (isRestTimerActive && restTimeLeft > 0) {
      interval = setInterval(() => {
        setRestTimeLeft(restTimeLeft => restTimeLeft - 1);
      }, 1000);
    } else if (restTimeLeft === 0) {
      setIsRestTimerActive(false);
      // Play notification sound
      new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmFgU7k9n1unEiBC13yO/eizEIHWq+8+OWT').play().catch(() => {});
    }
    
    return () => clearInterval(interval);
  }, [isRestTimerActive, restTimeLeft]);

  // Personal Records Logic
  useEffect(() => {
    const records = {};
    const newPersonalRecords = [];

    workouts.forEach(workout => {
      const { exercise, weight, reps, sets } = workout;
      const volume = weight * reps * sets;
      
      if (!records[exercise]) {
        records[exercise] = {
          maxWeight: weight || 0,
          maxReps: reps,
          maxSets: sets,
          maxVolume: volume,
          totalWorkouts: 1
        };
      } else {
        const current = records[exercise];
        let isNewPR = false;
        
        if ((weight || 0) > current.maxWeight) {
          current.maxWeight = weight;
          isNewPR = true;
        }
        if (reps > current.maxReps) {
          current.maxReps = reps;
          isNewPR = true;
        }
        if (sets > current.maxSets) {
          current.maxSets = sets;
          isNewPR = true;
        }
        if (volume > current.maxVolume) {
          current.maxVolume = volume;
          isNewPR = true;
        }
        
        current.totalWorkouts += 1;
        
        if (isNewPR) {
          newPersonalRecords.push({
            exercise,
            type: 'PR',
            value: Math.max(weight || 0, reps, sets, volume),
            date: workout.date
          });
        }
      }
    });

    setNewPRs(newPersonalRecords.slice(-3)); // Show last 3 PRs
  }, [workouts]);

  // Data loading effects
  useEffect(() => {
    const data = localStorage.getItem(`workouts_${currentUser?.email}`);
    if (data) setWorkouts(JSON.parse(data));
  }, [currentUser]);

  useEffect(() => {
    if (currentUser?.email) {
      localStorage.setItem(`workouts_${currentUser.email}`, JSON.stringify(workouts));
    }
  }, [workouts, currentUser]);

  // Enhanced addWorkout function
  const addWorkout = (e) => {
    e.preventDefault();
    if (!exercise) return;
    
    let workoutData = {
      id: Date.now(),
      date: new Date().toLocaleDateString(),
      exercise,
      category: selectedCategory,
      timestamp: new Date().toISOString()
    };

    // Handle different exercise types
    if (selectedCategory === 'strength') {
      if (!sets || !reps) return;
      workoutData = {
        ...workoutData,
        sets: parseInt(sets),
        reps: parseInt(reps),
        weight: weight ? parseInt(weight) : null,
        type: 'strength'
      };
    } else if (selectedCategory === 'cardio') {
      if (!duration) return;
      workoutData = {
        ...workoutData,
        duration: parseInt(duration),
        distance: distance ? parseFloat(distance) : null,
        intensity: intensity,
        type: 'cardio'
      };
    } else if (selectedCategory === 'flexibility') {
      if (!duration) return;
      workoutData = {
        ...workoutData,
        duration: parseInt(duration),
        intensity: intensity,
        type: 'flexibility'
      };
    }
    
    setWorkouts([workoutData, ...workouts]);
    resetForm();
  };

  const resetForm = () => {
    setExercise('');
    setSets('');
    setReps('');
    setWeight('');
    setDuration('');
    setDistance('');
    setIntensity('medium');
    setShowAddForm(false);
  };

  const deleteWorkout = (id) => {
    setWorkouts(workouts.filter(w => w.id !== id));
  };

  // Stats functions
  const getTotalWorkouts = () => workouts.length;
  const getThisWeekWorkouts = () => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return workouts.filter(w => new Date(w.timestamp) >= weekAgo).length;
  };

  const getTotalVolume = () => {
    return workouts.reduce((total, w) => {
      return total + (w.sets * w.reps * (w.weight || 0));
    }, 0);
  };

  const getStreak = () => {
    if (workouts.length === 0) return 0;
    const sorted = [...workouts].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    let streak = 0;
    let currentDate = new Date();
    
    for (let workout of sorted) {
      const workoutDate = new Date(workout.timestamp);
      const diffDays = Math.floor((currentDate - workoutDate) / (1000 * 60 * 60 * 24));
      
      if (diffDays === streak) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  };

  // Analytics Data
  const getVolumeData = () => {
    const volumeByDate = workouts.reduce((acc, workout) => {
      const date = workout.date;
      const volume = workout.sets * workout.reps * (workout.weight || 1);
      
      if (acc[date]) {
        acc[date] += volume;
      } else {
        acc[date] = volume;
      }
      return acc;
    }, {});

    return Object.entries(volumeByDate)
      .map(([date, volume]) => ({ date, volume }))
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(-30);
  };

  const getMuscleGroupData = () => {
    const groupCounts = {};
    
    workouts.forEach(workout => {
      const exercise = workout.exercise.toLowerCase();
      let found = false;
      
      for (const [group, exercises] of Object.entries(muscleGroups)) {
        if (exercises.some(ex => exercise.includes(ex))) {
          groupCounts[group] = (groupCounts[group] || 0) + 1;
          found = true;
          break;
        }
      }
      
      if (!found) {
        groupCounts['Other'] = (groupCounts['Other'] || 0) + 1;
      }
    });

    return Object.entries(groupCounts).map(([name, value]) => ({
      name,
      value
    }));
  };

  const sortedWorkouts = [...workouts].sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return new Date(b.timestamp) - new Date(a.timestamp);
      case 'exercise':
        return a.exercise.localeCompare(b.exercise);
      case 'volume':
        return (b.sets * b.reps * (b.weight || 0)) - (a.sets * a.reps * (a.weight || 0));
      default:
        return 0;
    }
  });

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

  // Rest Timer Functions
  const toggleRestTimer = () => {
    setIsRestTimerActive(!isRestTimerActive);
  };

  const resetRestTimer = () => {
    setIsRestTimerActive(false);
    setRestTimeLeft(restTime);
  };

  const formatRestTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Dynamic form inputs based on category
  const renderExerciseInputs = () => {
    switch (selectedCategory) {
      case 'strength':
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Sets</label>
                <input
                  type="number"
                  placeholder="3"
                  value={sets}
                  onChange={e => setSets(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-sm focus:border-blue-500 focus:outline-none"
                  min="1"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Reps</label>
                <input
                  type="number"
                  placeholder="12"
                  value={reps}
                  onChange={e => setReps(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-sm focus:border-blue-500 focus:outline-none"
                  min="1"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Weight (lbs)</label>
              <input
                type="number"
                placeholder="135"
                value={weight}
                onChange={e => setWeight(e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-sm focus:border-blue-500 focus:outline-none"
                min="0"
              />
            </div>
          </>
        );
      
      case 'cardio':
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Duration (minutes)</label>
                <input
                  type="number"
                  placeholder="30"
                  value={duration}
                  onChange={e => setDuration(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-sm focus:border-blue-500 focus:outline-none"
                  min="1"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Distance (miles)</label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="5.0"
                  value={distance}
                  onChange={e => setDistance(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-sm focus:border-blue-500 focus:outline-none"
                  min="0"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Intensity</label>
              <select
                value={intensity}
                onChange={e => setIntensity(e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-sm focus:border-blue-500 focus:outline-none"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="extreme">Extreme</option>
              </select>
            </div>
          </>
        );
      
      case 'flexibility':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Duration (minutes)</label>
              <input
                type="number"
                placeholder="15"
                value={duration}
                onChange={e => setDuration(e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-sm focus:border-blue-500 focus:outline-none"
                min="1"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Type</label>
              <select
                value={intensity}
                onChange={e => setIntensity(e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-sm focus:border-blue-500 focus:outline-none"
              >
                <option value="static">Static Stretching</option>
                <option value="dynamic">Dynamic Movement</option>
                <option value="yoga">Yoga/Pilates</option>
              </select>
            </div>
          </>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700/50 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-lg">
                <Dumbbell size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  FitTrack Pro
                </h1>
                <p className="text-xs text-gray-400">Welcome back, {currentUser?.email?.split('@')[0]}</p>
              </div>
            </div>
            <button 
              onClick={logout} 
              className="flex items-center space-x-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors"
            >
              <LogOut size={16} />
              <span className="text-sm">Logout</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-sm p-6 rounded-2xl border border-blue-500/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-400 text-sm font-medium">Total Workouts</p>
                <p className="text-3xl font-bold">{getTotalWorkouts()}</p>
              </div>
              <Activity size={32} className="text-blue-400" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 backdrop-blur-sm p-6 rounded-2xl border border-green-500/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-400 text-sm font-medium">This Week</p>
                <p className="text-3xl font-bold">{getThisWeekWorkouts()}</p>
              </div>
              <Calendar size={32} className="text-green-400" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-sm p-6 rounded-2xl border border-purple-500/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-400 text-sm font-medium">Current Streak</p>
                <p className="text-3xl font-bold">{getStreak()} days</p>
              </div>
              <Flame size={32} className="text-purple-400" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-500/20 to-orange-600/20 backdrop-blur-sm p-6 rounded-2xl border border-orange-500/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-400 text-sm font-medium">Total Volume</p>
                <p className="text-3xl font-bold">{getTotalVolume().toLocaleString()}</p>
              </div>
              <BarChart3 size={32} className="text-orange-400" />
            </div>
          </div>
        </div>

        {/* Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Volume Chart */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <TrendingUp size={24} className="text-blue-400" />
              <h2 className="text-xl font-bold">Volume Progress</h2>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={getVolumeData()}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="date" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px'
                    }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="volume" 
                    stroke="#3B82F6" 
                    strokeWidth={3}
                    dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Muscle Group Breakdown */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <Target size={24} className="text-green-400" />
              <h2 className="text-xl font-bold">Muscle Group Distribution</h2>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={getMuscleGroupData()}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {getMuscleGroupData().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Personal Records */}
        {newPRs.length > 0 && (
          <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-sm rounded-2xl border border-yellow-500/30 p-6 mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <Trophy size={24} className="text-yellow-400" />
              <h2 className="text-xl font-bold text-yellow-400">Recent Personal Records!</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {newPRs.map((pr, index) => (
                <div key={index} className="bg-gray-900/50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">{pr.exercise}</p>
                      <p className="text-sm text-gray-400">New PR achieved!</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Zap size={16} className="text-yellow-400" />
                      <span className="font-bold text-yellow-400">{pr.value}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Rest Timer */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Clock size={24} className="text-blue-400" />
              <h2 className="text-xl font-bold">Rest Timer</h2>
            </div>
            <button
              onClick={() => setShowRestTimer(!showRestTimer)}
              className="p-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg transition-colors"
            >
              {showRestTimer ? <Bell size={16} /> : <Clock size={16} />}
            </button>
          </div>

          {showRestTimer && (
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-400 mb-4">
                  {formatRestTime(restTimeLeft)}
                </div>
                <div className="flex justify-center space-x-2 mb-4">
                  {[60, 90, 120, 180].map(time => (
                    <button
                      key={time}
                      onClick={() => {
                        setRestTime(time);
                        setRestTimeLeft(time);
                        setIsRestTimerActive(false);
                      }}
                      className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                        restTime === time
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      {time >= 120 ? `${time/60}min` : `${time}s`}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-center space-x-4">
                <button
                  onClick={toggleRestTimer}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    isRestTimerActive
                      ? 'bg-red-500 hover:bg-red-600'
                      : 'bg-green-500 hover:bg-green-600'
                  }`}
                >
                  {isRestTimerActive ? <Pause size={16} /> : <Play size={16} />}
                  <span>{isRestTimerActive ? 'Pause' : 'Start'}</span>
                </button>
                <button
                  onClick={resetRestTimer}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                >
                  <RotateCcw size={16} />
                  <span>Reset</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Enhanced Add Workout Form */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Add Workout</h2>
                <button 
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="p-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg transition-colors"
                >
                  <Plus size={20} className="text-blue-400" />
                </button>
              </div>

              {showAddForm && (
                <form onSubmit={addWorkout} className="space-y-4">
                  {/* Category Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Category</label>
                    <div className="grid grid-cols-3 gap-2">
                      {categories.map(cat => (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => {
                            setSelectedCategory(cat.id);
                            setExercise(''); // Reset exercise when changing category
                          }}
                          className={`p-2 rounded-lg border transition-colors ${
                            selectedCategory === cat.id 
                              ? 'border-blue-500 bg-blue-500/20' 
                              : 'border-gray-600 hover:border-gray-500'
                          }`}
                        >
                          <cat.icon size={16} className={cat.color} />
                          <span className="text-xs block mt-1">{cat.name}</span>
                        </button>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{categories.find(c => c.id === selectedCategory)?.description}</p>
                  </div>

                  {/* NEW EXERCISE SELECTOR */}
                  <ExerciseSelector
                    selectedCategory={selectedCategory}
                    onExerciseSelect={setExercise}
                    currentExercise={exercise}
                  />

                  {/* DYNAMIC INPUTS BASED ON CATEGORY */}
                  {renderExerciseInputs()}

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 p-3 rounded-lg font-bold transition-all transform hover:scale-105"
                  >
                    Add Workout
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Workouts List - same as before */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Recent Workouts</h2>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                >
                  <option value="date">Sort by Date</option>
                  <option value="exercise">Sort by Exercise</option>
                  <option value="volume">Sort by Volume</option>
                </select>
              </div>

              <div className="space-y-4">
                {sortedWorkouts.length === 0 ? (
                  <div className="text-center py-12">
                    <Dumbbell size={48} className="mx-auto text-gray-600 mb-4" />
                    <p className="text-gray-400">No workouts yet. Start by adding your first workout!</p>
                  </div>
                ) : (
                  sortedWorkouts.map(workout => {
                    const category = categories.find(cat => cat.id === workout.category);
                    const volume = workout.sets * workout.reps * (workout.weight || 1);
                    
                    return (
                      <div key={workout.id} className="bg-gray-900/50 border border-gray-700/50 rounded-xl p-4 hover:border-gray-600 transition-all">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className={`p-2 rounded-lg bg-gray-800`}>
                              <category.icon size={20} className={category.color} />
                            </div>
                            <div>
                              <div className="flex items-center space-x-2">
                                <h3 className="font-semibold">{workout.exercise}</h3>
                                <span className={`text-xs px-2 py-1 rounded-full ${category.color} bg-gray-800`}>
                                  {category.name}
                                </span>
                              </div>
                              <div className="flex items-center space-x-4 text-sm text-gray-400 mt-1">
                                <span>{workout.sets} sets × {workout.reps} reps</span>
                                {workout.weight && <span>@ {workout.weight} lbs</span>}
                                <span className="flex items-center space-x-1">
                                  <Clock size={12} />
                                  <span>{workout.date}</span>
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="text-right">
                              <p className="text-sm text-gray-400">Volume</p>
                              <p className="font-semibold">{volume.toLocaleString()}</p>
                            </div>
                            <button
                              onClick={() => deleteWorkout(workout.id)}
                              className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
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
