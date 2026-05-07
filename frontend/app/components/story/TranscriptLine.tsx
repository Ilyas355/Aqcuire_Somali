import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AppColors } from '@/constants/theme';
import type { StoryLine } from '@/types/api';

interface Props {
  line: StoryLine;
  isActive: boolean;
  language: 'somali' | 'english';
  onPress: (line: StoryLine) => void;
}

export function TranscriptLine({ line, isActive, language, onPress }: Props) {
  const text = language === 'somali' ? line.somali : line.english;

  return (
    <Pressable
      style={[styles.container, isActive && styles.containerActive]}
      onPress={() => onPress(line)}
    >
      <Text style={[styles.speaker, isActive && styles.speakerActive]}>
        {line.speaker_name.toUpperCase()}
      </Text>
      <Text style={[styles.text, isActive && styles.textActive]} numberOfLines={3}>
        {text}
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
    marginBottom: 3,
  },
  speakerActive: {
    color: AppColors.primary,
  },
  text: {
    fontSize: 15,
    color: AppColors.textSecondary,
    lineHeight: 22,
  },
  textActive: {
    color: AppColors.textPrimary,
    fontWeight: '600',
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
