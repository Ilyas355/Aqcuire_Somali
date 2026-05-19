import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import * as Haptics from 'expo-haptics';

import { AppColors } from '@/constants/theme';
import type { StoryQuizQuestion } from '@/types/api';

interface Props {
  question: StoryQuizQuestion;
  index: number;
  total: number;
  onNext: (wasCorrect: boolean) => void;
}

export function StoryQuizCard({ question, index, total, onNext }: Props) {
  const [selected, setSelected] = useState<string | null>(null);

  const options = [
    question.correct_answer,
    question.distractor_1,
    question.distractor_2,
    question.distractor_3,
  ].sort();

  const handleSelect = (option: string) => {
    if (selected) return;
    setSelected(option);
    const correct = option === question.correct_answer;
    if (correct) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  const getOptionStyle = (option: string) => {
    if (!selected) return styles.option;
    if (option === question.correct_answer) return [styles.option, styles.optionCorrect];
    if (selected === option) return [styles.option, styles.optionWrong];
    return styles.option;
  };

  const getOptionTextStyle = (option: string) => {
    if (!selected) return styles.optionText;
    if (option === question.correct_answer) return [styles.optionText, styles.optionTextCorrect];
    if (selected === option) return [styles.optionText, styles.optionTextWrong];
    return styles.optionText;
  };

  const isCorrect = selected === question.correct_answer;

  return (
    <View style={styles.container}>
      <Text style={styles.counter}>Question {index + 1} of {total}</Text>

      <View style={styles.card}>
        <Text style={styles.label}>COMPREHENSION</Text>
        <Text style={styles.questionText}>{question.question_text}</Text>

        <View style={styles.options}>
          {options.map((option) => (
            <Pressable
              key={option}
              style={getOptionStyle(option)}
              onPress={() => handleSelect(option)}
              disabled={!!selected}
            >
              <Text style={getOptionTextStyle(option)}>{option}</Text>
            </Pressable>
          ))}
        </View>

        {selected && (
          <View style={styles.resultRow}>
            {isCorrect ? (
              <Text style={styles.correctText}>✓ Correct!</Text>
            ) : (
              <Text style={styles.wrongText}>✗ Answer: {question.correct_answer}</Text>
            )}
          </View>
        )}
      </View>

      {selected && (
        <Pressable style={styles.nextBtn} onPress={() => onNext(isCorrect)}>
          <Text style={styles.nextBtnText}>{index < total - 1 ? 'Next →' : 'See Results →'}</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  counter: {
    textAlign: 'center',
    fontSize: 13,
    color: AppColors.textSecondary,
    fontWeight: '600',
  },
  card: {
    backgroundColor: AppColors.card,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: AppColors.border,
    padding: 24,
    gap: 16,
  },
  label: {
    fontSize: 10,
    fontWeight: '700',
    color: AppColors.purple,
    letterSpacing: 1,
  },
  questionText: {
    fontSize: 18,
    fontWeight: '600',
    color: AppColors.textPrimary,
    lineHeight: 26,
  },
  options: {
    gap: 10,
  },
  option: {
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: AppColors.surface1,
    borderWidth: 1,
    borderColor: AppColors.border,
  },
  optionCorrect: {
    backgroundColor: AppColors.primaryMuted,
    borderColor: AppColors.primary,
  },
  optionWrong: {
    backgroundColor: AppColors.errorMuted,
    borderColor: AppColors.error,
  },
  optionText: {
    fontSize: 15,
    color: AppColors.textPrimary,
    fontWeight: '500',
  },
  optionTextCorrect: {
    color: AppColors.primary,
    fontWeight: '700',
  },
  optionTextWrong: {
    color: AppColors.error,
    fontWeight: '700',
  },
  resultRow: {
    alignItems: 'center',
    paddingTop: 4,
  },
  correctText: {
    color: AppColors.primary,
    fontWeight: '700',
    fontSize: 15,
  },
  wrongText: {
    color: AppColors.error,
    fontWeight: '700',
    fontSize: 15,
  },
  nextBtn: {
    backgroundColor: AppColors.purple,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  nextBtnText: {
    color: AppColors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
  },
});
