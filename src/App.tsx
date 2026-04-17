import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppNavigator } from './navigation/AppNavigator';
import { initDatabase } from './database';
import { useTransactionStore } from './store/useTransactionStore';
import { useAppStore } from './store/useAppStore'; 
import { ThemeProvider } from './components/ThemeProvider';
import * as SplashScreen from 'expo-splash-screen';
import './i18n';
import { useAppUpdates } from './hooks/useAppUpdates';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync().catch(() => {
  /* Ignore errors from preventAutoHideAsync */
});

export default function App() {
  const fetchTransactions = useTransactionStore((state) => state.fetchTransactions);
  const themeMode = useAppStore((state) => state.themeMode);

  // Check for OTA updates on launch
  useAppUpdates();

  useEffect(() => {
    const setup = async () => {
      try {
        await initDatabase();
        await fetchTransactions();
      } catch (error) {
        console.error('Failed to initialize app:', error);
      } finally {
        // Hide splash screen immediately after initial data is ready
        await SplashScreen.hideAsync();
      }
    };

    setup();
  }, [fetchTransactions]);

  return (
    <ThemeProvider>
      <SafeAreaProvider>
        <NavigationContainer>
          <AppNavigator />
          {/* StatusBar adapts slowly or relies on expo-status-bar config */}
          <StatusBar style={themeMode === 'dark' ? 'light' : 'dark'} />
        </NavigationContainer>
      </SafeAreaProvider>
    </ThemeProvider>
  );
}
