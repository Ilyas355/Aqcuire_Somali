import { useState } from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import * as Haptics from 'expo-haptics';

import { AppColors } from '@/constants/theme';
import type { QuizQuestion, QuizSubmitResponse } from '@/types/api';

interface Props {
  question: QuizQuestion;
  phraseIndex: number;
  phraseTotal: number;
  onAnswer: (questionId: number, answer: string) => void;
  result: QuizSubmitResponse | null;
  onNext: () => void;
}

export function PracticeQuizCard({
  question,
  phraseIndex,
  phraseTotal,
  onAnswer,
  result,
  onNext,
}: Props) {
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
    onAnswer(question.id, option);
    if (option === question.correct_answer) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  const getOptionStyle = (option: string) => {
    if (!result || selected !== option) return styles.option;
    if (option === result.correct_answer) return [styles.option, styles.optionCorrect];
    if (selected === option && !result.is_correct) return [styles.option, styles.optionWrong];
    return styles.option;
  };

  const getOptionTextStyle = (option: string) => {
    if (!result || selected !== option) return styles.optionText;
    if (option === result.correct_answer) return [styles.optionText, styles.optionTextCorrect];
    if (selected === option && !result.is_correct) return [styles.optionText, styles.optionTextWrong];
    return styles.optionText;
  };

  return (
    <View style={styles.container}>
      <View style={styles.progress}>
        <Text style={styles.progressText}>Quiz · {phraseIndex + 1} / {phraseTotal}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.layerLabel}>{question.layer.toUpperCase()}</Text>
        <Text style={styles.questionText}>{question.question_text}</Text>

        <View style={styles.options}>
          {options.map((option, i) => (
            <Pressable
              key={i}
              style={getOptionStyle(option)}
              onPress={() => handleSelect(option)}
              disabled={!!selected}
            >
              <Text style={getOptionTextStyle(option)}>{option}</Text>
            </Pressable>
          ))}
        </View>

        {result && (
          <View style={styles.resultRow}>
            {result.is_correct ? (
              <Text style={styles.correctText}>✓ Correct! +{result.xp_awarded} XP</Text>
            ) : (
              <Text style={styles.wrongText}>✗ Correct: {result.correct_answer}</Text>
            )}
          </View>
        )}
      </View>

      {result && (
        <Pressable style={styles.nextBtn} onPress={onNext}>
          <Text style={styles.nextBtnText}>Next →</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 16,
  },
  progress: {
    alignItems: 'center',
  },
  progressText: {
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
  layerLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: AppColors.primary,
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
    backgroundColor: AppColors.primary,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  nextBtnText: {
    color: AppColors.onPrimary,
    fontSize: 16,
    fontWeight: '700',
  },
});
