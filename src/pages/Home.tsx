import React, { useState } from 'react';
import { useMood } from '../contexts/MoodContext';
import { useTheme } from '../contexts/ThemeContext';
import MoodSelector from '../components/MoodSelector';
import ReflectionJournal from '../components/ReflectionJournal';
import MoodHistory from '../components/MoodHistory';
import OnboardingModal from '../components/OnboardingModal';

const Home: React.FC = () => {
  const { themeColors } = useTheme();
  const { entries, streak } = useMood();
  const [showOnboarding, setShowOnboarding] = useState(() => {
    return localStorage.getItem('mood-tracker-onboarded') !== 'true';
  });

  const today = new Date().toISOString().split('T')[0];
  const hasEntryForToday = entries.some(entry => entry.date === today);
  
  const completeOnboarding = () => {
    localStorage.setItem('mood-tracker-onboarded', 'true');
    setShowOnboarding(false);
  };

  return (
    <div className="home-container">
      <div className="page-container">
        {showOnboarding && <OnboardingModal onComplete={completeOnboarding} />}

        <div className="mb-8 text-center header-section">
          <h1 className={`text-3xl md:text-4xl font-bold ${themeColors.text} mb-2`}>
            How are you feeling today?
          </h1>
          <p className={`${themeColors.textSecondary} text-lg max-w-2xl mx-auto`}>
            Track your mood and discover patterns to improve your wellbeing
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <MoodSelector />
            
            {hasEntryForToday && <ReflectionJournal />}
            
            {streak.current > 0 && (
              <div className={`${themeColors.card} rounded-xl shadow p-6 mood-stats`}>
                <div className="flex items-center justify-between">
                  <h2 className={`${themeColors.text} text-xl font-semibold`}>Your Streak</h2>
                  <div className={`flex items-center ${streak.current >= 7 ? 'streak-highlight' : ''}`}>
                    <span className="text-2xl mr-2">🔥</span>
                    <span className={`${themeColors.text} text-2xl font-bold`}>{streak.current}</span>
                  </div>
                </div>
                <p className={`${themeColors.textSecondary} mt-2`}>
                  {getStreakMessage(streak.current)}
                </p>
                <div className="mt-4 h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${getProgressColor(streak.current)} transition-all duration-1000 ease-out`}
                    style={{ width: `${Math.min(100, (streak.current / 30) * 100)}%` }}
                  ></div>
                </div>
                <div className="flex justify-between mt-1 text-xs text-gray-500">
                  <span>1 day</span>
                  <span>30 days</span>
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <MoodHistory />
          </div>
        </div>
      </div>
    </div>
  );
};

const getStreakMessage = (streak: number): string => {
  if (streak === 1) return "Great start! You've logged your mood for 1 day.";
  if (streak < 3) return `You've logged your mood for ${streak} days in a row!`;
  if (streak < 7) return `Amazing! ${streak} days of consistent tracking!`;
  if (streak < 14) return `Impressive! A ${streak}-day streak shows real commitment!`;
  if (streak < 30) return `Incredible discipline! ${streak} days and counting!`;
  return `Wow! ${streak} days is a life-changing habit!`;
};

const getProgressColor = (streak: number): string => {
  if (streak < 3) return 'bg-blue-500';
  if (streak < 7) return 'bg-green-500';
  if (streak < 14) return 'bg-indigo-500';
  if (streak < 30) return 'bg-purple-500';
  return 'bg-gradient-to-r from-purple-500 to-pink-500';
};

export default Home;