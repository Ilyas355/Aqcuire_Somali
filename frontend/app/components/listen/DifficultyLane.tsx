import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { StoryCard } from '@/components/listen/StoryCard';
import { AppColors } from '@/constants/theme';
import type { StorySummary } from '@/types/api';

const LANE_ACCENT: Record<string, string> = {
  beginner:     AppColors.primary,
  intermediate: AppColors.purple,
  advanced:     AppColors.gold,
};

interface Props {
  difficulty: string;
  stories: StorySummary[];
  onPress: (id: number) => void;
}

export function DifficultyLane({ difficulty, stories, onPress }: Props) {
  const accent = LANE_ACCENT[difficulty.toLowerCase()] ?? AppColors.textSecondary;
  const label = difficulty.toUpperCase();
  const completed = stories.filter((s) => s.is_completed).length;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={[styles.dot, { backgroundColor: accent }]} />
          <Text style={styles.label}>{label}</Text>
        </View>
        <Text style={styles.count}>{completed}/{stories.length} done</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
      >
        {stories.map((story) => (
          <StoryCard key={story.id} story={story} onPress={onPress} />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: AppColors.textPrimary,
    letterSpacing: 0.8,
  },
  count: {
    fontSize: 12,
    color: AppColors.textSecondary,
    fontWeight: '500',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    paddingBottom: 4,
  },
});
