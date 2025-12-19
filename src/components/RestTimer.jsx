import React, { useState, useEffect } from 'react';
import { Clock, Play, Pause, RotateCcw, Bell } from 'lucide-react';

const RestTimer = ({ onTimerComplete }) => {
  const [timeLeft, setTimeLeft] = useState(90);
  const [isActive, setIsActive] = useState(false);
  const [selectedTime, setSelectedTime] = useState(90);

  const presetTimes = [
    { label: '60s', value: 60 },
    { label: '90s', value: 90 },
    { label: '2min', value: 120 },
    { label: '3min', value: 180 },
  ];

  useEffect(() => {
    let interval = null;
    
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft => timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      onTimerComplete?.();
      // Play notification sound
      new Audio('/notification.mp3').play().catch(() => {});
    }
    
    return () => clearInterval(interval);
  }, [isActive, timeLeft, onTimerComplete]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(selectedTime);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6">
      <div className="flex items-center space-x-3 mb-4">
        <Clock size={24} className="text-blue-400" />
        <h3 className="text-lg font-bold">Rest Timer</h3>
      </div>
      
      <div className="text-center mb-6">
        <div className="text-4xl font-bold text-blue-400 mb-2">
          {formatTime(timeLeft)}
        </div>
        <div className="flex justify-center space-x-2 mb-4">
          {presetTimes.map(time => (
            <button
              key={time.value}
              onClick={() => {
                setSelectedTime(time.value);
                setTimeLeft(time.value);
                setIsActive(false);
              }}
              className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                selectedTime === time.value
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {time.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-center space-x-4">
        <button
          onClick={toggleTimer}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
            isActive
              ? 'bg-red-500 hover:bg-red-600'
              : 'bg-green-500 hover:bg-green-600'
          }`}
        >
          {isActive ? <Pause size={16} /> : <Play size={16} />}
          <span>{isActive ? 'Pause' : 'Start'}</span>
        </button>
        <button
          onClick={resetTimer}
          className="flex items-center space-x-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
        >
          <RotateCcw size={16} />
          <span>Reset</span>
        </button>
      </div>
    </div>
  );
};

export default RestTimer;
