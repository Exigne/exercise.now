import React, { useState, useEffect } from 'react';
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
  ChevronRight,
  BarChart3
} from 'lucide-react';

const Dashboard = () => {
  const { currentUser, logout } = useAuth();
  const [workouts, setWorkouts] = useState([]);
  const [exercise, setExercise] = useState('');
  const [sets, setSets] = useState('');
  const [reps, setReps] = useState('');
  const [weight, setWeight] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('strength');
  const [showAddForm, setShowAddForm] = useState(false);
  const [sortBy, setSortBy] = useState('date');

  const categories = [
    { id: 'strength', name: 'Strength', icon: Dumbbell, color: 'text-blue-400' },
    { id: 'cardio', name: 'Cardio', icon: Zap, color: 'text-green-400' },
    { id: 'flexibility', name: 'Flexibility', icon: Activity, color: 'text-purple-400' },
  ];

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
      sets: parseInt(sets),
      reps: parseInt(reps),
      weight: weight ? parseInt(weight) : null,
      category: selectedCategory,
      timestamp: new Date().toISOString()
    };
    
    setWorkouts([newWorkout, ...workouts]);
    resetForm();
  };

  const resetForm = () => {
    setExercise('');
    setSets('');
    setReps('');
    setWeight('');
    setShowAddForm(false);
  };

  const deleteWorkout = (id) => {
    setWorkouts(workouts.filter(w => w.id !== id));
  };

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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Add Workout Section */}
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
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Category</label>
                    <div className="grid grid-cols-3 gap-2">
                      {categories.map(cat => (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => setSelectedCategory(cat.id)}
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
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Exercise</label>
                    <input
                      className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      placeholder="e.g., Bench Press"
                      value={exercise}
                      onChange={e => setExercise(e.target.value)}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Sets</label>
                      <input
                        className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        placeholder="3"
                        value={sets}
                        onChange={e => setSets(e.target.value)}
                        type="number"
                        min="1"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Reps</label>
                      <input
                        className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        placeholder="12"
                        value={reps}
                        onChange={e => setReps(e.target.value)}
                        type="number"
                        min="1"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Weight (optional)</label>
                    <input
                      className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      placeholder="135 lbs"
                      value={weight}
                      onChange={e => setWeight(e.target.value)}
                      type="number"
                      min="0"
                    />
                  </div>

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

          {/* Workouts List */}
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
