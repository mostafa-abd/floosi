import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from './ThemeProvider';
import { formatCurrency } from '../utils/format';

interface SummaryCardProps {
  label: string;
  amount: number;
  type?: 'income' | 'expense' | 'neutral';
}

export const SummaryCard = ({ label, amount, type = 'neutral' }: SummaryCardProps) => {
  const { theme, isDark } = useTheme();
  
  const amountColor = type === 'income' ? theme.colors.success : type === 'expense' ? theme.colors.danger : theme.colors.text;

  const styles = getStyles(theme, isDark);

  return (
    <View style={styles.card}>
      <Text style={styles.label}>{label}</Text>
      <Text style={[styles.amount, { color: amountColor }]}>
        {formatCurrency(amount)}
      </Text>
    </View>
  );
};

const getStyles = (theme: any, isDark: boolean) => StyleSheet.create({
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    flex: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: isDark ? 0.3 : 0.1,
    shadowRadius: 2,
    borderWidth: isDark ? 1 : 0,
    borderColor: theme.colors.border,
  },
  label: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
    textTransform: 'uppercase',
  },
  amount: {
    fontSize: 18,
    fontWeight: '700',
  },
});
