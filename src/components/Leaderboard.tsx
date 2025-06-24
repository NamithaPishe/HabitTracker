'use client';

import React from 'react';
import { User, UserStats, LeaderboardEntry } from '@/types';

interface LeaderboardProps {
  users: User[];
  userStats: UserStats[];
  currentUserId: string;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ users, userStats, currentUserId }) => {
  const leaderboardEntries: LeaderboardEntry[] = users
    .map(user => {
      const stats = userStats.find(s => s.userId === user.id) || {
        userId: user.id,
        totalPoints: 0,
        streak: 0,
        longestStreak: 0,
        habitsCompleted: 0,
        lastActive: new Date()
      };
      return { user, stats, rank: 0 };
    })
    .sort((a, b) => {
      if (b.stats.totalPoints !== a.stats.totalPoints) {
        return b.stats.totalPoints - a.stats.totalPoints;
      }
      return b.stats.streak - a.stats.streak;
    })
    .map((entry, index) => ({ ...entry, rank: index + 1 }));

  const getRankIcon = (rank: number): string => {
    switch (rank) {
      case 1: return '🏆';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return '🎯';
    }
  };

  const getRankColor = (rank: number): string => {
    switch (rank) {
      case 1: return 'text-yellow-600 bg-yellow-50';
      case 2: return 'text-gray-600 bg-gray-50';
      case 3: return 'text-orange-600 bg-orange-50';
      default: return 'text-blue-600 bg-blue-50';
    }
  };

  if (leaderboardEntries.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🏆</div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">No rankings yet</h3>
        <p className="text-gray-600">Start completing habits to see the leaderboard!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
          <span className="mr-2">🏆</span>
          Leaderboard
        </h2>
        
        <div className="space-y-3">
          {leaderboardEntries.map((entry) => (
            <div
              key={entry.user.id}
              className={`flex items-center justify-between p-4 rounded-lg border transition-all ${
                entry.user.id === currentUserId
                  ? 'bg-blue-50 border-blue-200 ring-2 ring-blue-100'
                  : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center space-x-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${getRankColor(entry.rank)}`}>
                  <span className="text-lg">{getRankIcon(entry.rank)}</span>
                </div>
                
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-semibold text-gray-800">{entry.user.name}</h3>
                    {entry.user.id === currentUserId && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">You</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{entry.user.email}</p>
                </div>
              </div>
              
              <div className="text-right">
                <div className="font-bold text-lg text-gray-800">
                  {entry.stats.totalPoints} pts
                </div>
                <div className="text-sm text-gray-600">
                  {entry.stats.streak} day streak
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
            <span className="mr-2">🔥</span>
            Longest Streaks
          </h3>
          <div className="space-y-2">
            {leaderboardEntries
              .sort((a, b) => b.stats.longestStreak - a.stats.longestStreak)
              .slice(0, 3)
              .map((entry, index) => (
                <div key={entry.user.id} className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">
                    {index + 1}. {entry.user.name}
                  </span>
                  <span className="font-medium text-gray-800">
                    {entry.stats.longestStreak} days
                  </span>
                </div>
              ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-4">
          <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
            <span className="mr-2">✅</span>
            Most Completed
          </h3>
          <div className="space-y-2">
            {leaderboardEntries
              .sort((a, b) => b.stats.habitsCompleted - a.stats.habitsCompleted)
              .slice(0, 3)
              .map((entry, index) => (
                <div key={entry.user.id} className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">
                    {index + 1}. {entry.user.name}
                  </span>
                  <span className="font-medium text-gray-800">
                    {entry.stats.habitsCompleted} habits
                  </span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;