import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { AppColors } from '@/constants/theme';
import { useSubmitQuiz } from '@/hooks/useLesson';
import type { Phrase, QuizQuestion, QuizSubmitResponse } from '@/types/api';

const LAYER_ORDER: Record<string, number> = { recognition: 0, recall: 1, production: 2 };
const LAYER_NUM: Record<string, number> = { recognition: 1, recall: 2, production: 3 };
const LAYER_LABEL: Record<string, string> = { recognition: 'Recognition', recall: 'Recall', production: 'Production' };

interface QuizQuestionWithPhrase extends QuizQuestion {
  phrase: Phrase;
}

interface Props {
  phrases: Phrase[];
  onComplete: (totalXp: number) => void;
  onBack: () => void;
}

export function QuizStep({ phrases, onComplete, onBack }: Props) {
  const allQuestions: QuizQuestionWithPhrase[] = useMemo(() => {
    const flat = phrases.flatMap(p => p.quiz_questions.map(q => ({ ...q, phrase: p })));
    return flat.sort((a, b) => LAYER_ORDER[a.layer] - LAYER_ORDER[b.layer]);
  }, [phrases]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [productionInput, setProductionInput] = useState('');
  const [result, setResult] = useState<QuizSubmitResponse | null>(null);
  const [totalXp, setTotalXp] = useState(0);

  const { mutate: submitQuiz, isPending } = useSubmitQuiz();

  const question = allQuestions[currentIndex];
  const total = allQuestions.length;

  const shuffledOptions = useMemo(() => {
    if (!question || question.layer === 'production') return [];
    return [
      question.correct_answer,
      question.distractor_1,
      question.distractor_2,
      question.distractor_3,
    ].filter(o => o.trim().length > 0).sort(() => Math.random() - 0.5);
  }, [currentIndex]);

  if (total === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>No quiz questions yet</Text>
        <Text style={styles.emptyBody}>Quiz questions will appear here once added to this subtopic.</Text>
        <Pressable style={styles.skipBtn} onPress={() => onComplete(0)}>
          <Text style={styles.skipBtnText}>Continue to Review →</Text>
        </Pressable>
      </View>
    );
  }

  const handleSelectOption = (option: string) => {
    if (result || isPending) return;
    setSelected(option);
    submitQuiz(
      { question_id: question.id, answer_given: option },
      {
        onSuccess: (res) => {
          setResult(res);
          if (res.is_correct) setTotalXp(prev => prev + res.xp_awarded);
        },
      },
    );
  };

  const handleProductionSubmit = () => {
    if (result || isPending || !productionInput.trim()) return;
    submitQuiz(
      { question_id: question.id, answer_given: productionInput.trim() },
      {
        onSuccess: (res) => {
          setResult(res);
          if (res.is_correct) setTotalXp(prev => prev + res.xp_awarded);
        },
      },
    );
  };

  const handleNext = () => {
    if (!result) return;
    if (currentIndex < total - 1) {
      setCurrentIndex(i => i + 1);
      setSelected(null);
      setProductionInput('');
      setResult(null);
    } else {
      onComplete(totalXp);
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex(i => i - 1);
      setSelected(null);
      setProductionInput('');
      setResult(null);
    } else {
      onBack();
    }
  };

  const optionStyle = (option: string) => {
    if (!result || selected !== option) {
      if (result && option === question.correct_answer) return [styles.option, styles.optionCorrect];
      return styles.option;
    }
    if (option === question.correct_answer) return [styles.option, styles.optionCorrect];
    return [styles.option, styles.optionWrong];
  };

  const currentLayer = question.layer;
  const layerNum = LAYER_NUM[currentLayer];

  return (
    <View style={styles.container}>
      {/* Layer pills */}
      <View style={styles.layerRow}>
        {(['recognition', 'recall', 'production'] as const).map(layer => (
          <View
            key={layer}
            style={[styles.layerPill, currentLayer === layer && styles.layerPillActive]}
          >
            <Text style={[styles.layerPillText, currentLayer === layer && styles.layerPillTextActive]}>
              {LAYER_NUM[layer]} {LAYER_LABEL[layer]}
            </Text>
          </View>
        ))}
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.questionMeta}>
          <Text style={styles.questionCount}>Question {currentIndex + 1} of {total}</Text>
          <View style={styles.layerBadge}>
            <Text style={styles.layerBadgeText}>Layer {layerNum} — {LAYER_LABEL[currentLayer]}</Text>
          </View>
        </View>

        <Text style={styles.questionText}>{question.question_text}</Text>

        {/* Multiple choice */}
        {question.layer !== 'production' && (
          <View style={styles.optionsContainer}>
            {shuffledOptions.map((option, i) => (
              <Pressable
                key={i}
                style={optionStyle(option)}
                onPress={() => handleSelectOption(option)}
                disabled={!!result || isPending}
              >
                <Text style={[
                  styles.optionText,
                  result && option === question.correct_answer && styles.optionTextCorrect,
                  result && selected === option && option !== question.correct_answer && styles.optionTextWrong,
                ]} numberOfLines={3}>
                  {option}
                </Text>
                {result && option === question.correct_answer && <Text style={styles.mark}>✓</Text>}
                {result && selected === option && option !== question.correct_answer && <Text style={styles.markWrong}>✗</Text>}
              </Pressable>
            ))}
          </View>
        )}

        {/* Production input */}
        {question.layer === 'production' && (
          <View style={styles.productionContainer}>
            <TextInput
              style={styles.productionInput}
              value={productionInput}
              onChangeText={setProductionInput}
              placeholder="Type your answer in Somali..."
              placeholderTextColor={AppColors.textSecondary}
              multiline
              editable={!result}
            />
            {!result && (
              <Pressable
                style={[styles.checkBtn, !productionInput.trim() && styles.checkBtnDisabled]}
                onPress={handleProductionSubmit}
                disabled={!productionInput.trim() || isPending}
              >
                <Text style={styles.checkBtnText}>Check</Text>
              </Pressable>
            )}
          </View>
        )}

        {/* Feedback */}
        {result && (
          <View style={[styles.feedback, result.is_correct ? styles.feedbackCorrect : styles.feedbackWrong]}>
            <View style={styles.feedbackTop}>
              <Text style={[styles.feedbackLabel, result.is_correct ? styles.feedbackLabelCorrect : styles.feedbackLabelWrong]}>
                {result.is_correct ? '✓ Correct!' : '✗ Incorrect'}
              </Text>
              {result.is_correct && result.xp_awarded > 0 && (
                <View style={styles.xpPill}>
                  <Text style={styles.xpPillText}>+{result.xp_awarded} XP</Text>
                </View>
              )}
            </View>
            {!result.is_correct && (
              <Text style={styles.correctAnswerText}>
                Correct answer: {result.correct_answer}
              </Text>
            )}
            {question.phrase.grammar_notes.length > 0 && (
              <Text style={styles.grammarHint}>
                {question.phrase.grammar_notes[0].note}
              </Text>
            )}
          </View>
        )}
      </ScrollView>

      <View style={styles.navBar}>
        <Pressable style={styles.navBtn} onPress={handleBack}>
          <Text style={styles.navBtnText}>← Back</Text>
        </Pressable>
        <Text style={styles.counter}>{currentIndex + 1} of {total}</Text>
        <Pressable
          style={[styles.navBtnNext, !result && styles.navBtnDisabled]}
          onPress={handleNext}
        >
          <Text style={[styles.navBtnNextText, !result && styles.navBtnNextTextDisabled]}>
            {currentIndex < total - 1 ? 'Next →' : 'Finish →'}
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
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    gap: 12,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: AppColors.textPrimary,
    textAlign: 'center',
  },
  emptyBody: {
    fontSize: 14,
    color: AppColors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  skipBtn: {
    marginTop: 8,
    backgroundColor: AppColors.primary,
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 24,
  },
  skipBtnText: {
    fontSize: 14,
    color: AppColors.background,
    fontWeight: '700',
  },
  layerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.border,
  },
  layerPill: {
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: AppColors.card,
    borderWidth: 1,
    borderColor: AppColors.border,
  },
  layerPillActive: {
    backgroundColor: AppColors.primaryMuted,
    borderColor: AppColors.primary,
  },
  layerPillText: {
    fontSize: 11,
    color: AppColors.textSecondary,
    fontWeight: '600',
  },
  layerPillTextActive: {
    color: AppColors.primary,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    gap: 16,
    paddingBottom: 8,
  },
  questionMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  questionCount: {
    fontSize: 12,
    color: AppColors.textSecondary,
    fontWeight: '500',
  },
  layerBadge: {
    backgroundColor: AppColors.card,
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: AppColors.border,
  },
  layerBadgeText: {
    fontSize: 11,
    color: AppColors.textSecondary,
    fontWeight: '600',
  },
  questionText: {
    fontSize: 20,
    fontWeight: '700',
    color: AppColors.textPrimary,
    lineHeight: 28,
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
  mark: {
    fontSize: 16,
    color: AppColors.primary,
    fontWeight: '700',
    marginLeft: 8,
  },
  markWrong: {
    fontSize: 16,
    color: AppColors.error,
    fontWeight: '700',
    marginLeft: 8,
  },
  productionContainer: {
    gap: 12,
  },
  productionInput: {
    backgroundColor: AppColors.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1.5,
    borderColor: AppColors.border,
    color: AppColors.textPrimary,
    fontSize: 16,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  checkBtn: {
    backgroundColor: AppColors.primary,
    borderRadius: 20,
    paddingVertical: 12,
    alignItems: 'center',
  },
  checkBtnDisabled: {
    backgroundColor: AppColors.border,
  },
  checkBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: AppColors.background,
  },
  feedback: {
    borderRadius: 12,
    padding: 16,
    gap: 6,
  },
  feedbackCorrect: {
    backgroundColor: AppColors.primaryMuted,
  },
  feedbackWrong: {
    backgroundColor: '#2D0A0A',
  },
  feedbackTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  feedbackLabel: {
    fontSize: 15,
    fontWeight: '700',
  },
  feedbackLabelCorrect: {
    color: AppColors.primary,
  },
  feedbackLabelWrong: {
    color: AppColors.error,
  },
  xpPill: {
    backgroundColor: AppColors.goldMuted,
    borderRadius: 20,
    paddingVertical: 3,
    paddingHorizontal: 10,
  },
  xpPillText: {
    fontSize: 12,
    color: AppColors.gold,
    fontWeight: '700',
  },
  correctAnswerText: {
    fontSize: 13,
    color: AppColors.error,
    lineHeight: 20,
  },
  grammarHint: {
    fontSize: 12,
    color: AppColors.textSecondary,
    lineHeight: 18,
    fontStyle: 'italic',
    marginTop: 2,
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
