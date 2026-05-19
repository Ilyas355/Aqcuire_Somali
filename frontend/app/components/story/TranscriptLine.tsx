import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AppColors } from '@/constants/theme';
import type { StoryLine } from '@/types/api';

interface Props {
  line: StoryLine;
  isActive: boolean;
  onPress: (line: StoryLine) => void;
}

export function TranscriptLine({ line, isActive, onPress }: Props) {
  return (
    <Pressable
      style={[styles.container, isActive && styles.containerActive]}
      onPress={() => onPress(line)}
    >
      <Text style={[styles.speaker, isActive && styles.speakerActive]}>
        {line.speaker_name.toUpperCase()}
      </Text>
      <Text style={[styles.somali, isActive && styles.somaliActive]} numberOfLines={3}>
        {line.somali}
      </Text>
      <Text style={[styles.english, isActive && styles.englishActive]} numberOfLines={3}>
        {line.english}
      </Text>
      {line.tips.length > 0 && (
        <View style={styles.tipDot} />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    paddingRight: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'transparent',
    position: 'relative',
  },
  containerActive: {
    backgroundColor: AppColors.primaryMuted,
    borderColor: AppColors.primary,
  },
  speaker: {
    fontSize: 10,
    fontWeight: '700',
    color: AppColors.textSecondary,
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  speakerActive: {
    color: AppColors.primary,
  },
  somali: {
    fontSize: 15,
    color: AppColors.textSecondary,
    lineHeight: 22,
    fontWeight: '500',
  },
  somaliActive: {
    color: AppColors.textPrimary,
    fontWeight: '600',
  },
  english: {
    fontSize: 13,
    color: AppColors.textSecondary,
    lineHeight: 19,
    marginTop: 2,
    fontStyle: 'italic',
  },
  englishActive: {
    color: AppColors.textSecondary,
  },
  tipDot: {
    position: 'absolute',
    top: 10,
    right: 12,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: AppColors.gold,
  },
});
