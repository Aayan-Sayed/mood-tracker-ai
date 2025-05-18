import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useMood } from '../contexts/MoodContext';
import { MoodType } from '../types';

const Calendar: React.FC = () => {
  const { themeColors } = useTheme();
  const { entries, moodMap, addEntry } = useMood();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showMoodSelector, setShowMoodSelector] = useState(false);

  // Generate calendar data
  const generateCalendarData = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const firstDayOfWeek = firstDay.getDay();
    const daysInMonth = lastDay.getDate();
    
    const prevMonthDays = [];
    if (firstDayOfWeek > 0) {
      const prevMonth = new Date(year, month, 0);
      const prevMonthTotalDays = prevMonth.getDate();
      
      for (let i = firstDayOfWeek - 1; i >= 0; i--) {
        const day = prevMonthTotalDays - i;
        const date = new Date(year, month - 1, day);
        prevMonthDays.push({
          date: date.toISOString().split('T')[0],
          day,
          isCurrentMonth: false,
        });
      }
    }
    
    const currentMonthDays = [];
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      currentMonthDays.push({
        date: date.toISOString().split('T')[0],
        day,
        isCurrentMonth: true,
      });
    }
    
    const nextMonthDays = [];
    const totalDaysShown = prevMonthDays.length + currentMonthDays.length;
    const nextMonthDaysToShow = 42 - totalDaysShown;
    
    for (let day = 1; day <= nextMonthDaysToShow; day++) {
      const date = new Date(year, month + 1, day);
      nextMonthDays.push({
        date: date.toISOString().split('T')[0],
        day,
        isCurrentMonth: false,
      });
    }
    
    return [...prevMonthDays, ...currentMonthDays, ...nextMonthDays];
  };

  const calendarDays = generateCalendarData();
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthName = currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' });
  const today = new Date().toISOString().split('T')[0];

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    const nextMonthDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);
    if (nextMonthDate <= new Date()) {
      setCurrentMonth(nextMonthDate);
    }
  };

  const goToToday = () => {
    setCurrentMonth(new Date());
    setSelectedDate(today);
  };

  const getEntryForDate = (date: string) => {
    return entries.find(entry => entry.date === date);
  };

  const handleDateClick = (date: string) => {
    const clickedDate = new Date(date);
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    // Prevent selecting future dates
    if (clickedDate > now) {
      return;
    }

    setSelectedDate(date);
    setShowMoodSelector(true);
  };

  const handleMoodSelect = (mood: MoodType) => {
    if (selectedDate) {
      const hours = new Date().getHours();
      let timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
      
      if (hours >= 5 && hours < 12) timeOfDay = 'morning';
      else if (hours >= 12 && hours < 17) timeOfDay = 'afternoon';
      else if (hours >= 17 && hours < 21) timeOfDay = 'evening';
      else timeOfDay = 'night';

      addEntry({
        date: selectedDate,
        mood,
        timeOfDay,
        note: '',
      });
      setShowMoodSelector(false);
    }
  };

  const selectedEntry = selectedDate ? getEntryForDate(selectedDate) : null;

  return (
    <div className="fade-in max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8 text-center slide-in-up">
        <h1 className={`text-3xl md:text-4xl font-bold ${themeColors.text} mb-4`}>
          Mood Calendar
        </h1>
        <p className={`${themeColors.textSecondary} text-lg max-w-2xl mx-auto`}>
          Track your moods over time and discover emotional patterns
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className={`${themeColors.card} rounded-xl shadow-lg overflow-hidden scale-in`}>
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className={`${themeColors.text} text-xl font-bold`}>{monthName}</h2>
              <div className="flex space-x-3">
                <button
                  onClick={prevMonth}
                  className={`p-2 rounded-lg ${themeColors.border} border hover:bg-gray-100 transition-colors`}
                >
                  ←
                </button>
                <button
                  onClick={goToToday}
                  className={`px-4 py-2 rounded-lg ${themeColors.secondary} text-white text-sm font-medium transition-colors hover:opacity-90`}
                >
                  Today
                </button>
                <button
                  onClick={nextMonth}
                  className={`p-2 rounded-lg ${themeColors.border} border hover:bg-gray-100 transition-colors ${
                    new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1) > new Date()
                      ? 'opacity-50 cursor-not-allowed'
                      : ''
                  }`}
                >
                  →
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 border-b border-gray-200">
              {weekDays.map(day => (
                <div 
                  key={day} 
                  className={`p-4 text-center text-sm font-medium ${themeColors.textSecondary}`}
                >
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7">
              {calendarDays.map(({ date, day, isCurrentMonth }) => {
                const entry = getEntryForDate(date);
                const isToday = date === today;
                const isSelected = date === selectedDate;
                const isFutureDate = new Date(date) > new Date();
                
                return (
                  <div
                    key={date}
                    onClick={() => !isFutureDate && handleDateClick(date)}
                    className={`relative p-4 min-h-[100px] border border-gray-100 transition-all duration-200 ${
                      isCurrentMonth ? '' : 'opacity-40'
                    } ${isSelected ? 'ring-2 ring-blue-500' : ''} ${
                      isFutureDate ? 'cursor-not-allowed bg-gray-50' : 'cursor-pointer hover:bg-gray-50'
                    }`}
                  >
                    <div className={`flex justify-between items-center mb-2`}>
                      <span className={`
                        ${isToday ? 'bg-blue-500 text-white w-8 h-8 rounded-full flex items-center justify-center' : themeColors.text}
                        ${isFutureDate ? 'text-gray-400' : ''}
                        text-sm font-medium
                      `}>
                        {day}
                      </span>
                      {entry && (
                        <div 
                          className={`w-10 h-10 rounded-full ${moodMap[entry.mood].color} flex items-center justify-center text-xl transform transition-transform hover:scale-110`}
                        >
                          {moodMap[entry.mood].emoji}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          {showMoodSelector ? (
            <div className={`${themeColors.card} rounded-xl shadow-lg p-6 scale-in`}>
              <h3 className={`${themeColors.text} text-xl font-bold mb-4`}>
                Select Mood for {new Date(selectedDate!).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                })}
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(moodMap).map(([mood, details]) => (
                  <button
                    key={mood}
                    onClick={() => handleMoodSelect(mood as MoodType)}
                    className={`p-4 rounded-lg flex flex-col items-center justify-center transition-all duration-200 ${details.color} hover:transform hover:scale-105`}
                  >
                    <span className="text-3xl mb-2">{details.emoji}</span>
                    <span className="text-sm font-medium text-white">
                      {mood.charAt(0).toUpperCase() + mood.slice(1)}
                    </span>
                  </button>
                ))}
              </div>
              <button
                onClick={() => setShowMoodSelector(false)}
                className={`mt-4 w-full py-2 rounded-lg ${themeColors.border} border text-sm font-medium transition-colors hover:bg-gray-50`}
              >
                Cancel
              </button>
            </div>
          ) : selectedEntry ? (
            <div className={`${themeColors.card} rounded-xl shadow-lg p-6 scale-in`}>
              <div className="text-center mb-6">
                <div className="text-5xl mb-3">{moodMap[selectedEntry.mood].emoji}</div>
                <h3 className={`${themeColors.text} text-xl font-bold mb-1`}>
                  {selectedEntry.mood.charAt(0).toUpperCase() + selectedEntry.mood.slice(1)}
                </h3>
                <p className={`${themeColors.textSecondary} text-sm`}>
                  {new Date(selectedEntry.date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>

              {selectedEntry.note ? (
                <div className="mt-4">
                  <h4 className={`${themeColors.text} font-medium mb-2`}>Your Reflection</h4>
                  <p className={`${themeColors.text} bg-gray-50 p-4 rounded-lg`}>
                    {selectedEntry.note}
                  </p>
                </div>
              ) : (
                <p className={`${themeColors.textSecondary} text-center italic`}>
                  No reflection added for this day
                </p>
              )}
            </div>
          ) : (
            <div className={`${themeColors.card} rounded-xl shadow-lg p-6 scale-in text-center`}>
              <p className={`${themeColors.textSecondary} mb-2`}>
                Select a day to view or log your mood
              </p>
              <p className={`text-sm ${themeColors.textSecondary}`}>
                You can log moods for past dates, but not future ones
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Calendar;