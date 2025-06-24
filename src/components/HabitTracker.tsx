'use client';

import React, { useState } from 'react';
import { Habit, HabitEntry, User } from '@/types';
import { formatDate, isToday, getWeekDates } from '@/utils/dateUtils';

interface HabitTrackerProps {
  habits: Habit[];
  entries: HabitEntry[];
  currentUser: User;
  onToggleHabit: (habitId: string, date: string) => void;
}

const HabitTracker: React.FC<HabitTrackerProps> = ({
  habits,
  entries,
  currentUser,
  onToggleHabit
}) => {
  const [selectedDate, setSelectedDate] = useState(formatDate(new Date()));
  const weekDates = getWeekDates();

  const isHabitCompleted = (habitId: string, date: string): boolean => {
    return entries.some(
      entry => 
        entry.habitId === habitId && 
        entry.userId === currentUser.id && 
        entry.date === date && 
        entry.completed
    );
  };

  const getCompletionRate = (habitId: string): number => {
    const habitEntries = entries.filter(
      entry => entry.habitId === habitId && entry.userId === currentUser.id
    );
    const completedEntries = habitEntries.filter(entry => entry.completed);
    return habitEntries.length > 0 ? (completedEntries.length / habitEntries.length) * 100 : 0;
  };

  const getCategoryIcon = (category: string): string => {
    const icons: { [key: string]: string } = {
      'Health & Fitness': '💪',
      'Learning': '📚',
      'Productivity': '⚡',
      'Social': '👥',
      'Hobbies': '🎨',
      'Mindfulness': '🧘',
      'Other': '⭐'
    };
    return icons[category] || '⭐';
  };

  if (habits.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🎯</div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">No habits created yet</h3>
        <p className="text-gray-600">Create your first habit to start tracking!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Weekly Progress</h2>
        <div className="grid grid-cols-7 gap-2 mb-4">
          {weekDates.map(date => (
            <div
              key={date}
              className={`text-center p-2 rounded-lg cursor-pointer transition-colors ${
                date === selectedDate
                  ? 'bg-blue-100 text-blue-800'
                  : isToday(date)
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
              onClick={() => setSelectedDate(date)}
            >
              <div className="text-xs font-medium">
                {new Date(date).toLocaleDateString('en-US', { weekday: 'short' })}
              </div>
              <div className="text-sm">
                {new Date(date).getDate()}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {habits.filter(habit => habit.isActive).map(habit => (
          <div key={habit.id} className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{getCategoryIcon(habit.category)}</span>
                <div>
                  <h3 className="font-semibold text-gray-800">{habit.title}</h3>
                  <p className="text-sm text-gray-600">{habit.category} • {habit.points} points</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-gray-800">
                  {getCompletionRate(habit.id).toFixed(0)}% complete
                </div>
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${getCompletionRate(habit.id)}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-2">
              {weekDates.map(date => {
                const completed = isHabitCompleted(habit.id, date);
                const isFuture = new Date(date) > new Date();
                
                return (
                  <button
                    key={date}
                    onClick={() => !isFuture && onToggleHabit(habit.id, date)}
                    disabled={isFuture}
                    className={`aspect-square rounded-lg border-2 transition-all duration-200 ${
                      completed
                        ? 'bg-green-500 border-green-500 text-white'
                        : isFuture
                        ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-white border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                    }`}
                  >
                    {completed && (
                      <div className="flex items-center justify-center">
                        <span className="text-lg">✓</span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {habit.description && (
              <p className="text-sm text-gray-600 mt-3">{habit.description}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default HabitTracker;