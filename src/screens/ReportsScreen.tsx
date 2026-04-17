import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, useWindowDimensions, TouchableOpacity, Platform } from 'react-native';
import { useTranslation } from 'react-i18next';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTransactionStore } from '../store/useTransactionStore';
import { theme as defaultTheme } from '../constants/theme';
import { BarChart, PieChart } from 'react-native-chart-kit';
import { 
  subDays, format, startOfDay, endOfDay, isWithinInterval, 
  startOfWeek, endOfWeek, startOfMonth, endOfMonth 
} from 'date-fns';
import { useTheme } from '../components/ThemeProvider';
import { formatCurrency } from '../utils/format';
import i18n from '../i18n';

type FilterPeriod = 'today' | 'week' | 'month' | 'custom';

export const ReportsScreen = () => {
  const { width } = useWindowDimensions();
  const screenWidth = width - 32;
  const transactions = useTransactionStore((state) => state.transactions);
  const { theme, isDark } = useTheme();
  const { t } = useTranslation();
  
  const [period, setPeriod] = useState<FilterPeriod>('today');
  const [customStart, setCustomStart] = useState<Date>(subDays(new Date(), 7));
  const [customEnd, setCustomEnd] = useState<Date>(new Date());
  const [showPicker, setShowPicker] = useState<'start' | 'end' | null>(null);

  const isRTL = i18n.dir() === 'rtl';
  const styles = getStyles(theme, isDark, isRTL);

  const { filteredTransactions, startDate, endDate } = useMemo(() => {
    const now = new Date();
    let start: Date;
    let end: Date;

    if (period === 'today') {
      start = startOfDay(now);
      end = endOfDay(now);
    } else if (period === 'week') {
      start = startOfWeek(now, { weekStartsOn: 6 }); // Assuming week starts Saturday for Egypt
      end = endOfWeek(now, { weekStartsOn: 6 });
    } else if (period === 'month') {
      start = startOfMonth(now);
      end = endOfMonth(now);
    } else {
      start = startOfDay(customStart);
      end = endOfDay(customEnd);
    }

    const filtered = transactions.filter((t) => 
      t.created_at >= start.getTime() && t.created_at <= end.getTime()
    );

    return { filteredTransactions: filtered, startDate: start, endDate: end };
  }, [transactions, period, customStart, customEnd]);

  // 1. Chart Data (Dynamic Bar Chart based on days in period)
  const chartData = useMemo(() => {
    // If it's a single day or a very short custom range, just show the day
    const dayDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24));
    
    // Default to a 7-bar view if standard, otherwise group by appropriate segments
    const barsCount = Math.min(dayDiff === 0 ? 1 : dayDiff, 7); 
    
    // For simplicity, we just divide the period into `barsCount` buckets
    const interval = (endDate.getTime() - startDate.getTime()) / Math.max(1, barsCount - 1);
    
    const labels = [];
    const data = [];

    for (let i = 0; i < barsCount; i++) {
      const bucketStart = new Date(startDate.getTime() + (i * interval));
      const bucketEnd = new Date(startDate.getTime() + ((i + 1) * interval));
      
      labels.push(format(bucketStart, dayDiff > 31 ? 'MMM' : 'dd/MM'));
      
      const val = filteredTransactions
        .filter(t => t.type === 'expense' && t.created_at >= bucketStart.getTime() && t.created_at < bucketEnd.getTime())
        .reduce((sum, t) => sum + t.amount, 0);
        
      data.push(val);
    }

    // Handle exactly 1 bucket to avoid chart crash
    if (data.length === 1) {
      labels.push('');
      data.push(0);
    }

    return { labels, datasets: [{ data }] };
  }, [filteredTransactions, startDate, endDate]);

  // 2. Category Breakdown (Expenses)
  const categoryData = useMemo(() => {
    const types: Record<string, number> = {};
    const expenses = filteredTransactions.filter((t) => t.type === 'expense');
    
    expenses.forEach((t) => {
      types[t.category] = (types[t.category] || 0) + t.amount;
    });

    const colors = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'];
    
    return Object.entries(types)
      .map(([name, population], i) => ({
        name: t(`categories.${name}`, { defaultValue: name }),
        population,
        color: colors[i % colors.length],
        legendFontColor: theme.colors.textSecondary,
        legendFontSize: 12,
      }))
      .sort((a, b) => b.population - a.population)
      .slice(0, 5);
  }, [filteredTransactions, t, theme]);

  const chartConfig = {
    backgroundGradientFrom: theme.colors.card,
    backgroundGradientTo: theme.colors.card,
    color: (opacity = 1) => `rgba(99, 102, 241, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(100, 116, 139, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.6,
    useShadowColorFromDataset: false,
    decimalPlaces: 0,
  };

  const FilterButton = ({ type, label }: { type: FilterPeriod; label: string }) => (
    <TouchableOpacity
      style={[styles.filterButton, period === type && styles.filterButtonActive]}
      onPress={() => setPeriod(type)}
    >
      <Text style={[styles.filterText, period === type && styles.filterTextActive]}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        style={{ marginBottom: theme.spacing.lg }} 
        contentContainerStyle={[styles.filterRow]}
      >
        <FilterButton type="today" label={t('reports.filter_today')} />
        <FilterButton type="week" label={t('reports.filter_week')} />
        <FilterButton type="month" label={t('reports.filter_month')} />
        <FilterButton type="custom" label={t('reports.filter_custom')} />
      </ScrollView>

      {period === 'custom' && (
        <View style={styles.customDateRow}>
          <TouchableOpacity style={styles.datePickerBtn} onPress={() => setShowPicker('start')}>
            <Text style={styles.datePickerLabel}>{t('reports.select_start_date')}</Text>
            <Text style={styles.datePickerValue}>{format(customStart, 'dd/MM/yyyy')}</Text>
          </TouchableOpacity>
          <Text style={{color: theme.colors.textSecondary, marginHorizontal: 8}}>-</Text>
          <TouchableOpacity style={styles.datePickerBtn} onPress={() => setShowPicker('end')}>
            <Text style={styles.datePickerLabel}>{t('reports.select_end_date')}</Text>
            <Text style={styles.datePickerValue}>{format(customEnd, 'dd/MM/yyyy')}</Text>
          </TouchableOpacity>
        </View>
      )}

      {showPicker && (
        <DateTimePicker
          value={showPicker === 'start' ? customStart : customEnd}
          mode="date"
          display="default"
          onChange={(event, date) => {
            setShowPicker(null);
            if (date) {
              if (showPicker === 'start') setCustomStart(date);
              else setCustomEnd(date);
            }
          }}
        />
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('reports.spending_chart_title')}</Text>
        <View style={styles.chartContainer}>
          {chartData.datasets[0].data.every(v => v === 0) ? (
            <Text style={styles.noData}>{t('reports.no_data_trend')}</Text>
          ) : (
            <BarChart
              data={chartData}
              width={screenWidth}
              height={220}
              yAxisLabel=""
              yAxisSuffix=""
              chartConfig={chartConfig}
              verticalLabelRotation={0}
              flatColor={true}
              fromZero={true}
            />
          )}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('reports.category_chart_title')}</Text>
        <View style={styles.chartContainer}>
          {categoryData.length === 0 ? (
            <Text style={styles.noData}>{t('reports.no_expense_data')}</Text>
          ) : (
            <PieChart
              data={categoryData}
              width={screenWidth}
              height={220}
              chartConfig={chartConfig}
              accessor="population"
              backgroundColor="transparent"
              paddingLeft="15"
              absolute
            />
          )}
        </View>
      </View>

      <View style={styles.statsCard}>
        <Text style={styles.statsTitle}>{t('reports.summary_title')}</Text>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>{t('reports.total_transactions')}</Text>
          <Text style={styles.statValue}>{filteredTransactions.length}</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>{t('reports.avg_daily_expense')}</Text>
          <Text style={styles.statValue}>
            {formatCurrency(
              filteredTransactions.filter(t => t.type === 'expense').reduce((a, b) => a + b.amount, 0) / 
              Math.max(1, Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24)))
            )}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const getStyles = (theme: any, isDark: boolean, isRTL: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: theme.spacing.md,
    paddingBottom: 120, // Padding for floating tab bar
  },
  filterRow: {
    flexDirection: 'row',
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginRight: 8,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center'
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
  customDateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
    backgroundColor: theme.colors.card,
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    borderWidth: isDark ? 1 : 0,
    borderColor: theme.colors.border,
  },
  datePickerBtn: {
    flex: 1,
    alignItems: 'center',
  },
  datePickerLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginBottom: 4,
  },
  datePickerValue: {
    fontSize: 16,
    color: theme.colors.primary,
    fontWeight: '600',
  },
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  chartContainer: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.sm,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: isDark ? 0.3 : 0.1,
    shadowRadius: 2,
    borderWidth: isDark ? 1 : 0,
    borderColor: theme.colors.border,
  },
  noData: {
    padding: 40,
    color: theme.colors.textSecondary,
    fontStyle: 'italic',
  },
  statsCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginTop: theme.spacing.md,
    borderWidth: isDark ? 1 : 0,
    borderColor: theme.colors.border,
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  statLabel: {
    color: theme.colors.textSecondary,
  },
  statValue: {
    fontWeight: '600',
    color: theme.colors.text,
  },
});
