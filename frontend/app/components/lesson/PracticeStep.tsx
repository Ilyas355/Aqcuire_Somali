import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { AppColors } from '@/constants/theme';
import type { Phrase } from '@/types/api';

function buildOptions(phrase: Phrase, allPhrases: Phrase[]): string[] {
  const distractors = allPhrases
    .filter(p => p.id !== phrase.id)
    .sort(() => Math.random() - 0.5)
    .slice(0, 3)
    .map(p => p.somali);
  return [phrase.somali, ...distractors].sort(() => Math.random() - 0.5);
}

interface Props {
  phrases: Phrase[];
  onComplete: () => void;
  onBack: () => void;
}

export function PracticeStep({ phrases, onComplete, onBack }: Props) {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);

  const phrase = phrases[phraseIndex];
  const total = phrases.length;

  const options = useMemo(() => buildOptions(phrase, phrases), [phrase.id]);

  const handleSelect = (option: string) => {
    if (answered) return;
    setSelected(option);
    setAnswered(true);
  };

  const handleNext = () => {
    if (!answered) return;
    if (phraseIndex < total - 1) {
      setPhraseIndex(i => i + 1);
      setSelected(null);
      setAnswered(false);
    } else {
      onComplete();
    }
  };

  const handleBack = () => {
    if (phraseIndex > 0) {
      setPhraseIndex(i => i - 1);
      setSelected(null);
      setAnswered(false);
    } else {
      onBack();
    }
  };

  const optionStyle = (option: string) => {
    if (!answered || selected !== option) {
      if (answered && option === phrase.somali) return [styles.option, styles.optionCorrect];
      return styles.option;
    }
    if (option === phrase.somali) return [styles.option, styles.optionCorrect];
    return [styles.option, styles.optionWrong];
  };

  const optionTextStyle = (option: string) => {
    if (!answered) return styles.optionText;
    if (option === phrase.somali) return [styles.optionText, styles.optionTextCorrect];
    if (selected === option) return [styles.optionText, styles.optionTextWrong];
    return styles.optionText;
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.instruction}>Which is the correct Somali translation?</Text>

        <View style={styles.englishCard}>
          <Text style={styles.langLabel}>ENGLISH</Text>
          <Text style={styles.english}>{phrase.english}</Text>
        </View>

        <View style={styles.optionsContainer}>
          {options.map((option, i) => (
            <Pressable key={i} style={optionStyle(option)} onPress={() => handleSelect(option)}>
              <Text style={optionTextStyle(option)} numberOfLines={3}>{option}</Text>
              {answered && option === phrase.somali && (
                <Text style={styles.correctMark}>✓</Text>
              )}
              {answered && selected === option && option !== phrase.somali && (
                <Text style={styles.wrongMark}>✗</Text>
              )}
            </Pressable>
          ))}
        </View>

        {answered && (
          <View style={[
            styles.feedbackBanner,
            selected === phrase.somali ? styles.feedbackCorrect : styles.feedbackWrong,
          ]}>
            <Text style={[
              styles.feedbackText,
              selected === phrase.somali ? styles.feedbackTextCorrect : styles.feedbackTextWrong,
            ]}>
              {selected === phrase.somali ? '✓ Correct!' : `✗ The correct answer was: ${phrase.somali}`}
            </Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.navBar}>
        <Pressable style={styles.navBtn} onPress={handleBack}>
          <Text style={styles.navBtnText}>← Back</Text>
        </Pressable>
        <Text style={styles.counter}>{phraseIndex + 1} of {total}</Text>
        <Pressable
          style={[styles.navBtnNext, !answered && styles.navBtnDisabled]}
          onPress={handleNext}
        >
          <Text style={[styles.navBtnNextText, !answered && styles.navBtnNextTextDisabled]}>
            {phraseIndex < total - 1 ? 'Next →' : 'Done →'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    gap: 16,
    paddingBottom: 8,
  },
  instruction: {
    fontSize: 13,
    color: AppColors.textSecondary,
    fontWeight: '500',
    textAlign: 'center',
  },
  englishCard: {
    backgroundColor: AppColors.card,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: AppColors.border,
    gap: 6,
    alignItems: 'center',
  },
  langLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: AppColors.textSecondary,
    letterSpacing: 1,
  },
  english: {
    fontSize: 22,
    fontWeight: '700',
    color: AppColors.textPrimary,
    textAlign: 'center',
    lineHeight: 30,
  },
  optionsContainer: {
    gap: 10,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: AppColors.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1.5,
    borderColor: AppColors.border,
  },
  optionCorrect: {
    borderColor: AppColors.primary,
    backgroundColor: AppColors.primaryMuted,
  },
  optionWrong: {
    borderColor: AppColors.error,
    backgroundColor: '#2D0A0A',
  },
  optionText: {
    fontSize: 14,
    color: AppColors.textPrimary,
    flex: 1,
    lineHeight: 20,
  },
  optionTextCorrect: {
    color: AppColors.primary,
    fontWeight: '600',
  },
  optionTextWrong: {
    color: AppColors.error,
  },
  correctMark: {
    fontSize: 16,
    color: AppColors.primary,
    fontWeight: '700',
    marginLeft: 8,
  },
  wrongMark: {
    fontSize: 16,
    color: AppColors.error,
    fontWeight: '700',
    marginLeft: 8,
  },
  feedbackBanner: {
    borderRadius: 12,
    padding: 14,
  },
  feedbackCorrect: {
    backgroundColor: AppColors.primaryMuted,
  },
  feedbackWrong: {
    backgroundColor: '#2D0A0A',
  },
  feedbackText: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
  },
  feedbackTextCorrect: {
    color: AppColors.primary,
  },
  feedbackTextWrong: {
    color: AppColors.error,
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: AppColors.border,
    backgroundColor: AppColors.background,
  },
  navBtn: {
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  navBtnText: {
    fontSize: 14,
    color: AppColors.textSecondary,
    fontWeight: '600',
  },
  navBtnNext: {
    backgroundColor: AppColors.primary,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 18,
  },
  navBtnDisabled: {
    backgroundColor: AppColors.border,
  },
  navBtnNextText: {
    fontSize: 14,
    color: AppColors.background,
    fontWeight: '700',
  },
  navBtnNextTextDisabled: {
    color: AppColors.textSecondary,
  },
  counter: {
    fontSize: 13,
    color: AppColors.textSecondary,
    fontWeight: '500',
  },
});
