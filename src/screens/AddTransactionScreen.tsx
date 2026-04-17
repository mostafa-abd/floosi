import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, KeyboardAvoidingView, Platform, I18nManager, Keyboard } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTransactionStore } from '../store/useTransactionStore';
import { useTheme } from '../components/ThemeProvider';
import { useNavigation } from '@react-navigation/native';
import { TrendingUp, TrendingDown, Check, X } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import i18n from '../i18n';

export const AddTransactionScreen = () => {
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [note, setNote] = useState('');
  
  const addTransaction = useTransactionStore((state) => state.addTransaction);
  const navigation = useNavigation();
  const { theme, isDark } = useTheme();
  const { t } = useTranslation();

  const isRTL = i18n.dir() === 'rtl';
  const styles = getStyles(theme, isDark, isRTL);

  const handleClose = () => {
    Keyboard.dismiss();
    navigation.goBack();
  };

  const handleSave = async () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      Alert.alert(t('add_transaction.error'), t('add_transaction.invalid_amount'));
      return;
    }

    if (!category) {
      Alert.alert(t('add_transaction.error'), t('add_transaction.select_category'));
      return;
    }

    try {
      await addTransaction({
        amount: Number(amount),
        type,
        category,
        note,
      });
      
      Keyboard.dismiss();
      setTimeout(() => {
        navigation.goBack();
      }, 100);
    } catch (error) {
      Alert.alert(t('add_transaction.error'), t('add_transaction.save_failed'));
    }
  };

  const categories = type === 'expense' 
    ? ['Food', 'Transport', 'Shopping', 'Bills', 'Entertainment', 'Others']
    : ['Salary', 'Freelance', 'Investment', 'Gift', 'Others'];

  return (
    <View style={styles.container}>
      <SafeAreaView edges={['top']} style={styles.statusBarBg}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <X size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t('add_transaction.title')}</Text>
          <View style={{ width: 40 }} /> 
        </View>
      </SafeAreaView>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.typeSelector}>
            <TouchableOpacity
              style={[styles.typeButton, type === 'expense' && styles.typeButtonExpense]}
              onPress={() => setType('expense')}
            >
              <TrendingDown size={20} color={type === 'expense' ? '#fff' : theme.colors.danger} />
              <Text style={[styles.typeText, type === 'expense' && styles.typeTextActive]}>{t('add_transaction.expense')}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.typeButton, type === 'income' && styles.typeButtonIncome]}
              onPress={() => setType('income')}
            >
              <TrendingUp size={20} color={type === 'income' ? '#fff' : theme.colors.success} />
              <Text style={[styles.typeText, type === 'income' && styles.typeTextActive]}>{t('add_transaction.income')}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('add_transaction.amount_label')}</Text>
            <View style={styles.amountInputContainer}>
              <Text style={styles.currencySymbol}>$</Text>
              <TextInput
                style={styles.amountInput}
                value={amount}
                onChangeText={setAmount}
                placeholder="0.00"
                keyboardType="decimal-pad"
                placeholderTextColor={theme.colors.textSecondary}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('add_transaction.category_label')}</Text>
            <View style={styles.categoriesGrid}>
              {categories.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.categoryChip,
                    category === cat && styles.categoryChipActive
                  ]}
                  onPress={() => setCategory(cat)}
                >
                  <Text style={[
                    styles.categoryChipText,
                    category === cat && styles.categoryChipTextActive
                  ]}>{t(`categories.${cat}`)}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('add_transaction.note_label')}</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={note}
              onChangeText={setNote}
              placeholder={t('add_transaction.note_placeholder')}
              multiline
              numberOfLines={4}
              placeholderTextColor={theme.colors.textSecondary}
            />
          </View>

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Check color="#fff" size={24} style={{ marginEnd: 8 }} />
            <Text style={styles.saveButtonText}>{t('add_transaction.save_btn')}</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const getStyles = (theme: any, isDark: boolean, isRTL: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  statusBarBg: {
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  closeButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.text,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  typeSelector: {
    flexDirection: 'row',
    backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : '#f3f4f6',
    borderRadius: theme.borderRadius.lg,
    padding: 4,
    marginBottom: 24,
  },
  typeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: theme.borderRadius.md,
    gap: 8,
  },
  typeButtonExpense: {
    backgroundColor: theme.colors.danger,
  },
  typeButtonIncome: {
    backgroundColor: theme.colors.success,
  },
  typeText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.textSecondary,
  },
  typeTextActive: {
    color: '#fff',
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.textSecondary,
    marginBottom: 8,
    textAlign: isRTL ? 'right' : 'left',
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: theme.colors.primary,
    paddingBottom: 8,
  },
  currencySymbol: {
    fontSize: 24,
    fontWeight: '700',
    color: theme.colors.primary,
    marginRight: 8,
  },
  amountInput: {
    flex: 1,
    fontSize: 32,
    fontWeight: '700',
    color: theme.colors.text,
    textAlign: isRTL ? 'right' : 'left',
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : '#f3f4f6',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  categoryChipActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  categoryChipText: {
    fontSize: 14,
    color: theme.colors.text,
  },
  categoryChipTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  input: {
    backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : '#f3f4f6',
    borderRadius: theme.borderRadius.md,
    padding: 12,
    fontSize: 16,
    color: theme.colors.text,
    borderWidth: 1,
    borderColor: theme.colors.border,
    textAlign: isRTL ? 'right' : 'left',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: theme.colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    borderRadius: theme.borderRadius.xl,
    marginTop: theme.spacing.lg,
    elevation: 3,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
});
