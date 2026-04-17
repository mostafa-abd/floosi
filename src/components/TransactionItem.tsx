import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { TrendingUp, TrendingDown } from 'lucide-react-native';
import { Transaction } from '../types';
import { useTheme } from './ThemeProvider';
import { formatCurrency } from '../utils/format';
import i18n from '../i18n';

interface TransactionItemProps {
  transaction: Transaction;
  onPress?: () => void;
}

export const TransactionItem = ({ transaction, onPress }: TransactionItemProps) => {
  const { theme, isDark } = useTheme();
  const { t } = useTranslation();
  const isIncome = transaction.type === 'income';

  const isRTL = i18n.dir() === 'rtl';
  const styles = getStyles(theme, isDark, isRTL);

  const translatedCategory = t(`categories.${transaction.category}`, { defaultValue: transaction.category });

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={[styles.iconContainer, { backgroundColor: isIncome ? (isDark ? 'rgba(74, 222, 128, 0.2)' : '#dcfce7') : (isDark ? 'rgba(248, 113, 113, 0.2)' : '#fee2e2') }]}>
        {isIncome ? (
          <TrendingUp size={20} color={theme.colors.success} />
        ) : (
          <TrendingDown size={20} color={theme.colors.danger} />
        )}
      </View>
      <View style={styles.content}>
        <Text style={styles.category}>{translatedCategory}</Text>
        <Text style={styles.note} numberOfLines={1}>{transaction.note || (isIncome ? '' : '')}</Text>
      </View>
      <View style={styles.rightContent}>
        <Text style={[styles.amount, { color: isIncome ? theme.colors.success : theme.colors.danger }]}>
          {isIncome ? '+' : '-'}{formatCurrency(transaction.amount)}
        </Text>
        <Text style={styles.date}>{format(transaction.created_at, 'MMM dd, yyyy')}</Text>
      </View>
    </TouchableOpacity>
  );
};

const getStyles = (theme: any, isDark: boolean, isRTL: boolean) => StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.card,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginEnd: theme.spacing.md,
  },
  content: {
    flex: 1,
    alignItems: 'flex-start',
  },
  category: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
  },
  note: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  rightContent: {
    alignItems: isRTL ? 'flex-start' : 'flex-end',
  },
  amount: {
    fontSize: 16,
    fontWeight: '700',
  },
  date: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
});
