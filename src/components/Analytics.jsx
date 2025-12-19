import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Calendar, Award, Target, BarChart3, Clock } from 'lucide-react';

const Analytics = ({ workouts }) => {
  const [volumeData, setVolumeData] = useState([]);
  const [muscleGroupData, setMuscleGroupData] = useState([]);
  const [consistencyData, setConsistencyData] = useState([]);

  // Calculate volume over time
  useEffect(() => {
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

    const sortedData = Object.entries(volumeByDate)
      .map(([date, volume]) => ({ date, volume }))
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(-30); // Last 30 days

    setVolumeData(sortedData);
  }, [workouts]);

  // Muscle group breakdown (simplified categorization)
  useEffect(() => {
    const muscleGroups = {
      'Chest': ['bench press', 'push ups', 'dips', 'flyes'],
      'Back': ['pull ups', 'rows', 'deadlifts', 'lat pulldown'],
      'Legs': ['squats', 'lunges', 'leg press', 'calf raises'],
      'Shoulders': ['shoulder press', 'lateral raises', 'front raises'],
      'Arms': ['bicep curls', 'tricep extensions', 'hammer curls'],
      'Core': ['planks', 'crunches', 'sit ups', 'russian twists']
    };

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

    const pieData = Object.entries(groupCounts).map(([name, value]) => ({
      name,
      value
    }));

    setMuscleGroupData(pieData);
  }, [workouts]);

  // Consistency heatmap data
  useEffect(() => {
    const workoutDays = workouts.reduce((acc, workout) => {
      const date = new Date(workout.date).toISOString().split('T')[0];
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});

    setConsistencyData(workoutDays);
  }, [workouts]);

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

  return (
    <div className="space-y-8">
      {/* Volume Chart */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <TrendingUp size={24} className="text-blue-400" />
          <h2 className="text-xl font-bold">Volume Progress</h2>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={volumeData}>
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
                data={muscleGroupData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {muscleGroupData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Consistency Heatmap */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Calendar size={24} className="text-purple-400" />
          <h2 className="text-xl font-bold">Workout Consistency</h2>
        </div>
        <div className="grid grid-cols-7 gap-1">
          {Object.entries(consistencyData).slice(-91).map(([date, count]) => {
            const intensity = Math.min(count / 3, 1);
            const opacity = 0.3 + (intensity * 0.7);
            
            return (
              <div
                key={date}
                className="w-3 h-3 rounded-sm transition-all hover:scale-110"
                style={{
                  backgroundColor: `rgba(59, 130, 246, ${opacity})`,
                }}
                title={`${date}: ${count} workout${count > 1 ? 's' : ''}`}
              />
            );
          })}
        </div>
        <div className="flex items-center space-x-4 mt-4 text-sm text-gray-400">
          <span>Less</span>
          <div className="flex space-x-1">
            {[0.3, 0.5, 0.7, 0.9].map(opacity => (
              <div
                key={opacity}
                className="w-3 h-3 rounded-sm"
                style={{ backgroundColor: `rgba(59, 130, 246, ${opacity})` }}
              />
            ))}
          </div>
          <span>More</span>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
