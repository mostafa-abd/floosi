import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTransactionStore } from '../store/useTransactionStore';
import { SummaryCard } from '../components/SummaryCard';
import { TransactionItem } from '../components/TransactionItem';
import { useTheme } from '../components/ThemeProvider';
import { Plus } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { formatCurrency } from '../utils/format';
import i18n from '../i18n';

export const DashboardScreen = () => {
  const transactions = useTransactionStore((state) => state.transactions);
  const getSummary = useTransactionStore((state) => state.getSummary);
  const navigation = useNavigation<any>();
  const { theme, isDark } = useTheme();
  const { t } = useTranslation();
  
  const summary = getSummary();
  const recentTransactions = transactions.slice(0, 5);

  const isRTL = i18n.dir() === 'rtl';
  const styles = getStyles(theme, isDark, isRTL);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>{t('dashboard.total_balance')}</Text>
          <Text style={styles.balanceAmount}>
            {formatCurrency(summary.totalBalance)}
          </Text>
        </View>

        <View style={styles.summaryRow}>
          <SummaryCard label={t('dashboard.income')} amount={summary.totalIncome} type="income" />
          <View style={{ width: 16 }} />
          <SummaryCard label={t('dashboard.expenses')} amount={summary.totalExpenses} type="expense" />
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t('dashboard.recent_transactions')}</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Transactions')}>
            <Text style={styles.viewAll}>{t('dashboard.view_all')}</Text>
          </TouchableOpacity>
        </View>

        {recentTransactions.length > 0 ? (
          <View style={styles.transactionsList}>
            {recentTransactions.map((item) => (
              <TransactionItem key={item.id} transaction={item} />
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>{t('dashboard.no_transactions')}</Text>
          </View>
        )}
      </ScrollView>

      <TouchableOpacity 
        style={styles.fab} 
        onPress={() => navigation.navigate('AddTransaction')}
      >
        <Plus color="#fff" size={30} />
      </TouchableOpacity>
    </View>
  );
};

const getStyles = (theme: any, isDark: boolean, isRTL: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    padding: theme.spacing.md,
    paddingBottom: 120, // increased padding for floating bottom bar
  },
  balanceCard: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.xl,
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
    elevation: 4,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  balanceLabel: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: theme.spacing.xs,
  },
  balanceAmount: {
    color: '#ffffff',
    fontSize: 36,
    fontWeight: '800',
  },
  summaryRow: {
    flexDirection: 'row',
    marginBottom: theme.spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text,
  },
  viewAll: {
    color: theme.colors.primary,
    fontWeight: '600',
  },
  transactionsList: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: isDark ? 0.3 : 0.1,
    shadowRadius: 2,
    borderWidth: isDark ? 1 : 0,
    borderColor: theme.colors.border,
  },
  emptyState: {
    padding: theme.spacing.xl,
    alignItems: 'center',
  },
  emptyText: {
    color: theme.colors.textSecondary,
    fontSize: 16,
  },
  fab: {
    position: 'absolute',
    bottom: 100, // accommodate the floating tab bar
    right: isRTL ? undefined : theme.spacing.xl,
    left: isRTL ? theme.spacing.xl : undefined,
    backgroundColor: theme.colors.primary,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});
