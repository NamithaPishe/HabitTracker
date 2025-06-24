'use client';

import React, { useState } from 'react';
import { User } from '@/types';

interface UserSetupProps {
  onUserCreate: (user: User) => void;
  existingUsers: User[];
}

const UserSetup: React.FC<UserSetupProps> = ({ onUserCreate, existingUsers }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isLogin, setIsLogin] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLogin) {
      const existingUser = existingUsers.find(u => u.email === email);
      if (existingUser) {
        onUserCreate(existingUser);
      } else {
        alert('User not found. Please check your email or create a new account.');
      }
    } else {
      if (!name.trim() || !email.trim()) return;
      
      const userExists = existingUsers.some(u => u.email === email);
      if (userExists) {
        alert('User with this email already exists. Please login instead.');
        return;
      }
      
      const newUser: User = {
        id: Date.now().toString(),
        name: name.trim(),
        email: email.trim(),
        joinedAt: new Date()
      };
      
      onUserCreate(newUser);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Habit Tracker</h1>
          <p className="text-gray-600">Track habits with your friends</p>
        </div>

        <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
          <button
            type="button"
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
              !isLogin ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600'
            }`}
          >
            Sign Up
          </button>
          <button
            type="button"
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
              isLogin ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600'
            }`}
          >
            Login
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Your Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your name"
                required={!isLogin}
              />
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your email"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors font-medium"
          >
            {isLogin ? 'Login' : 'Create Account'}
          </button>
        </form>

        {existingUsers.length > 0 && (
          <div className="mt-6 pt-6 border-t">
            <p className="text-sm text-gray-600 mb-2">Existing users:</p>
            <div className="space-y-1">
              {existingUsers.map(user => (
                <div key={user.id} className="text-sm text-gray-800">
                  {user.name} ({user.email})
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6 pt-6 border-t">
          <p className="text-xs text-gray-500 text-center">
            💡 Tip: Use the data manager (📊 button) to share your habit data with friends!
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserSetup;