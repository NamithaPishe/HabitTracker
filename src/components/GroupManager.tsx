'use client';

import React, { useState } from 'react';
import { createGroup, joinGroup, generateGroupLink } from '@/utils/groupManager';
import { AppData } from '@/utils/dataManager';

interface GroupManagerProps {
  currentData: AppData;
  onGroupJoined: (groupCode: string) => void;
  onClose: () => void;
}

const GroupManager: React.FC<GroupManagerProps> = ({ 
  currentData, 
  onGroupJoined, 
  onClose 
}) => {
  const [activeTab, setActiveTab] = useState<'create' | 'join'>('join');
  const [groupName, setGroupName] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [createdGroup, setCreatedGroup] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  const handleCreateGroup = () => {
    if (!groupName.trim()) {
      setMessage('Please enter a group name');
      return;
    }

    const groupCode = createGroup(groupName.trim(), currentData);
    setCreatedGroup(groupCode);
    
    const groupLink = generateGroupLink(groupCode);
    navigator.clipboard.writeText(groupLink);
    
    setMessage('Group created! Link copied to clipboard.');
    setTimeout(() => setMessage(''), 3000);
  };

  const handleJoinGroup = () => {
    if (!joinCode.trim()) {
      setMessage('Please enter a group code');
      return;
    }

    const group = joinGroup(joinCode.trim().toUpperCase());
    if (group) {
      onGroupJoined(joinCode.trim().toUpperCase());
      setMessage('Successfully joined group!');
      setTimeout(() => {
        setMessage('');
        onClose();
      }, 1500);
    } else {
      setMessage('Group not found. Please check the code.');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const copyGroupLink = () => {
    if (createdGroup) {
      const link = generateGroupLink(createdGroup);
      navigator.clipboard.writeText(link);
      setMessage('Group link copied!');
      setTimeout(() => setMessage(''), 2000);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Group Management</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('join')}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
              activeTab === 'join' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600'
            }`}
          >
            Join Group
          </button>
          <button
            onClick={() => setActiveTab('create')}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
              activeTab === 'create' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600'
            }`}
          >
            Create Group
          </button>
        </div>

        {message && (
          <div className="mb-4 p-3 bg-blue-50 text-blue-800 rounded-lg text-sm">
            {message}
          </div>
        )}

        {activeTab === 'join' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Group Code or Link
              </label>
              <input
                type="text"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                placeholder="Enter 6-letter code (e.g., ABC123)"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={handleJoinGroup}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              Join Group
            </button>
            <div className="text-xs text-gray-500 text-center">
              Join a friend's group to sync your habit data and compete together
            </div>
          </div>
        )}

        {activeTab === 'create' && (
          <div className="space-y-4">
            {!createdGroup ? (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Group Name
                  </label>
                  <input
                    type="text"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    placeholder="e.g., Fitness Friends, Study Buddies"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <button
                  onClick={handleCreateGroup}
                  className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
                >
                  Create Group
                </button>
                <div className="text-xs text-gray-500 text-center">
                  Create a group to share your habits and compete with friends
                </div>
              </>
            ) : (
              <div className="text-center space-y-4">
                <div className="p-4 bg-green-50 rounded-lg">
                  <h3 className="font-semibold text-green-800 mb-2">Group Created!</h3>
                  <div className="text-2xl font-mono text-green-700 mb-2">{createdGroup}</div>
                  <button
                    onClick={copyGroupLink}
                    className="text-sm bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                  >
                    Copy Group Link
                  </button>
                </div>
                <div className="text-sm text-gray-600">
                  Share this code or link with your friends so they can join your group!
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupManager;