import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { I18nManager } from 'react-native';

interface AppState {
  themeMode: 'light' | 'dark' | 'system';
  language: 'en' | 'ar';
  setThemeMode: (mode: 'light' | 'dark' | 'system') => void;
  setLanguage: (lang: 'en' | 'ar') => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      themeMode: 'system',
      language: I18nManager.isRTL ? 'ar' : 'en',
      
      setThemeMode: (mode) => set({ themeMode: mode }),
      
      setLanguage: (lang) => set({ language: lang }),
    }),
    {
      name: 'app-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
