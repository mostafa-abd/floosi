import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTransactionStore } from '../store/useTransactionStore';
import { TransactionItem } from '../components/TransactionItem';
import { Search } from 'lucide-react-native';
import { useTheme } from '../components/ThemeProvider';
import i18n from '../i18n';

type FilterType = 'all' | 'income' | 'expense';

export const TransactionsScreen = () => {
  const transactions = useTransactionStore((state) => state.transactions);
  const [filter, setFilter] = useState<FilterType>('all');
  const [search, setSearch] = useState('');
  const { theme, isDark } = useTheme();
  const { t } = useTranslation();

  const isRTL = i18n.dir() === 'rtl';
  const styles = getStyles(theme, isDark, isRTL);

  const filteredTransactions = useMemo(() => {
    return transactions.filter((item) => {
      const matchesFilter = filter === 'all' || item.type === filter;
      const translatedCategory = t(`categories.${item.category}`, { defaultValue: item.category });
      
      const matchesSearch = 
        translatedCategory.toLowerCase().includes(search.toLowerCase()) || 
        item.category.toLowerCase().includes(search.toLowerCase()) ||
        (item.note && item.note.toLowerCase().includes(search.toLowerCase()));

      return matchesFilter && matchesSearch;
    });
  }, [transactions, filter, search, t]);

  const FilterButton = ({ type, label }: { type: FilterType; label: string }) => (
    <TouchableOpacity
      style={[styles.filterButton, filter === type && styles.filterButtonActive]}
      onPress={() => setFilter(type)}
    >
      <Text style={[styles.filterText, filter === type && styles.filterTextActive]}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <Search size={20} color={theme.colors.textSecondary} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder={t('transactions.search_placeholder')}
            placeholderTextColor={theme.colors.textSecondary}
            value={search}
            onChangeText={setSearch}
          />
        </View>
        
        <View style={styles.filterRow}>
          <FilterButton type="all" label={t('transactions.filter_all')} />
          <FilterButton type="income" label={t('transactions.filter_income')} />
          <FilterButton type="expense" label={t('transactions.filter_expense')} />
        </View>
      </View>

      <FlatList
        data={filteredTransactions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <TransactionItem transaction={item} />}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>{t('transactions.no_transactions_found')}</Text>
          </View>
        }
      />
    </View>
  );
};

const getStyles = (theme: any, isDark: boolean, isRTL: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.card,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : theme.colors.background,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.sm,
    marginBottom: theme.spacing.md,
    borderWidth: isDark ? 1 : 0,
    borderColor: theme.colors.border,
  },
  searchIcon: {
    marginEnd: theme.spacing.xs,
  },
  searchInput: {
    flex: 1,
    height: 44,
    fontSize: 16,
    color: theme.colors.text,
    textAlign: isRTL ? 'right' : 'left', // Fixes alignment issues dynamically
  },
  filterRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  filterButtonActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  filterText: {
    color: theme.colors.textSecondary,
    fontWeight: '600',
  },
  filterTextActive: {
    color: '#fff',
  },
  listContent: {
    paddingBottom: 120, // Floating tab bar padding
  },
  emptyState: {
    padding: theme.spacing.xl,
    alignItems: 'center',
  },
  emptyText: {
    color: theme.colors.textSecondary,
    fontSize: 16,
  },
});
