import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AppColors } from '@/constants/theme';
import type { StorySummary } from '@/types/api';

const WAVEFORM_HEIGHTS = [10, 20, 14, 28, 18, 34, 22, 30, 16, 24, 36, 20, 12, 28, 18];

function Waveform() {
  return (
    <View style={waveStyles.container}>
      {WAVEFORM_HEIGHTS.map((h, i) => (
        <View key={i} style={[waveStyles.bar, { height: h }]} />
      ))}
    </View>
  );
}

const waveStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    height: 40,
  },
  bar: {
    width: 3,
    borderRadius: 2,
    backgroundColor: AppColors.purple,
    opacity: 0.6,
  },
});

interface Props {
  story: StorySummary;
  onPress: (id: number) => void;
}

export function FeaturedStoryCard({ story, onPress }: Props) {
  const duration = `${Math.ceil(story.duration_seconds / 60)} min`;

  return (
    <Pressable style={styles.card} onPress={() => onPress(story.id)}>
      <View style={styles.topRow}>
        <Text style={styles.trendingLabel}>TRENDING THIS WEEK</Text>
        <Waveform />
      </View>

      <Text style={styles.title}>{story.title}</Text>
      <Text style={styles.meta}>
        {story.difficulty} · {duration} · ⚡ {story.xp_reward} XP
      </Text>

      <View style={styles.playButton}>
        <Text style={styles.playText}>▶ Play Now</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: AppColors.purpleMuted,
    borderRadius: 16,
    padding: 16,
    gap: 10,
    borderWidth: 1,
    borderColor: AppColors.border,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  trendingLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: AppColors.purple,
    letterSpacing: 0.8,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: AppColors.textPrimary,
  },
  meta: {
    fontSize: 13,
    color: AppColors.textSecondary,
  },
  playButton: {
    alignSelf: 'flex-start',
    backgroundColor: AppColors.primary,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 4,
  },
  playText: {
    color: AppColors.background,
    fontWeight: '600',
    fontSize: 14,
  },
});
