import { Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

import { AppColors } from '@/constants/theme';
import type { CurrentStory } from '@/types/api';

interface Props {
  story: CurrentStory | null;
  onPress: () => void;
}

const BAR_HEIGHTS = [10, 22, 14, 30, 18, 36, 24, 32, 16, 26, 38, 20, 12, 28];

function Waveform() {
  return (
    <View style={wave.container} pointerEvents="none">
      {BAR_HEIGHTS.map((h, i) => (
        <View key={i} style={[wave.bar, { height: h }]} />
      ))}
    </View>
  );
}

const wave = StyleSheet.create({
  container: {
    position: 'absolute',
    right: 18,
    top: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    opacity: 0.22,
  },
  bar: {
    width: 3,
    borderRadius: 2,
    backgroundColor: AppColors.primary,
  },
});

export function ContinueListeningCard({ story, onPress }: Props) {
  if (!story) return null;

  const isResuming = story.last_line_position > 0;
  const duration = Math.ceil(story.duration_seconds / 60);

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onPress();
  };

  return (
    <Pressable style={styles.outer} onPress={handlePress}>
      <LinearGradient
        colors={[AppColors.primaryAlpha22, AppColors.surface0]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}
      >
        <Waveform />

        <View style={styles.label}>
          <Text style={styles.labelText}>
            {isResuming ? '▶  CONTINUE LISTENING' : '🎧  START LISTENING'}
          </Text>
        </View>

        <Text style={styles.title} numberOfLines={2}>{story.title}</Text>

        <View style={styles.footer}>
          <Text style={styles.meta} numberOfLines={1}>
            {story.category} · {duration} min · ⚡ {story.xp_reward} XP
          </Text>
          <View style={styles.btn}>
            <Text style={styles.btnText}>{isResuming ? 'Resume →' : 'Play →'}</Text>
          </View>
        </View>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  outer: {
    borderRadius: 18,
    overflow: 'hidden',
  },
  card: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: AppColors.primaryAlpha22,
    padding: 18,
    height: 164,
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  label: {
    alignSelf: 'flex-start',
    backgroundColor: AppColors.primaryMuted,
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  labelText: {
    fontSize: 10,
    fontWeight: '700',
    color: AppColors.primary,
    letterSpacing: 0.6,
  },
  title: {
    fontSize: 21,
    fontWeight: '800',
    color: AppColors.textPrimary,
    lineHeight: 27,
    letterSpacing: -0.3,
    maxWidth: '68%',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  meta: {
    fontSize: 11,
    color: AppColors.textSecondary,
    flex: 1,
  },
  btn: {
    backgroundColor: AppColors.primary,
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  btnText: {
    fontSize: 13,
    fontWeight: '700',
    color: AppColors.white,
  },
});
