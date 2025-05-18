import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useMood } from '../contexts/MoodContext';
import { Link } from 'react-router-dom';

const MoodHistory: React.FC = () => {
  const { themeColors } = useTheme();
  const { entries, moodMap } = useMood();

  // Get recent entries (last 5 days)
  const recentEntries = [...entries]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <div className={`${themeColors.card} rounded-xl shadow-md p-6 scale-in h-full`}>
      <div className="flex justify-between items-center mb-4">
        <h2 className={`${themeColors.text} text-xl font-semibold`}>Recent Moods</h2>
        <Link to="/calendar" className={`text-sm ${themeColors.textSecondary} hover:underline`}>
          View all →
        </Link>
      </div>

      {recentEntries.length > 0 ? (
        <div className="space-y-4">
          {recentEntries.map((entry) => {
            const date = new Date(entry.date);
            const formattedDate = date.toLocaleDateString('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
            });
            
            const moodDetails = moodMap[entry.mood];
            
            return (
              <div 
                key={entry.id}
                className={`p-3 rounded-lg ${themeColors.border} border flex items-center justify-between transition-all hover:shadow-md`}
              >
                <div className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${moodDetails.color} text-2xl`}>
                    {moodDetails.emoji}
                  </div>
                  <div className="ml-3">
                    <div className={`${themeColors.text} font-medium`}>
                      {entry.mood.charAt(0).toUpperCase() + entry.mood.slice(1)}
                    </div>
                    <div className={`${themeColors.textSecondary} text-sm`}>
                      {formattedDate}
                    </div>
                  </div>
                </div>
                <div className={`text-xs px-2 py-1 rounded-full ${getTimeOfDayBadge(entry.timeOfDay)}`}>
                  {entry.timeOfDay}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className={`text-center p-6 ${themeColors.textSecondary}`}>
          <p className="mb-2">No entries yet</p>
          <p className="text-sm">Start logging your mood to see your history</p>
        </div>
      )}

      {recentEntries.length > 0 && (
        <div className="mt-6">
          <Link
            to="/trends"
            className={`block w-full py-2 text-center rounded-lg ${themeColors.primary} text-white font-medium transition-all hover:opacity-90`}
          >
            View Mood Trends
          </Link>
        </div>
      )}
    </div>
  );
};

const getTimeOfDayBadge = (timeOfDay: string): string => {
  switch (timeOfDay) {
    case 'morning':
      return 'bg-amber-100 text-amber-800';
    case 'afternoon':
      return 'bg-blue-100 text-blue-800';
    case 'evening':
      return 'bg-indigo-100 text-indigo-800';
    case 'night':
      return 'bg-purple-100 text-purple-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export default MoodHistory;