import { Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { AppColors } from '@/constants/theme';
import type { StorySummary } from '@/types/api';

const CARD_W = 152;
const CARD_H = 200;

interface DifficultyConfig {
  gradStart: string;
  gradEnd: string;
  accent: string;
  abbr: string;
}

const DIFFICULTY: Record<string, DifficultyConfig> = {
  beginner: {
    gradStart: AppColors.primaryAlpha40,
    gradEnd:   AppColors.surface0,
    accent:    AppColors.primary,
    abbr:      'BEG',
  },
  intermediate: {
    gradStart: AppColors.purpleAlpha30,
    gradEnd:   AppColors.surface0,
    accent:    AppColors.purple,
    abbr:      'INT',
  },
  advanced: {
    gradStart: AppColors.goldAlpha30,
    gradEnd:   AppColors.surface0,
    accent:    AppColors.gold,
    abbr:      'ADV',
  },
};

function getConfig(difficulty: string): DifficultyConfig {
  return DIFFICULTY[difficulty.toLowerCase()] ?? DIFFICULTY.beginner;
}

interface Props {
  story: StorySummary;
  onPress: (id: number) => void;
}

export function StoryCard({ story, onPress }: Props) {
  const config = getConfig(story.difficulty);
  const duration = Math.ceil(story.duration_seconds / 60);
  const isInProgress = story.last_line_position > 0 && !story.is_completed;

  return (
    <Pressable
      style={({ pressed }) => [styles.outer, pressed && styles.outerPressed]}
      onPress={() => onPress(story.id)}
    >
      <LinearGradient
        colors={[config.gradStart, config.gradEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.4, y: 1 }}
        style={styles.card}
      >
        {/* Decorative circles */}
        <View style={[decor.circle, decor.c1, { borderColor: config.accent }]} />
        <View style={[decor.circle, decor.c2, { borderColor: config.accent }]} />
        <View style={[decor.circle, decor.c3, { borderColor: config.accent }]} />

        {/* Difficulty abbr badge — top left */}
        <View style={[styles.abbrBadge, { backgroundColor: config.accent + '22' }]}>
          <Text style={[styles.abbrText, { color: config.accent }]}>{config.abbr}</Text>
        </View>

        {/* Completed badge — top right */}
        {story.is_completed && (
          <View style={styles.completedBadge}>
            <Text style={styles.completedText}>✓</Text>
          </View>
        )}

        {/* In-progress indicator */}
        {isInProgress && (
          <View style={styles.progressPip}>
            <Text style={styles.progressPipText}>▶</Text>
          </View>
        )}

        {/* Bottom info overlay */}
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.82)']}
          style={styles.overlay}
        >
          <Text style={styles.title} numberOfLines={2}>{story.title}</Text>
          <View style={styles.metaRow}>
            <Text style={styles.meta}>{duration} min</Text>
            <View style={styles.xpBadge}>
              <Text style={styles.xpText}>⚡ {story.xp_reward}</Text>
            </View>
          </View>
        </LinearGradient>
      </LinearGradient>
    </Pressable>
  );
}

const decor = StyleSheet.create({
  circle: {
    position: 'absolute',
    borderWidth: 1,
    borderRadius: 999,
    opacity: 0.2,
  },
  c1: { width: 110, height: 110, top: -30, right: -30 },
  c2: { width: 70,  height: 70,  top: 10,  right: 10  },
  c3: { width: 38,  height: 38,  top: 40,  right: 40  },
});

const styles = StyleSheet.create({
  outer: {
    width: CARD_W,
    height: CARD_H,
    borderRadius: 16,
    overflow: 'hidden',
  },
  outerPressed: {
    opacity: 0.85,
  },
  card: {
    flex: 1,
    borderWidth: 1,
    borderColor: AppColors.border,
    borderRadius: 16,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  abbrBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    borderRadius: 6,
    paddingVertical: 3,
    paddingHorizontal: 8,
  },
  abbrText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  completedBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: AppColors.primaryMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  completedText: {
    fontSize: 11,
    fontWeight: '700',
    color: AppColors.primary,
  },
  progressPip: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: AppColors.purpleMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressPipText: {
    fontSize: 8,
    color: AppColors.purple,
  },
  overlay: {
    paddingHorizontal: 12,
    paddingTop: 32,
    paddingBottom: 12,
    gap: 6,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: AppColors.textPrimary,
    lineHeight: 19,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  meta: {
    fontSize: 11,
    color: AppColors.textSecondary,
  },
  xpBadge: {
    backgroundColor: AppColors.goldMuted,
    borderRadius: 10,
    paddingVertical: 2,
    paddingHorizontal: 6,
  },
  xpText: {
    fontSize: 10,
    fontWeight: '700',
    color: AppColors.gold,
  },
});
