import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AppColors } from '@/constants/theme';
import type { StorySummary } from '@/types/api';

type Variant = 'primary' | 'purple' | 'gold' | 'outline';

const BADGE_BG: Record<Variant, string> = {
  primary: AppColors.primaryMuted,
  purple:  AppColors.purpleMuted,
  gold:    AppColors.goldMuted,
  outline: 'transparent',
};

const BADGE_TEXT: Record<Variant, string> = {
  primary: AppColors.primary,
  purple:  AppColors.purple,
  gold:    AppColors.gold,
  outline: AppColors.textSecondary,
};

function difficultyVariant(difficulty: string): Variant {
  switch (difficulty.toLowerCase()) {
    case 'beginner':     return 'primary';
    case 'intermediate': return 'purple';
    case 'advanced':     return 'gold';
    default:             return 'outline';
  }
}

function difficultyAbbr(difficulty: string): string {
  const map: Record<string, string> = {
    beginner: 'BEG', intermediate: 'INT', advanced: 'ADV',
  };
  return map[difficulty.toLowerCase()] ?? difficulty.slice(0, 3).toUpperCase();
}

interface Props {
  story: StorySummary;
  onPress: (id: number) => void;
}

export function StoryRow({ story, onPress }: Props) {
  const variant = difficultyVariant(story.difficulty);
  const duration = `${Math.ceil(story.duration_seconds / 60)} min`;

  return (
    <Pressable style={styles.container} onPress={() => onPress(story.id)}>
      <View style={[styles.badge, { backgroundColor: BADGE_BG[variant] }]}>
        <Text style={[styles.badgeText, { color: BADGE_TEXT[variant] }]}>
          {difficultyAbbr(story.difficulty)}
        </Text>
      </View>

      <View style={styles.middle}>
        <Text style={styles.title} numberOfLines={1}>{story.title}</Text>
        <Text style={styles.description} numberOfLines={1}>{story.description}</Text>
        <Text style={styles.meta}>{duration} · ⚡ {story.xp_reward} XP</Text>
      </View>

      {story.is_completed && (
        <View style={styles.completedDot}>
          <Text style={styles.completedCheck}>✓</Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.border,
  },
  badge: {
    width: 42,
    height: 42,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  middle: {
    flex: 1,
    gap: 3,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: AppColors.textPrimary,
  },
  description: {
    fontSize: 12,
    color: AppColors.textSecondary,
  },
  meta: {
    fontSize: 12,
    color: AppColors.textSecondary,
    marginTop: 1,
  },
  completedDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: AppColors.primaryMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  completedCheck: {
    color: AppColors.primary,
    fontSize: 11,
    fontWeight: '700',
  },
});
