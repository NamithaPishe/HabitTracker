import { User, Habit, HabitEntry } from '@/types';
import { AppData } from './dataManager';

export interface Group {
  id: string;
  name: string;
  code: string;
  createdAt: string;
  data: AppData;
}

const GROUPS_STORAGE_KEY = 'habit-tracker-groups';

export const createGroup = (groupName: string, initialData: AppData): string => {
  const groups = getStoredGroups();
  const groupCode = generateGroupCode();
  
  const newGroup: Group = {
    id: Date.now().toString(),
    name: groupName,
    code: groupCode,
    createdAt: new Date().toISOString(),
    data: initialData
  };
  
  groups[groupCode] = newGroup;
  localStorage.setItem(GROUPS_STORAGE_KEY, JSON.stringify(groups));
  
  return groupCode;
};

export const joinGroup = (groupCode: string): Group | null => {
  const groups = getStoredGroups();
  return groups[groupCode] || null;
};

export const updateGroupData = (groupCode: string, data: AppData): boolean => {
  const groups = getStoredGroups();
  if (groups[groupCode]) {
    groups[groupCode].data = data;
    groups[groupCode].data.lastUpdated = new Date().toISOString();
    localStorage.setItem(GROUPS_STORAGE_KEY, JSON.stringify(groups));
    return true;
  }
  return false;
};

export const getGroupData = (groupCode: string): AppData | null => {
  const groups = getStoredGroups();
  return groups[groupCode]?.data || null;
};

export const listUserGroups = (): Group[] => {
  const groups = getStoredGroups();
  return Object.values(groups);
};

const getStoredGroups = (): Record<string, Group> => {
  try {
    const stored = localStorage.getItem(GROUPS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.error('Failed to load groups:', error);
    return {};
  }
};

const generateGroupCode = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

export const generateGroupLink = (groupCode: string): string => {
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  return `${baseUrl}?group=${groupCode}`;
};