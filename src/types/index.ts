export enum MoodType {
  JOYFUL = 'joyful',
  HAPPY = 'happy',
  CONTENT = 'content',
  NEUTRAL = 'neutral',
  ANXIOUS = 'anxious',
  STRESSED = 'stressed',
  SAD = 'sad',
  DEPRESSED = 'depressed'
}

export interface MoodEntry {
  id: string;
  date: string; // ISO format
  mood: MoodType;
  note?: string;
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
}

export interface DailyMoodData {
  date: string;
  mood: MoodType;
  note?: string;
}

export interface WeeklyMoodData {
  week: string;
  averageMood: number;
  moodCounts: Record<MoodType, number>;
}

export interface MonthlyMoodData {
  month: string;
  moodCounts: Record<MoodType, number>;
  averageMood: number;
}

export type ThemeType = 'calm' | 'vibrant' | 'minimal' | 'dark';

export type MoodValue = {
  value: number;
  color: string;
  gradient: string;
  emoji: string;
};

export type MoodMap = {
  [key in MoodType]: MoodValue;
};

export interface MoodStreak {
  current: number;
  longest: number;
  lastUpdated: string;
}