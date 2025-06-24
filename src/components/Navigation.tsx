'use client';

import React from 'react';
import { User } from '@/types';

interface NavigationProps {
  activeTab: 'habits' | 'leaderboard';
  onTabChange: (tab: 'habits' | 'leaderboard') => void;
  currentUser: User;
  onLogout: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ 
  activeTab, 
  onTabChange, 
  currentUser, 
  onLogout 
}) => {
  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🎯</span>
              <h1 className="text-xl font-bold text-gray-800">Habit Tracker</h1>
            </div>
            
            <div className="flex space-x-1">
              <button
                onClick={() => onTabChange('habits')}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  activeTab === 'habits'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                }`}
              >
                My Habits
              </button>
              <button
                onClick={() => onTabChange('leaderboard')}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  activeTab === 'leaderboard'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                }`}
              >
                Leaderboard
              </button>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="font-medium text-gray-800">{currentUser.name}</div>
              <div className="text-sm text-gray-600">{currentUser.email}</div>
            </div>
            <button
              onClick={onLogout}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;