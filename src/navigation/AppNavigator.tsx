import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator, TransitionPresets, CardStyleInterpolators } from '@react-navigation/stack';
import { Home, List, PieChart, Settings } from 'lucide-react-native';
import { StyleSheet, View, Image, Text } from 'react-native';
import { useTranslation } from 'react-i18next';

import { DashboardScreen } from '../screens/DashboardScreen';
import { TransactionsScreen } from '../screens/TransactionsScreen';
import { AddTransactionScreen } from '../screens/AddTransactionScreen';
import { ReportsScreen } from '../screens/ReportsScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { useTheme } from '../components/ThemeProvider';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const HeaderLogo = ({ theme }: any) => (
  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
    <Image 
      source={require('../../assets/images/icon.png')} 
      style={{ width: 34, height: 34, borderRadius: 10, resizeMode: 'cover' }} 
    />
    <Text style={{ fontSize: 24, fontWeight: '800', color: theme.colors.text }}>
      Floosi
    </Text>
  </View>
);

function TabNavigator() {
  const { theme, isDark } = useTheme();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === 'rtl';

  return (
    <Tab.Navigator
      screenOptions={{
        sceneStyle: { backgroundColor: theme.colors.background },
        animation: 'shift',
        tabBarShowLabel: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarItemStyle: {
          justifyContent: 'center',
          alignItems: 'center',
          paddingVertical: 0,
        },
        tabBarIconStyle: {
          marginTop: 10,
          marginBottom: 0,
        },
        // @ts-ignore - Required for absolute floating bars to center correctly
        safeAreaInsets: { bottom: 0, top: 0, left: 0, right: 0 },
        tabBarStyle: {
          position: 'absolute',
          bottom: 16,
          left: 16,
          right: 16,
          elevation: 10,
          backgroundColor: isDark ? 'rgba(30, 41, 59, 0.98)' : 'rgba(255, 255, 255, 0.98)',
          borderRadius: 30,
          height: 64,
          padding: 0,
          borderTopWidth: 1,
          borderTopColor:isDark ? 'rgba(30, 41, 59, 0.98)' : 'rgba(255, 255, 255, 0.98)',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.2,
          shadowRadius: 8,
        },
        tabBarBackground: () => (
          <View style={styles.blurContainer} />
        ),
        headerStyle: {
          backgroundColor: theme.colors.background,
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTitle: '',
        headerLeft: () => <HeaderLogo theme={theme} />,
        headerLeftContainerStyle: {
          paddingLeft: isRTL ? 0 : 16,
          paddingRight: isRTL ? 16 : 0,
        },
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <View style={[styles.iconContainer, focused && { backgroundColor: isDark ? 'rgba(99, 102, 241, 0.2)' : 'rgba(99, 102, 241, 0.15)' }]}>
              <Home color={color} size={size} />
            </View>
          ),
          tabBarLabel: () => null,
          title: t('tab_home'),
        }}
      />
      <Tab.Screen
        name="Transactions"
        component={TransactionsScreen}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <View style={[styles.iconContainer, focused && { backgroundColor: isDark ? 'rgba(99, 102, 241, 0.2)' : 'rgba(99, 102, 241, 0.15)' }]}>
              <List color={color} size={size} />
            </View>
          ),
          tabBarLabel: () => null,
          title: t('tab_transactions')
        }}
      />
      <Tab.Screen
        name="Reports"
        component={ReportsScreen}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <View style={[styles.iconContainer, focused && { backgroundColor: isDark ? 'rgba(99, 102, 241, 0.2)' : 'rgba(99, 102, 241, 0.15)' }]}>
              <PieChart color={color} size={size} />
            </View>
          ),
          tabBarLabel: () => null,
          title: t('tab_reports')
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <View style={[styles.iconContainer, focused && { backgroundColor: isDark ? 'rgba(99, 102, 241, 0.2)' : 'rgba(99, 102, 241, 0.15)' }]}>
              <Settings color={color} size={size} />
            </View>
          ),
          tabBarLabel: () => null,
          title: t('tab_settings')
        }}
      />
    </Tab.Navigator>
  );
}

export const AppNavigator = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: theme.colors.background },
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      }}
    >
      <Stack.Screen name="Main" component={TabNavigator} />
      <Stack.Screen
        name="AddTransaction"
        component={AddTransactionScreen}
        options={{
          headerShown: false,
          ...TransitionPresets.ModalSlideFromBottomIOS,
          gestureEnabled: true,
          gestureDirection: 'vertical',
        }}
      />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  blurContainer: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 30,
    overflow: 'hidden',
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  }
});
