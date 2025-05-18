import React, { useMemo, useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useMood } from '../contexts/MoodContext';
import { MoodType, WeeklyMoodData, MonthlyMoodData } from '../types';

const Trends: React.FC = () => {
  const { themeColors } = useTheme();
  const { entries, moodMap } = useMood();
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'all'>('month');

  // Calculate weekly mood data
  const weeklyMoodData = useMemo(() => {
    if (entries.length === 0) return [];
    
    // Group entries by week
    const weeks: Record<string, WeeklyMoodData> = {};
    
    entries.forEach(entry => {
      const date = new Date(entry.date);
      // Get the week number (Sunday as first day)
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay());
      const weekKey = weekStart.toISOString().split('T')[0];
      
      if (!weeks[weekKey]) {
        weeks[weekKey] = {
          week: weekKey,
          averageMood: 0,
          moodCounts: {
            [MoodType.JOYFUL]: 0,
            [MoodType.HAPPY]: 0,
            [MoodType.CONTENT]: 0,
            [MoodType.NEUTRAL]: 0,
            [MoodType.ANXIOUS]: 0,
            [MoodType.STRESSED]: 0,
            [MoodType.SAD]: 0,
            [MoodType.DEPRESSED]: 0,
          },
        };
      }
      
      // Count the mood
      weeks[weekKey].moodCounts[entry.mood]++;
    });
    
    // Calculate average mood for each week
    Object.keys(weeks).forEach(weekKey => {
      let totalValue = 0;
      let totalEntries = 0;
      
      Object.entries(weeks[weekKey].moodCounts).forEach(([mood, count]) => {
        if (count > 0) {
          totalValue += moodMap[mood as MoodType].value * count;
          totalEntries += count;
        }
      });
      
      weeks[weekKey].averageMood = totalEntries > 0 ? totalValue / totalEntries : 0;
    });
    
    // Convert to array and sort by week
    return Object.values(weeks).sort((a, b) => a.week.localeCompare(b.week));
  }, [entries, moodMap]);

  // Calculate monthly mood data
  const monthlyMoodData = useMemo(() => {
    if (entries.length === 0) return [];
    
    // Group entries by month
    const months: Record<string, MonthlyMoodData> = {};
    
    entries.forEach(entry => {
      const date = new Date(entry.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!months[monthKey]) {
        months[monthKey] = {
          month: monthKey,
          averageMood: 0,
          moodCounts: {
            [MoodType.JOYFUL]: 0,
            [MoodType.HAPPY]: 0,
            [MoodType.CONTENT]: 0,
            [MoodType.NEUTRAL]: 0,
            [MoodType.ANXIOUS]: 0,
            [MoodType.STRESSED]: 0,
            [MoodType.SAD]: 0,
            [MoodType.DEPRESSED]: 0,
          },
        };
      }
      
      // Count the mood
      months[monthKey].moodCounts[entry.mood]++;
    });
    
    // Calculate average mood for each month
    Object.keys(months).forEach(monthKey => {
      let totalValue = 0;
      let totalEntries = 0;
      
      Object.entries(months[monthKey].moodCounts).forEach(([mood, count]) => {
        if (count > 0) {
          totalValue += moodMap[mood as MoodType].value * count;
          totalEntries += count;
        }
      });
      
      months[monthKey].averageMood = totalEntries > 0 ? totalValue / totalEntries : 0;
    });
    
    // Convert to array and sort by month
    return Object.values(months).sort((a, b) => a.month.localeCompare(b.month));
  }, [entries, moodMap]);

  // Calculate time of day patterns
  const timeOfDayData = useMemo(() => {
    if (entries.length === 0) return [];
    
    const timeOfDay = {
      morning: { count: 0, average: 0, total: 0 },
      afternoon: { count: 0, average: 0, total: 0 },
      evening: { count: 0, average: 0, total: 0 },
      night: { count: 0, average: 0, total: 0 },
    };
    
    entries.forEach(entry => {
      timeOfDay[entry.timeOfDay].count++;
      timeOfDay[entry.timeOfDay].total += moodMap[entry.mood].value;
    });
    
    // Calculate averages
    Object.keys(timeOfDay).forEach(time => {
      if (timeOfDay[time as keyof typeof timeOfDay].count > 0) {
        timeOfDay[time as keyof typeof timeOfDay].average = 
          timeOfDay[time as keyof typeof timeOfDay].total / timeOfDay[time as keyof typeof timeOfDay].count;
      }
    });
    
    return timeOfDay;
  }, [entries, moodMap]);

  // Filter data by time range
  const getFilteredData = () => {
    if (timeRange === 'all') {
      return monthlyMoodData;
    }
    
    const now = new Date();
    
    if (timeRange === 'week') {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(now.getDate() - 7);
      
      return weeklyMoodData.filter(week => {
        const weekDate = new Date(week.week);
        return weekDate >= oneWeekAgo;
      });
    }
    
    if (timeRange === 'month') {
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(now.getMonth() - 1);
      
      return monthlyMoodData.filter(month => {
        const [year, monthNum] = month.month.split('-').map(Number);
        const monthDate = new Date(year, monthNum - 1, 1);
        return monthDate >= oneMonthAgo;
      });
    }
    
    return [];
  };

  const filteredData = getFilteredData();

  // Calculate insights
  const generateInsights = () => {
    if (entries.length < 3) {
      return "Keep logging your moods! We'll generate insights once you have more entries.";
    }
    
    const insights = [];
    
    // Most common mood
    const moodCounts: Record<MoodType, number> = {
      [MoodType.JOYFUL]: 0,
      [MoodType.HAPPY]: 0,
      [MoodType.CONTENT]: 0,
      [MoodType.NEUTRAL]: 0,
      [MoodType.ANXIOUS]: 0,
      [MoodType.STRESSED]: 0,
      [MoodType.SAD]: 0,
      [MoodType.DEPRESSED]: 0,
    };
    
    entries.forEach(entry => {
      moodCounts[entry.mood]++;
    });
    
    const mostCommonMood = Object.entries(moodCounts).reduce(
      (max, [mood, count]) => (count > moodCounts[max as MoodType] ? mood as MoodType : max),
      MoodType.NEUTRAL
    );
    
    insights.push(`Your most common mood is "${mostCommonMood}".`);
    
    // Best time of day
    const bestTimeOfDay = Object.entries(timeOfDayData).reduce(
      (best, [time, data]) => 
        data.count > 0 && (timeOfDayData[best as keyof typeof timeOfDayData].count === 0 || 
                          data.average > timeOfDayData[best as keyof typeof timeOfDayData].average)
          ? time
          : best,
      'morning'
    );
    
    if (timeOfDayData[bestTimeOfDay as keyof typeof timeOfDayData].count > 0) {
      insights.push(`You tend to feel your best during the ${bestTimeOfDay}.`);
    }
    
    // Mood trend
    if (weeklyMoodData.length >= 2) {
      const latestWeek = weeklyMoodData[weeklyMoodData.length - 1];
      const previousWeek = weeklyMoodData[weeklyMoodData.length - 2];
      
      if (latestWeek.averageMood > previousWeek.averageMood) {
        insights.push("Your mood has been improving over the past weeks.");
      } else if (latestWeek.averageMood < previousWeek.averageMood) {
        insights.push("Your mood has been declining over the past weeks. Consider what might be affecting your wellbeing.");
      } else {
        insights.push("Your mood has been relatively stable over the past weeks.");
      }
    }
    
    return insights.join(" ");
  };

  const insights = generateInsights();

  // Empty state
  if (entries.length === 0) {
    return (
      <div className="fade-in">
        <div className="mb-8 text-center slide-in-up">
          <h1 className={`text-3xl md:text-4xl font-bold ${themeColors.text} mb-2`}>
            Mood Trends
          </h1>
          <p className={`${themeColors.textSecondary} text-lg`}>
            Track your emotional patterns over time
          </p>
        </div>

        <div className={`${themeColors.card} rounded-xl shadow-md p-8 text-center max-w-2xl mx-auto scale-in`}>
          <div className="text-6xl mb-4">📊</div>
          <h2 className={`text-2xl font-bold ${themeColors.text} mb-2`}>No Data Yet</h2>
          <p className={`${themeColors.textSecondary} mb-6`}>
            Start logging your daily moods to see beautiful visualizations and discover patterns
          </p>
          <button
            onClick={() => window.location.href = '/'}
            className={`px-6 py-3 rounded-lg ${themeColors.primary} text-white font-medium transition-all hover:opacity-90`}
          >
            Log Today's Mood
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <div className="mb-8 text-center slide-in-up">
        <h1 className={`text-3xl md:text-4xl font-bold ${themeColors.text} mb-2`}>
          Mood Trends
        </h1>
        <p className={`${themeColors.textSecondary} text-lg`}>
          Track your emotional patterns over time
        </p>
      </div>

      {/* Time range selector */}
      <div className="mb-6 flex justify-center">
        <div className={`inline-flex rounded-md shadow-sm ${themeColors.border} border`}>
          <button
            onClick={() => setTimeRange('week')}
            className={`px-4 py-2 text-sm font-medium rounded-l-md ${
              timeRange === 'week'
                ? `${themeColors.primary} text-white`
                : `${themeColors.card} ${themeColors.text}`
            }`}
          >
            Week
          </button>
          <button
            onClick={() => setTimeRange('month')}
            className={`px-4 py-2 text-sm font-medium ${
              timeRange === 'month'
                ? `${themeColors.primary} text-white`
                : `${themeColors.card} ${themeColors.text}`
            }`}
          >
            Month
          </button>
          <button
            onClick={() => setTimeRange('all')}
            className={`px-4 py-2 text-sm font-medium rounded-r-md ${
              timeRange === 'all'
                ? `${themeColors.primary} text-white`
                : `${themeColors.card} ${themeColors.text}`
            }`}
          >
            All Time
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Mood Distribution */}
        <div className={`${themeColors.card} rounded-xl shadow-md p-6 scale-in`}>
          <h2 className={`${themeColors.text} text-xl font-semibold mb-4`}>Mood Distribution</h2>
          
          <div className="space-y-3">
            {Object.entries(moodMap).map(([mood, details]) => {
              const count = entries.filter(entry => entry.mood === mood).length;
              const percentage = entries.length > 0 ? (count / entries.length) * 100 : 0;
              
              return (
                <div key={mood} className="relative">
                  <div className="flex justify-between mb-1">
                    <div className="flex items-center">
                      <span className="mr-2">{details.emoji}</span>
                      <span className={`${themeColors.text} text-sm`}>
                        {mood.charAt(0).toUpperCase() + mood.slice(1)}
                      </span>
                    </div>
                    <span className={`${themeColors.textSecondary} text-sm`}>
                      {count} ({percentage.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                    <div
                      className={`h-full ${details.color} transition-all duration-1000 ease-out`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Time of Day Patterns */}
        <div className={`${themeColors.card} rounded-xl shadow-md p-6 scale-in`}>
          <h2 className={`${themeColors.text} text-xl font-semibold mb-4`}>Time of Day Patterns</h2>
          
          <div className="space-y-4">
            {Object.entries(timeOfDayData).map(([time, data]) => {
              if (data.count === 0) return null;
              
              const averageMoodValue = data.average;
              // Map the average to a mood
              const closestMood = Object.entries(moodMap).reduce(
                (closest, [mood, details]) => {
                  return Math.abs(details.value - averageMoodValue) < 
                         Math.abs(moodMap[closest as MoodType].value - averageMoodValue)
                    ? mood
                    : closest;
                },
                MoodType.NEUTRAL
              );
              
              return (
                <div key={time} className="flex items-center justify-between">
                  <div>
                    <div className={`${themeColors.text} text-sm font-medium`}>
                      {time.charAt(0).toUpperCase() + time.slice(1)}
                    </div>
                    <div className={`${themeColors.textSecondary} text-xs`}>
                      {data.count} entries
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className={`${themeColors.text} text-sm mr-2`}>
                      Average mood:
                    </div>
                    <div className={`w-10 h-10 ${moodMap[closestMood as MoodType].color} rounded-full flex items-center justify-center text-xl`}>
                      {moodMap[closestMood as MoodType].emoji}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mood trends chart */}
      <div className={`${themeColors.card} rounded-xl shadow-md p-6 mb-6 scale-in`}>
        <h2 className={`${themeColors.text} text-xl font-semibold mb-4`}>Mood Trends</h2>
        
        {filteredData.length > 0 ? (
          <div className="relative h-60">
            <div className="h-full flex items-end">
              {filteredData.map((data, index) => {
                // Normalize the average mood to a 0-100 scale
                const normalizedValue = ((data.averageMood + 2) / 7) * 100;
                // Calculate color based on mood value
                const colorIndex = Math.round(normalizedValue / 100 * 4);
                const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500', 'bg-blue-500'];
                const color = colors[Math.min(colorIndex, colors.length - 1)];
                
                // Format label
                let label;
                if (timeRange === 'week') {
                  const date = new Date(data.week);
                  label = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                } else {
                  const [year, month] = data.month.split('-');
                  label = new Date(Number(year), Number(month) - 1).toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
                }
                
                return (
                  <div 
                    key={index}
                    className="flex flex-col items-center justify-end h-full mx-1"
                    style={{ width: `${100 / Math.min(filteredData.length, 12)}%` }}
                  >
                    <div 
                      className={`w-full ${color} rounded-t-md transition-all duration-500`}
                      style={{ height: `${Math.max(normalizedValue, 5)}%` }}
                    ></div>
                    <span className={`text-xs ${themeColors.textSecondary} mt-1 truncate w-full text-center`}>
                      {label}
                    </span>
                  </div>
                );
              })}
            </div>
            
            {/* Y-axis labels */}
            <div className="absolute left-0 top-0 h-full flex flex-col justify-between pointer-events-none opacity-50">
              {['Joyful', 'Happy', 'Content', 'Neutral', 'Anxious'].map((label, i) => (
                <div key={i} className={`text-xs ${themeColors.textSecondary}`}>
                  {label}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className={`${themeColors.textSecondary} text-center py-8`}>
            Not enough data for this time range
          </p>
        )}
      </div>

      {/* Insights */}
      <div className={`${themeColors.card} rounded-xl shadow-md p-6 scale-in`}>
        <h2 className={`${themeColors.text} text-xl font-semibold mb-2`}>Your Mood Insights</h2>
        <p className={`${themeColors.text}`}>{insights}</p>
      </div>
    </div>
  );
};

export default Trends;