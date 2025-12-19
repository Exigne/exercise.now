export const exerciseDatabase = {
  strength: {
    name: "Strength (Resistance Training)",
    description: "Exercises focused on muscle growth and power. Tracked by Sets and Reps.",
    categories: {
      push: {
        name: "Push",
        exercises: ["Bench Press", "Overhead Press", "Push-ups", "Tricep Dips", "Shoulder Press", "Chest Fly", "Dips"]
      },
      pull: {
        name: "Pull", 
        exercises: ["Pull-ups", "Lat Pulldowns", "Bicep Curls", "Rows", "Deadlifts", "Chin-ups", "Face Pulls"]
      },
      legs: {
        name: "Legs",
        exercises: ["Squats", "Deadlifts", "Lunges", "Leg Press", "Calf Raises", "Leg Curls", "Leg Extensions"]
      },
      core: {
        name: "Core",
        exercises: ["Planks", "Crunches", "Leg Raises", "Russian Twists", "Mountain Climbers", "Dead Bug", "Bird-Dog"]
      }
    }
  },
  cardio: {
    name: "Cardio (Aerobic/Anaerobic)",
    description: "Focused on heart health and endurance. Tracked by Time and Distance/Intensity.",
    categories: {
      steady: {
        name: "Steady State",
        exercises: ["Running", "Cycling", "Swimming", "Rowing", "Walking", "Elliptical", "Stair Master"]
      },
      high: {
        name: "High Intensity",
        exercises: ["Sprints", "Burpees", "Jump Rope", "HIIT", "Box Jumps", "Battle Ropes", "Kettlebell Swings"]
      },
      inclined: {
        name: "Inclined",
        exercises: ["Stair Climber", "Hill Sprints", "Incline Treadmill", "Hiking", "Stair Running"]
      }
    }
  },
  flexibility: {
    name: "Flexibility & Recovery",
    description: "Focus on range of motion and injury prevention. Tracked by Duration.",
    categories: {
      static: {
        name: "Static Stretching",
        exercises: ["Hamstring Stretch", "Chest Opener", "Quad Stretch", "Butterfly Stretch", "Neck Stretch", "Shoulder Stretch"]
      },
      dynamic: {
        name: "Dynamic",
        exercises: ["Arm Circles", "Leg Swings", "Cat-Cow", "Torso Twists", "Hip Circles", "Ankle Rolls"]
      },
      yoga: {
        name: "Yoga/Pilates",
        exercises: ["Downward Dog", "Sun Salutation", "Bird-Dog", "Child's Pose", "Warrior Pose", "Tree Pose", "Cobra Stretch"]
      }
    }
  }
};

export const getExercisesByCategory = (category) => {
  return exerciseDatabase[category] || null;
};

export const getAllExercises = (category) => {
  const categoryData = exerciseDatabase[category];
  if (!categoryData) return [];
  
  return Object.values(categoryData.categories).flatMap(cat => cat.exercises);
};
