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

  // ... rest of your existing code (useEffects, functions, etc.) remains the same

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Header - same as before */}
      <div className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700/50 sticky top-0 z-10">
        {/* ... header content same */}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid - same as before */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* ... stats cards same */}
        </div>

        {/* Analytics Section - same as before */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* ... charts same */}
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
            {/* ... workouts list same */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
