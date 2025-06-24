import { User, Habit, HabitEntry } from '@/types';

export interface AppData {
  users: User[];
  habits: Habit[];
  entries: HabitEntry[];
  lastUpdated: string;
}

export const exportData = (): string => {
  const users = JSON.parse(localStorage.getItem('habit-tracker-users') || '[]');
  const habits = JSON.parse(localStorage.getItem('habit-tracker-habits') || '[]');
  const entries = JSON.parse(localStorage.getItem('habit-tracker-entries') || '[]');
  
  const data: AppData = {
    users,
    habits,
    entries,
    lastUpdated: new Date().toISOString()
  };
  
  return JSON.stringify(data, null, 2);
};

export const importData = (jsonData: string): boolean => {
  try {
    const data: AppData = JSON.parse(jsonData);
    
    if (data.users && data.habits && data.entries) {
      localStorage.setItem('habit-tracker-users', JSON.stringify(data.users));
      localStorage.setItem('habit-tracker-habits', JSON.stringify(data.habits));
      localStorage.setItem('habit-tracker-entries', JSON.stringify(data.entries));
      return true;
    }
    return false;
  } catch (error) {
    console.error('Failed to import data:', error);
    return false;
  }
};

export const downloadData = () => {
  const data = exportData();
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `habit-tracker-data-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const generateShareCode = (): string => {
  const data = exportData();
  const compressed = btoa(data);
  return compressed;
};

export const importFromShareCode = (shareCode: string): boolean => {
  try {
    const data = atob(shareCode);
    return importData(data);
  } catch (error) {
    console.error('Failed to import from share code:', error);
    return false;
  }
};