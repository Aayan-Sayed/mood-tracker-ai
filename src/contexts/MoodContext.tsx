import React, { createContext, useState, useContext, useEffect } from 'react';
import { MoodType, MoodEntry, MoodStreak, MoodMap } from '../types';
import { generateId } from '../utils/helpers';

interface MoodContextType {
  entries: MoodEntry[];
  addEntry: (entry: Omit<MoodEntry, 'id'>) => void;
  updateEntry: (id: string, entry: Partial<MoodEntry>) => void;
  deleteEntry: (id: string) => void;
  getEntryByDate: (date: string) => MoodEntry | undefined;
  streak: MoodStreak;
  moodMap: MoodMap;
}

const defaultStreak: MoodStreak = {
  current: 0,
  longest: 0,
  lastUpdated: '',
};

export const moodMap: MoodMap = {
  [MoodType.JOYFUL]: {
    value: 5,
    color: 'bg-yellow-400',
    gradient: 'from-yellow-400 to-yellow-300',
    emoji: '😁',
  },
  [MoodType.HAPPY]: {
    value: 4,
    color: 'bg-green-400',
    gradient: 'from-green-400 to-green-300',
    emoji: '😊',
  },
  [MoodType.CONTENT]: {
    value: 3,
    color: 'bg-blue-400',
    gradient: 'from-blue-400 to-blue-300',
    emoji: '🙂',
  },
  [MoodType.NEUTRAL]: {
    value: 2,
    color: 'bg-gray-400',
    gradient: 'from-gray-400 to-gray-300',
    emoji: '😐',
  },
  [MoodType.ANXIOUS]: {
    value: 1,
    color: 'bg-orange-400',
    gradient: 'from-orange-400 to-orange-300',
    emoji: '😟',
  },
  [MoodType.STRESSED]: {
    value: 0,
    color: 'bg-red-400',
    gradient: 'from-red-400 to-red-300',
    emoji: '😣',
  },
  [MoodType.SAD]: {
    value: -1,
    color: 'bg-indigo-400',
    gradient: 'from-indigo-400 to-indigo-300',
    emoji: '😢',
  },
  [MoodType.DEPRESSED]: {
    value: -2,
    color: 'bg-purple-400',
    gradient: 'from-purple-400 to-purple-300',
    emoji: '😔',
  },
};

const MoodContext = createContext<MoodContextType>({
  entries: [],
  addEntry: () => {},
  updateEntry: () => {},
  deleteEntry: () => {},
  getEntryByDate: () => undefined,
  streak: defaultStreak,
  moodMap,
});

export const useMood = () => useContext(MoodContext);

export const MoodProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [entries, setEntries] = useState<MoodEntry[]>(() => {
    const savedEntries = localStorage.getItem('mood-tracker-entries');
    return savedEntries ? JSON.parse(savedEntries) : [];
  });

  const [streak, setStreak] = useState<MoodStreak>(() => {
    const savedStreak = localStorage.getItem('mood-tracker-streak');
    return savedStreak ? JSON.parse(savedStreak) : defaultStreak;
  });

  // Update streak when entries change
  useEffect(() => {
    updateStreak();
    localStorage.setItem('mood-tracker-entries', JSON.stringify(entries));
  }, [entries]);

  // Update streak in local storage when it changes
  useEffect(() => {
    localStorage.setItem('mood-tracker-streak', JSON.stringify(streak));
  }, [streak]);

  const updateStreak = () => {
    if (entries.length === 0) return;

    // Sort entries by date (newest first)
    const sortedEntries = [...entries].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    const today = new Date().toISOString().split('T')[0];
    const lastEntryDate = sortedEntries[0]?.date;
    
    // If no entry for today, don't update streak
    if (lastEntryDate !== today) return;

    let currentStreak = 1;
    let previousDate = new Date(lastEntryDate);

    for (let i = 1; i < sortedEntries.length; i++) {
      const entryDate = new Date(sortedEntries[i].date);
      const diffTime = previousDate.getTime() - entryDate.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        currentStreak++;
        previousDate = entryDate;
      } else {
        break;
      }
    }

    setStreak(prevStreak => {
      const newStreak = {
        current: currentStreak,
        longest: Math.max(prevStreak.longest, currentStreak),
        lastUpdated: today,
      };
      return newStreak;
    });
  };

  const addEntry = (entry: Omit<MoodEntry, 'id'>) => {
    const newEntry = {
      ...entry,
      id: generateId(),
    };

    // Check if entry for this date already exists
    const existingEntryIndex = entries.findIndex(e => e.date === entry.date);

    if (existingEntryIndex >= 0) {
      // Update existing entry
      const updatedEntries = [...entries];
      updatedEntries[existingEntryIndex] = {
        ...updatedEntries[existingEntryIndex],
        ...newEntry,
      };
      setEntries(updatedEntries);
    } else {
      // Add new entry
      setEntries(prevEntries => [...prevEntries, newEntry]);
    }
  };

  const updateEntry = (id: string, entry: Partial<MoodEntry>) => {
    setEntries(prevEntries =>
      prevEntries.map(e => (e.id === id ? { ...e, ...entry } : e))
    );
  };

  const deleteEntry = (id: string) => {
    setEntries(prevEntries => prevEntries.filter(e => e.id !== id));
  };

  const getEntryByDate = (date: string) => {
    return entries.find(entry => entry.date === date);
  };

  return (
    <MoodContext.Provider
      value={{
        entries,
        addEntry,
        updateEntry,
        deleteEntry,
        getEntryByDate,
        streak,
        moodMap,
      }}
    >
      {children}
    </MoodContext.Provider>
  );
};