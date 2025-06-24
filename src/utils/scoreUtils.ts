import { HabitEntry, UserStats, Habit } from '@/types';

export const calculateStreak = (entries: HabitEntry[], userId: string): number => {
  const userEntries = entries
    .filter(entry => entry.userId === userId && entry.completed)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (userEntries.length === 0) return 0;

  let streak = 0;
  let currentDate = new Date();
  
  for (const entry of userEntries) {
    const entryDate = new Date(entry.date);
    const daysDiff = Math.floor((currentDate.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysDiff === streak) {
      streak++;
      currentDate = entryDate;
    } else {
      break;
    }
  }
  
  return streak;
};

export const calculateLongestStreak = (entries: HabitEntry[], userId: string): number => {
  const userEntries = entries
    .filter(entry => entry.userId === userId && entry.completed)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  if (userEntries.length === 0) return 0;

  let longestStreak = 1;
  let currentStreak = 1;
  
  for (let i = 1; i < userEntries.length; i++) {
    const prevDate = new Date(userEntries[i - 1].date);
    const currentDate = new Date(userEntries[i].date);
    const daysDiff = Math.floor((currentDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysDiff === 1) {
      currentStreak++;
      longestStreak = Math.max(longestStreak, currentStreak);
    } else {
      currentStreak = 1;
    }
  }
  
  return longestStreak;
};

export const calculateUserStats = (
  entries: HabitEntry[], 
  habits: Habit[], 
  userId: string
): UserStats => {
  const userEntries = entries.filter(entry => entry.userId === userId && entry.completed);
  
  const totalPoints = userEntries.reduce((sum, entry) => {
    const habit = habits.find(h => h.id === entry.habitId);
    return sum + (habit?.points || 0);
  }, 0);
  
  const streak = calculateStreak(entries, userId);
  const longestStreak = calculateLongestStreak(entries, userId);
  
  const lastActiveEntry = userEntries
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
  
  return {
    userId,
    totalPoints,
    streak,
    longestStreak,
    habitsCompleted: userEntries.length,
    lastActive: lastActiveEntry ? new Date(lastActiveEntry.date) : new Date()
  };
};