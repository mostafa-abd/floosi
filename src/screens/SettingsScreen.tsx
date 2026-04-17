import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, I18nManager } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Trash2, FileOutput, Info, ShieldCheck, Moon, Globe, Code } from 'lucide-react-native';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import * as Linking from 'expo-linking';
import { useTransactionStore } from '../store/useTransactionStore';
import { useTheme } from '../components/ThemeProvider';
import { useAppStore } from '../store/useAppStore';

import * as Updates from 'expo-updates';

export const SettingsScreen = () => {
  const transactions = useTransactionStore((state) => state.transactions);
  const clearData = useTransactionStore((state) => state.clearData);
  const { theme, isDark } = useTheme();
  const { t, i18n } = useTranslation();
  
  const themeMode = useAppStore((state) => state.themeMode);
  const setThemeMode = useAppStore((state) => state.setThemeMode);
  const language = useAppStore((state) => state.language);
  const setLanguage = useAppStore((state) => state.setLanguage);

  const isRTL = i18n.dir() === 'rtl';
  const styles = getStyles(theme, isRTL);

  const handleClearData = () => {
    Alert.alert(
      t('settings.clear_alert_title'),
      t('settings.clear_alert_msg'),
      [
        { text: t('settings.cancel'), style: 'cancel' },
        { 
          text: t('settings.delete_everything'), 
          style: 'destructive',
          onPress: async () => {
            await clearData();
            Alert.alert(t('settings.success'), t('settings.clear_success_msg'));
          }
        },
      ]
    );
  };

  const handleExportData = async () => {
    if (transactions.length === 0) {
      Alert.alert(t('settings.no_data_title'), t('settings.no_data_export_msg'));
      return;
    }

    try {
      const jsonData = JSON.stringify(transactions, null, 2);
      const filename = `floosi_export_${Date.now()}.json`;
      
      if (!FileSystem.documentDirectory) { // changed to documentDirectory for broader availability
        throw new Error('Directory not available');
      }
      
      const fileUri = FileSystem.documentDirectory + filename;

      await FileSystem.writeAsStringAsync(fileUri, jsonData);
      
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri);
      } else {
        Alert.alert(t('settings.export_success_title'), `File: ${fileUri}`);
      }
    } catch (error) {
      Alert.alert(t('settings.export_failed_title'), 'An error occurred.');
      console.error(error);
    }
  };

  const toggleLanguage = async () => {
    const newLang = language === 'ar' ? 'en' : 'ar';
    const isAr = newLang === 'ar';
    setLanguage(newLang);
    i18n.changeLanguage(newLang);
    
    // Manage RTL state
    I18nManager.allowRTL(isAr);
    I18nManager.forceRTL(isAr);

    // Reload the app to apply RTL/LTR changes
    setTimeout(() => {
      if (__DEV__) {
        // In dev mode (Expo Go), Updates.reloadAsync doesn't work
        const { DevSettings } = require('react-native');
        DevSettings.reload();
      } else {
        Updates.reloadAsync();
      }
    }, 300);
  };

  const toggleTheme = () => {
    setThemeMode(themeMode === 'dark' ? 'light' : 'dark');
  };

  const openLinkedIn = () => {
    Linking.openURL('https://www.linkedin.com/in/mostafaabdelmogod');
  };

  const SettingItem = ({ icon: Icon, label, onPress, color = theme.colors.text, type = 'normal', rightComponent }: any) => (
    <TouchableOpacity style={styles.item} onPress={onPress}>
      <View style={styles.itemLeft}>
        <View style={[styles.iconContainer, type === 'danger' && styles.iconContainerDanger]}>
          <Icon size={20} color={type === 'danger' ? theme.colors.danger : theme.colors.primary} />
        </View>
        <Text style={[styles.label, { color }]}>{label}</Text>
      </View>
      {rightComponent}
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 120 }}>
      {/* 1. Data Management */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('settings.data_management')}</Text>
        <View style={styles.card}>
          <SettingItem 
            icon={FileOutput} 
            label={t('settings.export_json')} 
            onPress={handleExportData} 
          />
          <View style={styles.divider} />
          <SettingItem 
            icon={Trash2} 
            label={t('settings.clear_all')} 
            onPress={handleClearData} 
            color={theme.colors.danger}
            type="danger"
          />
        </View>
      </View>

      {/* 2. Preferences */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('settings.preferences')}</Text>
        <View style={styles.card}>
          <SettingItem 
            icon={Moon} 
            label={t('settings.theme')}
            onPress={toggleTheme}
            rightComponent={<Text style={{ color: theme.colors.textSecondary }}>{themeMode === 'dark' ? 'Dark' : 'Light'}</Text>}
          />
          <View style={styles.divider} />
          <SettingItem 
            icon={Globe} 
            label={t('settings.language')}
            onPress={toggleLanguage} 
            rightComponent={<Text style={{ color: theme.colors.textSecondary }}>{language === 'ar' ? 'العربية' : 'English'}</Text>}
          />
        </View>
      </View>

      {/* 3. About */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('settings.about')}</Text>
        <View style={styles.card}>
          <SettingItem 
            icon={ShieldCheck} 
            label={t('settings.privacy_policy')} 
            onPress={() => Alert.alert('Privacy', t('settings.privacy_msg'))} 
          />
          <View style={styles.divider} />
          <SettingItem 
            icon={Info} 
            label={t('settings.app_version')} 
            onPress={() => Alert.alert('Floosi', 'Version 1.0.0')} 
          />
          <View style={styles.divider} />
          <SettingItem 
            icon={Code} 
            label={t('settings.created_by')} 
            onPress={openLinkedIn} 
            color={theme.colors.primary}
          />
        </View>
      </View>

      <Text style={styles.footerText}>Floosi - Personal Finance Tracker</Text>
    </ScrollView>
  );
};

const getStyles = (theme: any, isRTL: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  section: {
    padding: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 1,
    textAlign: isRTL ? 'right' : 'left',
  },
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainerDanger: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginStart: 64,
  },
  footerText: {
    textAlign: 'center',
    color: theme.colors.textSecondary,
    fontSize: 12,
    marginTop: 40,
    marginBottom: 20,
  },
});
