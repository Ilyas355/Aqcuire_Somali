import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AppColors } from '@/constants/theme';
import type { Phrase } from '@/types/api';

interface Props {
  phrase: Phrase;
  index: number;
  total: number;
  onNext: () => void;
}

export function FlashCard({ phrase, index, total, onNext }: Props) {
  const [flipped, setFlipped] = useState(false);

  const handlePress = () => {
    if (!flipped) {
      setFlipped(true);
    } else {
      setFlipped(false);
      onNext();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.progress}>
        <Text style={styles.progressText}>{index + 1} / {total}</Text>
        <View style={styles.dotsRow}>
          {Array.from({ length: total }).map((_, i) => (
            <View
              key={i}
              style={[styles.dot, i <= index && styles.dotActive]}
            />
          ))}
        </View>
      </View>

      <Pressable style={styles.card} onPress={handlePress}>
        {!flipped ? (
          <View style={styles.front}>
            <Text style={styles.hint}>Somali</Text>
            <Text style={styles.somali}>{phrase.somali}</Text>
            <Text style={styles.tapHint}>Tap to reveal English</Text>
          </View>
        ) : (
          <View style={styles.back}>
            <Text style={styles.hint}>English</Text>
            <Text style={styles.english}>{phrase.english}</Text>
            <Text style={styles.tapHint}>Tap to continue →</Text>
          </View>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
  },
  progress: {
    alignItems: 'center',
    gap: 10,
  },
  progressText: {
    fontSize: 13,
    color: AppColors.textSecondary,
    fontWeight: '600',
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: AppColors.border,
  },
  dotActive: {
    backgroundColor: AppColors.primary,
  },
  card: {
    width: '100%',
    minHeight: 260,
    backgroundColor: AppColors.card,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: AppColors.border,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  front: {
    alignItems: 'center',
    gap: 16,
  },
  back: {
    alignItems: 'center',
    gap: 16,
  },
  hint: {
    fontSize: 11,
    fontWeight: '600',
    color: AppColors.textSecondary,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  somali: {
    fontSize: 32,
    fontWeight: '700',
    color: AppColors.primary,
    textAlign: 'center',
    lineHeight: 40,
  },
  english: {
    fontSize: 28,
    fontWeight: '700',
    color: AppColors.textPrimary,
    textAlign: 'center',
    lineHeight: 36,
  },
  tapHint: {
    fontSize: 13,
    color: AppColors.textSecondary,
    marginTop: 8,
  },
});
