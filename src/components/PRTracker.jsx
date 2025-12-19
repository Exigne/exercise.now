import React, { useState, useEffect } from 'react';
import { Trophy, TrendingUp, Award, Zap } from 'lucide-react';

const PRTracker = ({ workouts }) => {
  const [personalRecords, setPersonalRecords] = useState({});
  const [newPRs, setNewPRs] = useState([]);

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

    setPersonalRecords(records);
    setNewPRs(newPersonalRecords.slice(-5)); // Show last 5 PRs
  }, [workouts]);

  return (
    <div className="space-y-6">
      {/* PR Alerts */}
      {newPRs.length > 0 && (
        <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-sm rounded-2xl border border-yellow-500/30 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Trophy size={24} className="text-yellow-400" />
            <h3 className="text-lg font-bold text-yellow-400">Recent Personal Records!</h3>
          </div>
          <div className="space-y-3">
            {newPRs.map((pr, index) => (
              <div key={index} className="flex items-center justify-between bg-gray-900/50 rounded-lg p-3">
                <div>
                  <p className="font-semibold">{pr.exercise}</p>
                  <p className="text-sm text-gray-400">New {pr.type} achieved!</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Zap size={16} className="text-yellow-400" />
                  <span className="font-bold text-yellow-400">{pr.value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All Personal Records */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Award size={24} className="text-purple-400" />
          <h3 className="text-lg font-bold">Personal Records</h3>
        </div>
        <div className="space-y-4">
          {Object.entries(personalRecords).map(([exercise, stats]) => (
            <div key={exercise} className="bg-gray-900/50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold">{exercise}</h4>
                <span className="text-sm text-gray-400">{stats.totalWorkouts} workouts</span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-400">Max Weight</p>
                  <p className="font-bold text-blue-400">{stats.maxWeight} lbs</p>
                </div>
                <div>
                  <p className="text-gray-400">Max Reps</p>
                  <p className="font-bold text-green-400">{stats.maxReps}</p>
                </div>
                <div>
                  <p className="text-gray-400">Max Sets</p>
                  <p className="font-bold text-purple-400">{stats.maxSets}</p>
                </div>
                <div>
                  <p className="text-gray-400">Max Volume</p>
                  <p className="font-bold text-orange-400">{stats.maxVolume.toLocaleString()}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PRTracker;
