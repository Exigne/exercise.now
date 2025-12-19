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
import { exerciseDatabase } from '../data/exercises';

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
  const [newPRs, setNewPRs] = useState([]);

  const categories = [
    { id: 'strength', name: 'Strength', icon: Dumbbell, color: 'text-blue-400', description: 'Muscle building & power' },
    { id: 'cardio', name: 'Cardio', icon: Zap, color: 'text-green-400', description: 'Heart health & endurance' },
    { id: 'flexibility', name: 'Flexibility', icon: Activity, color: 'text-purple-400', description: 'Range of motion & recovery' },
  ];

  // ✅ STEP 2: Add debug logging to useEffect (add this at the top of your component)
  useEffect(() => {
    console.log("🔄 Dashboard mounted");
    console.log("👤 Current user:", currentUser);
    console.log("📊 Initial workouts:", workouts.length);
  }, [currentUser, workouts]);

  // ✅ STEP 2: Add debug logging to workout fetching (add this inside your existing useEffect)
  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        setError(null);
        setLoading(true);
        
        if (!currentUser?.email) {
          console.log("⚠️ No user email, skipping fetch");
          setLoading(false);
          return;
        }

        console.log("📧 Fetching for email:", currentUser.email);
        
        const response = await fetch(`/api/workouts?email=${currentUser.email}`);
        console.log("📡 API Response:", response.status, response.url);
        
        if (!response.ok) {
          throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log("📊 Data received:", data.length, "workouts");
        console.log("🔍 First workout:", data[0]);
        
        setWorkouts(data);
        
      } catch (err) {
        console.error("💥 Fetch error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkouts();
  }, [currentUser]);

  // ✅ STEP 2: Add comprehensive debug logging to addWorkout function
  const addWorkout = async (e) => {
    e.preventDefault();
    console.log("🚀 addWorkout clicked!");
    console.log("🏃 Exercise:", exercise);
    console.log("👤 User:", currentUser?.email);
    
    // Validation
    if (!exercise) {
      console.error("❌ No exercise selected");
      alert("Please select an exercise");
      return;
    }
    
    if (!currentUser?.email) {
      console.error("❌ No user logged in");
      alert("Please log in");
      return;
    }

    console.log("📊 Form data:", { sets, reps, weight, duration, distance, intensity });

    const workoutData = {
      user_email: currentUser.email,
      exercise: exercise,
      category: selectedCategory,
      sets: sets ? parseInt(sets) : null,
      reps: reps ? parseInt(reps) : null,
      weight: weight ? parseFloat(weight) : null,
      duration: duration ? parseInt(duration) : null,
      distance: distance ? parseFloat(distance) : null,
      intensity: intensity || 'medium',
      date: new Date().toISOString().split('T')[0],
      created_at: new Date().toISOString()
    };

    console.log("📤 Sending workout data:", workoutData);

    try {
      const response = await fetch('/api/workouts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(workoutData),
      });

      console.log("📨 Response:", response.status, response.statusText);

      if (response.ok) {
        console.log("✅ Workout saved successfully!");
        // Refresh the list
        const res = await fetch(`/api/workouts?email=${currentUser.email}`);
        const freshData = await res.json();
        console.log("🔄 Refreshed data:", freshData.length, "workouts");
        setWorkouts(freshData);
        resetForm();
        console.log("🎉 Complete!");
      } else {
        const error = await response.text();
        console.error("❌ Save failed:", error);
        alert(`Save failed: ${error}`);
      }
    } catch (err) {
      console.error("💥 Network error:", err);
      alert(`Error: ${err.message}`);
    }
  };

  // Rest of your existing code...
  const deleteWorkout = async (id) => {
    try {
      const response = await fetch('/api/workouts', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (response.ok) {
        setWorkouts(workouts.filter(w => w.id !== id));
      }
    } catch (err) {
      console.error("Delete failed");
    }
  };

  // Rest of your existing functions...
  const getTotalWorkouts = () => workouts.length;
  const getThisWeekWorkouts = () => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return workouts.filter(w => new Date(w.created_at) >= weekAgo).length;
  };
  
  const getTotalVolume = () => workouts.reduce((total, w) => total + ((w.sets||0)*(w.reps||0)*(w.weight||0)), 0);
  
  const getStreak = () => {
    if (workouts.length === 0) return 0;
    const sorted = [...workouts].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    let streak = 0;
    let currentDate = new Date();
    
    for (let workout of sorted) {
      const workoutDate = new Date(workout.created_at);
      const diffDays = Math.floor((currentDate - workoutDate) / (1000 * 60 * 60 * 24));
      
      if (diffDays === streak) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  };

  // Rest of your existing code...
  const resetForm = () => {
    setExercise(''); setSets(''); setReps(''); setWeight(''); setDuration(''); setDistance(''); setShowAddForm(false);
  };

  const toggleRestTimer = () => setIsRestTimerActive(!isRestTimerActive);
  const resetRestTimer = () => {setIsRestTimerActive(false); setRestTimeLeft(restTime);};
  const formatRestTime = (seconds) => `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`;

  // Rest of your component return statement...
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin text-blue-500 mx-auto mb-4" size={48} />
          <p className="text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-4">
      <div className="max-w-4xl mx-auto">
        {/* Your existing JSX code... */}
      </div>
    </div>
  );
};

export default Dashboard;
