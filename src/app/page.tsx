'use client';

import React, { useState, useEffect } from 'react';
import { User, Habit, HabitEntry, UserStats } from '@/types';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { calculateUserStats } from '@/utils/scoreUtils';
import { getGroupData, updateGroupData } from '@/utils/groupManager';
import { exportData, importData } from '@/utils/dataManager';

import UserSetup from '@/components/UserSetup';
import Navigation from '@/components/Navigation';
import HabitTracker from '@/components/HabitTracker';
import HabitForm from '@/components/HabitForm';
import Leaderboard from '@/components/Leaderboard';
import DataManager from '@/components/DataManager';
import GroupManager from '@/components/GroupManager';

export default function Home() {
  const [users, setUsers] = useLocalStorage<User[]>('habit-tracker-users', []);
  const [habits, setHabits] = useLocalStorage<Habit[]>('habit-tracker-habits', []);
  const [entries, setEntries] = useLocalStorage<HabitEntry[]>('habit-tracker-entries', []);
  const [currentUser, setCurrentUser] = useLocalStorage<User | null>('habit-tracker-current-user', null);
  
  const [activeTab, setActiveTab] = useState<'habits' | 'leaderboard'>('habits');
  const [showHabitForm, setShowHabitForm] = useState(false);
  const [showGroupManager, setShowGroupManager] = useState(false);
  const [userStats, setUserStats] = useState<UserStats[]>([]);
  const [currentGroupCode, setCurrentGroupCode] = useLocalStorage<string | null>('current-group-code', null);

  useEffect(() => {
    const stats = users.map(user => calculateUserStats(entries, habits, user.id));
    setUserStats(stats);
  }, [users, habits, entries]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const groupCode = urlParams.get('group');
    if (groupCode && groupCode !== currentGroupCode) {
      setCurrentGroupCode(groupCode);
      loadGroupData(groupCode);
    }
  }, []);

  useEffect(() => {
    if (currentGroupCode) {
      const currentData = {
        users,
        habits,
        entries,
        lastUpdated: new Date().toISOString()
      };
      updateGroupData(currentGroupCode, currentData);
    }
  }, [users, habits, entries, currentGroupCode]);

  const loadGroupData = (groupCode: string) => {
    const groupData = getGroupData(groupCode);
    if (groupData) {
      setUsers(groupData.users);
      setHabits(groupData.habits);
      setEntries(groupData.entries);
    }
  };

  const handleUserCreate = (user: User) => {
    const existingUserIndex = users.findIndex(u => u.id === user.id);
    if (existingUserIndex >= 0) {
      setCurrentUser(user);
    } else {
      const updatedUsers = [...users, user];
      setUsers(updatedUsers);
      setCurrentUser(user);
    }
  };

  const handleHabitCreate = (habitData: Omit<Habit, 'id' | 'createdAt'>) => {
    const newHabit: Habit = {
      ...habitData,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    setHabits(prev => [...prev, newHabit]);
    setShowHabitForm(false);
  };

  const handleToggleHabit = (habitId: string, date: string) => {
    if (!currentUser) return;

    const existingEntryIndex = entries.findIndex(
      entry => 
        entry.habitId === habitId && 
        entry.userId === currentUser.id && 
        entry.date === date
    );

    if (existingEntryIndex >= 0) {
      const updatedEntries = [...entries];
      updatedEntries[existingEntryIndex] = {
        ...updatedEntries[existingEntryIndex],
        completed: !updatedEntries[existingEntryIndex].completed,
        completedAt: !updatedEntries[existingEntryIndex].completed ? new Date() : undefined
      };
      setEntries(updatedEntries);
    } else {
      const newEntry: HabitEntry = {
        id: Date.now().toString(),
        habitId,
        userId: currentUser.id,
        date,
        completed: true,
        completedAt: new Date()
      };
      setEntries(prev => [...prev, newEntry]);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveTab('habits');
  };

  const handleDataImported = () => {
    window.location.reload();
  };

  const handleGroupJoined = (groupCode: string) => {
    setCurrentGroupCode(groupCode);
    loadGroupData(groupCode);
    setShowGroupManager(false);
  };

  if (!currentUser) {
    return <UserSetup onUserCreate={handleUserCreate} existingUsers={users} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      <main className="max-w-6xl mx-auto px-4 py-8">
        {activeTab === 'habits' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">My Habits</h2>
                <p className="text-gray-600">Track your daily habits and build streaks</p>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowGroupManager(true)}
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors font-medium flex items-center space-x-2"
                >
                  <span>👥</span>
                  <span>Groups</span>
                </button>
                <button
                  onClick={() => setShowHabitForm(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center space-x-2"
                >
                  <span>+</span>
                  <span>Add Habit</span>
                </button>
              </div>
            </div>

            <HabitTracker
              habits={habits}
              entries={entries}
              currentUser={currentUser}
              onToggleHabit={handleToggleHabit}
            />
          </div>
        )}

        {activeTab === 'leaderboard' && (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Leaderboard</h2>
              <p className="text-gray-600">See how you rank against your friends</p>
            </div>

            <Leaderboard
              users={users}
              userStats={userStats}
              currentUserId={currentUser.id}
            />
          </div>
        )}
      </main>

      {showHabitForm && (
        <HabitForm
          onClose={() => setShowHabitForm(false)}
          onSave={handleHabitCreate}
          currentUserId={currentUser.id}
        />
      )}

      {showGroupManager && (
        <GroupManager
          currentData={{
            users,
            habits,
            entries,
            lastUpdated: new Date().toISOString()
          }}
          onGroupJoined={handleGroupJoined}
          onClose={() => setShowGroupManager(false)}
        />
      )}

      <DataManager onDataImported={handleDataImported} />
      
      {currentGroupCode && (
        <div className="fixed bottom-4 left-4 bg-purple-100 text-purple-800 px-3 py-2 rounded-lg text-sm">
          Group: {currentGroupCode}
        </div>
      )}
    </div>
  );
}