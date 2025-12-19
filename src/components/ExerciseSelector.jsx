import React, { useState } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import { exerciseDatabase, getAllExercises } from '../data/exercises';

const ExerciseSelector = ({ selectedCategory, onExerciseSelect, currentExercise }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const categoryData = exerciseDatabase[selectedCategory];
  if (!categoryData) return null;

  const allExercises = getAllExercises(selectedCategory);
  
  const filteredExercises = searchTerm
    ? allExercises.filter(exercise => 
        exercise.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const handleExerciseSelect = (exercise) => {
    onExerciseSelect(exercise);
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-400 mb-2">
        Select Exercise
      </label>
      
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-left focus:ring-2 focus:ring-blue-500 focus:outline-none flex items-center justify-between"
      >
        <span className={currentExercise ? 'text-white' : 'text-gray-500'}>
          {currentExercise || 'Choose an exercise...'}
        </span>
        <ChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-lg max-h-96 overflow-y-auto">
          {/* Search Bar */}
          <div className="p-3 border-b border-gray-700">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search exercises..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-900 border border-gray-600 rounded-lg p-2 pl-10 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Exercise List */}
          <div className="p-2">
            {searchTerm ? (
              // Search Results
              <div className="space-y-1">
                {filteredExercises.length > 0 ? (
                  filteredExercises.map((exercise, index) => (
                    <button
                      key={index}
                      onClick={() => handleExerciseSelect(exercise)}
                      className={`w-full text-left p-3 rounded-lg transition-colors ${
                        exercise === currentExercise
                          ? 'bg-blue-500/20 text-blue-400'
                          : 'hover:bg-gray-700 text-gray-300'
                      }`}
                    >
                      {exercise}
                    </button>
                  ))
                ) : (
                  <div className="p-4 text-center text-gray-500">
                    No exercises found
                  </div>
                )}
              </div>
            ) : (
              // Category Browser
              <div className="space-y-3">
                {Object.entries(categoryData.categories).map(([key, subcategory]) => (
                  <div key={key} className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-400 px-2">
                      {subcategory.name}
                    </h4>
                    <div className="space-y-1">
                      {subcategory.exercises.map((exercise, index) => (
                        <button
                          key={index}
                          onClick={() => handleExerciseSelect(exercise)}
                          className={`w-full text-left p-3 rounded-lg transition-colors ${
                            exercise === currentExercise
                              ? 'bg-blue-500/20 text-blue-400'
                              : 'hover:bg-gray-700 text-gray-300'
                          }`}
                        >
                          {exercise}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Category Description */}
          <div className="p-3 border-t border-gray-700 text-xs text-gray-500">
            {categoryData.description}
          </div>
        </div>
      )}
    </div>
  );
};

export default ExerciseSelector;
