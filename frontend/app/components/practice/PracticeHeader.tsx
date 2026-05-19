import { StyleSheet, Text, View } from 'react-native';

import { AppColors } from '@/constants/theme';

interface Props {
  streak: number;
}

export function PracticeHeader({ streak }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.title}>Practice</Text>
        {streak > 0 && (
          <View style={styles.streakBadge}>
            <Text style={styles.streakText}>🔥 {streak}</Text>
          </View>
        )}
      </View>
      <Text style={styles.subtitle}>Flashcards & quizzes from your lessons</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: AppColors.textPrimary,
    letterSpacing: -0.5,
  },
  streakBadge: {
    backgroundColor: AppColors.goldMuted,
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  streakText: {
    color: AppColors.gold,
    fontSize: 13,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 13,
    color: AppColors.textSecondary,
  },
});
