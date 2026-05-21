import { StyleSheet, Text } from 'react-native';
import { Tabs } from 'expo-router';

import { HapticTab } from '@/components/haptic-tab';
import { AppColors } from '@/constants/theme';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarActiveTintColor: AppColors.primary,
        tabBarInactiveTintColor: AppColors.textQuaternary,
        tabBarStyle: {
          backgroundColor: AppColors.surface0,
          borderTopColor: AppColors.border,
          borderTopWidth: 1,
          height: 68,
          paddingBottom: 12,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
          letterSpacing: 0.1,
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => (
            <Text style={[styles.tabIcon, !focused && styles.tabIconInactive]}>🏠</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="listen"
        options={{
          title: 'Listen',
          tabBarIcon: ({ focused }) => (
            <Text style={[styles.tabIcon, !focused && styles.tabIconInactive]}>🎧</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="learn"
        options={{
          title: 'Practice',
          tabBarIcon: ({ focused }) => (
            <Text style={[styles.tabIcon, !focused && styles.tabIconInactive]}>✏️</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="community"
        options={{
          title: 'Community',
          tabBarIcon: ({ focused }) => (
            <Text style={[styles.tabIcon, !focused && styles.tabIconInactive]}>💬</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused }) => (
            <Text style={[styles.tabIcon, !focused && styles.tabIconInactive]}>👤</Text>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabIcon: {
    fontSize: 20,
    lineHeight: 24,
  },
  tabIconInactive: {
    opacity: 0.3,
  },
});
