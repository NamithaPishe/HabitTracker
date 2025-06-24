export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  joinedAt: Date;
}

export interface Habit {
  id: string;
  title: string;
  description: string;
  category: string;
  targetFrequency: 'daily' | 'weekly';
  points: number;
  createdBy: string;
  createdAt: Date;
  isActive: boolean;
}

export interface HabitEntry {
  id: string;
  habitId: string;
  userId: string;
  date: string; // YYYY-MM-DD format
  completed: boolean;
  notes?: string;
  completedAt?: Date;
}

export interface UserStats {
  userId: string;
  totalPoints: number;
  streak: number;
  longestStreak: number;
  habitsCompleted: number;
  lastActive: Date;
}

export interface LeaderboardEntry {
  user: User;
  stats: UserStats;
  rank: number;
}