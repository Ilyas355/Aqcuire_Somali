import { Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { AppColors } from '@/constants/theme';
import type { StorySummary } from '@/types/api';

interface Props {
  story: StorySummary;
  isResuming: boolean;
  onPress: (id: number) => void;
}

function Circles({ color }: { color: string }) {
  return (
    <View style={circles.wrap} pointerEvents="none">
      <View style={[circles.ring, circles.ring1, { borderColor: color }]} />
      <View style={[circles.ring, circles.ring2, { borderColor: color }]} />
      <View style={[circles.ring, circles.ring3, { borderColor: color }]} />
      <View style={[circles.dot, { backgroundColor: color }]} />
    </View>
  );
}

const circles = StyleSheet.create({
  wrap: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingRight: 20,
    overflow: 'hidden',
  },
  ring: {
    position: 'absolute',
    borderWidth: 1,
    borderRadius: 999,
    opacity: 0.18,
  },
  ring1: { width: 180, height: 180, right: -50 },
  ring2: { width: 120, height: 120, right: -10 },
  ring3: { width: 70,  height: 70,  right: 20 },
  dot:   { width: 12, height: 12, borderRadius: 6, opacity: 0.5, position: 'absolute', right: 52 },
});

export function HeroCard({ story, isResuming, onPress }: Props) {
  const duration = Math.ceil(story.duration_seconds / 60);
  const isInProgress = story.last_line_position > 0 && !story.is_completed;

  const gradStart = isResuming ? AppColors.purpleAlpha30 : AppColors.primaryAlpha40;
  const gradEnd   = AppColors.surface0;
  const accentColor = isResuming ? AppColors.purple : AppColors.primary;
  const chipLabel = isResuming ? 'CONTINUE LISTENING' : story.is_trending ? 'TRENDING THIS WEEK' : 'START LISTENING';

  return (
    <Pressable onPress={() => onPress(story.id)} style={styles.outer}>
      <LinearGradient
        colors={[gradStart, gradEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}
      >
        <Circles color={accentColor} />

        <View style={styles.content}>
          <View style={[styles.chip, { backgroundColor: accentColor + '22' }]}>
            <Text style={[styles.chipText, { color: accentColor }]}>{chipLabel}</Text>
          </View>

          <Text style={styles.title} numberOfLines={2}>{story.title}</Text>

          <View style={styles.bottom}>
            <Text style={styles.meta}>
              {duration} min · ⚡ {story.xp_reward} XP
            </Text>
            <Pressable
              style={[styles.btn, { backgroundColor: accentColor }]}
              onPress={() => onPress(story.id)}
            >
              <Text style={styles.btnText}>
                {isInProgress ? '▶  Resume' : '▶  Play'}
              </Text>
            </Pressable>
          </View>
        </View>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  outer: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  card: {
    height: 172,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: AppColors.border,
    padding: 20,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  content: {
    gap: 10,
    maxWidth: '65%',
  },
  chip: {
    alignSelf: 'flex-start',
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  chipText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: AppColors.textPrimary,
    lineHeight: 28,
    letterSpacing: -0.3,
  },
  bottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  meta: {
    fontSize: 13,
    color: AppColors.textSecondary,
  },
  btn: {
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  btnText: {
    fontSize: 13,
    fontWeight: '700',
    color: AppColors.onPrimary,
  },
});
