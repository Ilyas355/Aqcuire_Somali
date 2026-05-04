import { StyleSheet, Text, View } from 'react-native';

import { AppColors } from '@/constants/theme';

interface Props {
  levelName: string | null;
  streak: number;
}

export function GreetingHeader({ levelName, streak }: Props) {
  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.greeting}>
        Soo Dhawoow👋
        </Text>
        <Text style={styles.title}>Learn Somali</Text>
      </View>
      {streak > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>🔥 {streak}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  greeting: {
    fontSize: 14,
    color: AppColors.textSecondary,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: AppColors.textPrimary,
    marginTop: 4,
  },
  badge: {
    backgroundColor: AppColors.goldMuted,
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  badgeText: {
    color: AppColors.gold,
    fontWeight: '700',
    fontSize: 14,
  },
});
