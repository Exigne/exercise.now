import React from 'react';

const ExerciseSelector = ({ selectedCategory, onExerciseSelect, currentExercise }) => {
  // Lists for each category
  const list = {
    strength: [
      'Bench Press', 'Squats', 'Deadlift', 'Pull-ups', 
      'Overhead Press', 'Dumbbell Rows', 'Bicep Curls'
    ],
    cardio: [
      'Running', 'Cycling', 'Swimming', 'HIIT', 
      'Rowing', 'Stair Climber', 'Jump Rope'
    ],
    flexibility: [
      'Yoga', 'Static Stretching', 'Pilates', 
      'Mobility Flow', 'Foam Rolling'
    ]
  };

  const currentList = list[selectedCategory] || [];

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-400">Exercise</label>
      <select 
        value={currentExercise} 
        onChange={(e) => onExerciseSelect(e.target.value)}
        className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-sm text-white focus:border-blue-500 focus:outline-none transition-colors"
        required
      >
        <option value="">Select an exercise...</option>
        {currentList.map(ex => (
          <option key={ex} value={ex}>{ex}</option>
        ))}
      </select>
    </div>
  );
};

export default ExerciseSelector;
