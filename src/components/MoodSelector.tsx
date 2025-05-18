import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useMood } from '../contexts/MoodContext';
import { MoodType } from '../types';

const MoodSelector: React.FC = () => {
  const { themeColors } = useTheme();
  const { addEntry, moodMap, getEntryByDate } = useMood();
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(() => {
    const today = new Date().toISOString().split('T')[0];
    const todayEntry = getEntryByDate(today);
    return todayEntry?.mood || null;
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const today = new Date().toISOString().split('T')[0];
  const todayEntry = getEntryByDate(today);

  const handleMoodSelect = async (mood: MoodType) => {
    setSelectedMood(mood);
    setIsSubmitting(true);
    
    // Get time of day
    const hours = new Date().getHours();
    let timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
    
    if (hours >= 5 && hours < 12) {
      timeOfDay = 'morning';
    } else if (hours >= 12 && hours < 17) {
      timeOfDay = 'afternoon';
    } else if (hours >= 17 && hours < 21) {
      timeOfDay = 'evening';
    } else {
      timeOfDay = 'night';
    }
    
    // Add entry with the selected mood
    addEntry({
      date: today,
      mood,
      note: todayEntry?.note || '',
      timeOfDay,
    });
    
    // Show success message briefly
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      setIsSubmitting(false);
    }, 1500);
  };

  const moods = Object.entries(moodMap);

  return (
    <div className={`${themeColors.card} rounded-xl shadow-md p-6 mood-container`}>
      <h2 className={`${themeColors.text} text-xl font-semibold mb-4`}>
        {todayEntry ? 'Today you feel' : 'Select your mood'}
      </h2>
      
      <div className="emoji-grid">
        {moods.map(([mood, details]) => (
          <button
            key={mood}
            onClick={() => handleMoodSelect(mood as MoodType)}
            disabled={isSubmitting}
            className={`emoji-button p-4 rounded-lg flex flex-col items-center justify-center transition-all duration-300 ${
              selectedMood === mood
                ? `ring-2 ring-offset-2 ring-${details.color.split('-')[1]}-${
                    details.color.split('-')[2]
                  } bg-gradient-to-b ${details.gradient} text-white transform scale-105`
                : `${themeColors.card} hover:bg-gray-50 ${themeColors.border} border`
            }`}
          >
            <span className="text-4xl mb-1">{details.emoji}</span>
            <span className={`text-sm font-medium ${selectedMood === mood ? 'text-white' : themeColors.text}`}>
              {mood.charAt(0).toUpperCase() + mood.slice(1)}
            </span>
          </button>
        ))}
      </div>
      
      {showSuccess && (
        <div className="mt-4 p-3 bg-green-50 text-green-800 rounded-lg text-center slide-in-up">
          <span className="flex items-center justify-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Mood saved successfully!
          </span>
        </div>
      )}
    </div>
  );
};

export default MoodSelector;