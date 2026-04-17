import { useEffect } from 'react';
import { Alert, Platform } from 'react-native';
import * as Updates from 'expo-updates';
import { useTranslation } from 'react-i18next';

export const useAppUpdates = () => {
  const { t } = useTranslation();

  useEffect(() => {
    // Only run in production builds, updates don't work in development mode
    if (__DEV__) return;

    const checkUpdates = async () => {
      try {
        const update = await Updates.checkForUpdateAsync();
        
        if (update.isAvailable) {
          Alert.alert(
            t('updates.update_available'),
            t('updates.update_message'),
            [
              {
                text: t('updates.update_later'),
                style: 'cancel',
              },
              {
                text: t('updates.update_now'),
                onPress: async () => {
                  try {
                    await Updates.fetchUpdateAsync();
                    await Updates.reloadAsync();
                  } catch (error) {
                    console.error('Error fetching/reloading update:', error);
                  }
                },
              },
            ],
            { cancelable: true }
          );
        }
      } catch (error) {
        // Updates might fail if they are blocked by network or not configured on EAS
        console.error('Error checking for updates:', error);
      }
    };

    // Check after a short delay to not interfere with startup splash screen
    const timer = setTimeout(checkUpdates, 1000);
    return () => clearTimeout(timer);
  }, [t]);
};
