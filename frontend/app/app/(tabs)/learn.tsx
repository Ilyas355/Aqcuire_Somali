import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { FlashCard } from '@/components/practice/FlashCard';
import { PracticeHeader } from '@/components/practice/PracticeHeader';
import { PracticeQuizCard } from '@/components/practice/PracticeQuizCard';
import { SubtopicPicker } from '@/components/practice/SubtopicPicker';
import { ScreenWrapper } from '@/components/ui/ScreenWrapper';
import { Skeleton, SkeletonCard } from '@/components/ui/Skeleton';
import { AppColors } from '@/constants/theme';
import { useCurriculum, useSubtopicDetail } from '@/hooks/useCurriculum';
import { useHomeScreen } from '@/hooks/useHomeScreen';
import { useSubmitPracticeQuiz } from '@/hooks/usePractice';
import { useWeakQuestions } from '@/hooks/useProgress';
import type { QuizSubmitResponse } from '@/types/api';

type Mode = 'picker' | 'flashcard' | 'quiz' | 'weak' | 'done';

export default function PracticeScreen() {
  const { data: sections, isLoading: sectionsLoading, refetch, isRefetching } = useCurriculum();
  const { data: homeData } = useHomeScreen();

  const [mode, setMode] = useState<Mode>('picker');
  const [selectedId, setSelectedId] = useState<number>(0);
  const [selectedTitle, setSelectedTitle] = useState('');
  const [cardIndex, setCardIndex] = useState(0);
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizResult, setQuizResult] = useState<QuizSubmitResponse | null>(null);
  const [totalXp, setTotalXp] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);

  const { data: subtopic, isLoading: subtopicLoading } = useSubtopicDetail(selectedId);
  const { data: weakQuestions = [] } = useWeakQuestions();
  const { mutate: submitQuiz } = useSubmitPracticeQuiz();

  const [weakIndex, setWeakIndex] = useState(0);
  const [weakResult, setWeakResult] = useState<QuizSubmitResponse | null>(null);

  const phrases = subtopic?.phrases ?? [];
  const phrasesWithQuiz = phrases.filter((p) => p.quiz_questions.length > 0);

  const handleSelectSubtopic = (id: number, title: string) => {
    setSelectedId(id);
    setSelectedTitle(title);
    setCardIndex(0);
    setQuizIndex(0);
    setQuizResult(null);
    setTotalXp(0);
    setCorrectCount(0);
    setMode('flashcard');
  };

  const handleNextCard = () => {
    if (cardIndex < phrases.length - 1) {
      setCardIndex((i) => i + 1);
    } else {
      setQuizIndex(0);
      setQuizResult(null);
      setMode(phrasesWithQuiz.length > 0 ? 'quiz' : 'done');
    }
  };

  const handleQuizAnswer = (questionId: number, answer: string) => {
    submitQuiz(
      { question_id: questionId, answer_given: answer },
      {
        onSuccess: (result) => {
          setQuizResult(result);
          if (result.is_correct) {
            setTotalXp((xp) => xp + result.xp_awarded);
            setCorrectCount((n) => n + 1);
          }
        },
      },
    );
  };

  const handleNextQuiz = () => {
    if (quizIndex < phrasesWithQuiz.length - 1) {
      setQuizIndex((i) => i + 1);
      setQuizResult(null);
    } else {
      setMode('done');
    }
  };

  const handleReset = () => {
    setSelectedId(0);
    setMode('picker');
  };

  const handleStartWeak = () => {
    setWeakIndex(0);
    setWeakResult(null);
    setCorrectCount(0);
    setTotalXp(0);
    setMode('weak');
  };

  const handleWeakAnswer = (questionId: number, answer: string) => {
    submitQuiz(
      { question_id: questionId, answer_given: answer },
      {
        onSuccess: (result) => {
          setWeakResult(result);
          if (result.is_correct) {
            setTotalXp((xp) => xp + result.xp_awarded);
            setCorrectCount((n) => n + 1);
          }
        },
      },
    );
  };

  const handleNextWeak = () => {
    if (weakIndex < weakQuestions.length - 1) {
      setWeakIndex((i) => i + 1);
      setWeakResult(null);
    } else {
      setMode('done');
    }
  };

  if (sectionsLoading) {
    return (
      <ScreenWrapper scroll>
        <View style={styles.content}>
          <Skeleton height={24} width="40%" />
          <SkeletonCard><Skeleton height={80} /></SkeletonCard>
          <SkeletonCard><Skeleton height={80} /></SkeletonCard>
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper
      scroll
      onRefresh={mode === 'picker' ? refetch : undefined}
      isRefreshing={isRefetching}
    >
      <View style={styles.content}>
        <PracticeHeader streak={homeData?.user_streak ?? 0} />

        {mode === 'picker' && weakQuestions.length > 0 && (
          <Pressable style={styles.weakBanner} onPress={handleStartWeak}>
            <View style={styles.weakBannerLeft}>
              <Text style={styles.weakBannerLabel}>WEAK SPOTS</Text>
              <Text style={styles.weakBannerTitle}>Drill your mistakes</Text>
              <Text style={styles.weakBannerSub}>{weakQuestions.length} question{weakQuestions.length !== 1 ? 's' : ''} to review</Text>
            </View>
            <Text style={styles.weakBannerArrow}>→</Text>
          </Pressable>
        )}

        {mode === 'picker' && (
          <SubtopicPicker
            sections={sections ?? []}
            onSelect={handleSelectSubtopic}
          />
        )}

        {(mode === 'flashcard' || mode === 'quiz') && (
          <Pressable style={styles.backLink} onPress={handleReset}>
            <Text style={styles.backLinkText}>← {selectedTitle}</Text>
          </Pressable>
        )}

        {mode === 'weak' && (
          <Pressable style={styles.backLink} onPress={handleReset}>
            <Text style={styles.backLinkText}>← Weak spots</Text>
          </Pressable>
        )}

        {mode === 'flashcard' && subtopicLoading && (
          <SkeletonCard><Skeleton height={260} /></SkeletonCard>
        )}

        {mode === 'flashcard' && !subtopicLoading && phrases.length > 0 && (
          <FlashCard
            phrase={phrases[cardIndex]}
            index={cardIndex}
            total={phrases.length}
            onNext={handleNextCard}
          />
        )}

        {mode === 'quiz' && phrasesWithQuiz.length > 0 && (
          <PracticeQuizCard
            question={phrasesWithQuiz[quizIndex].quiz_questions[0]}
            phraseIndex={quizIndex}
            phraseTotal={phrasesWithQuiz.length}
            onAnswer={handleQuizAnswer}
            result={quizResult}
            onNext={handleNextQuiz}
          />
        )}

        {mode === 'weak' && weakQuestions.length > 0 && (
          <View style={styles.weakContext}>
            <Text style={styles.weakContextLabel}>PHRASE</Text>
            <Text style={styles.weakContextSomali}>{weakQuestions[weakIndex].phrase_somali}</Text>
            <Text style={styles.weakContextEnglish}>{weakQuestions[weakIndex].phrase_english}</Text>
            <View style={styles.weakStat}>
              <Text style={styles.weakStatText}>
                {weakQuestions[weakIndex].correct_attempts}/{weakQuestions[weakIndex].total_attempts} correct
              </Text>
            </View>
          </View>
        )}

        {mode === 'weak' && weakQuestions.length > 0 && (
          <PracticeQuizCard
            question={weakQuestions[weakIndex]}
            phraseIndex={weakIndex}
            phraseTotal={weakQuestions.length}
            onAnswer={handleWeakAnswer}
            result={weakResult}
            onNext={handleNextWeak}
          />
        )}

        {mode === 'done' && (
          <View style={styles.doneCard}>
            <Text style={styles.doneEmoji}>🎉</Text>
            <Text style={styles.doneTitle}>Session complete!</Text>
            <Text style={styles.doneSub}>{selectedTitle}</Text>
            <View style={styles.doneStats}>
              <View style={styles.doneStat}>
                <Text style={styles.doneStatNum}>{phrasesWithQuiz.length}</Text>
                <Text style={styles.doneStatLabel}>Phrases</Text>
              </View>
              <View style={styles.doneStat}>
                <Text style={styles.doneStatNum}>{correctCount}</Text>
                <Text style={styles.doneStatLabel}>Correct</Text>
              </View>
              <View style={styles.doneStat}>
                <Text style={[styles.doneStatNum, styles.xpNum]}>+{totalXp}</Text>
                <Text style={styles.doneStatLabel}>XP</Text>
              </View>
            </View>
            <Pressable style={styles.doneBtn} onPress={handleReset}>
              <Text style={styles.doneBtnText}>Practice another topic</Text>
            </Pressable>
            {weakQuestions.length > 0 && (
              <Pressable style={styles.weakDrillBtn} onPress={handleStartWeak}>
                <Text style={styles.weakDrillBtnText}>Drill weak spots ({weakQuestions.length})</Text>
              </Pressable>
            )}
          </View>
        )}
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
    gap: 16,
  },
  backLink: {
    paddingVertical: 4,
  },
  backLinkText: {
    fontSize: 14,
    color: AppColors.primary,
    fontWeight: '600',
  },
  doneCard: {
    backgroundColor: AppColors.card,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: AppColors.border,
    padding: 32,
    alignItems: 'center',
    gap: 12,
    marginTop: 24,
  },
  doneEmoji: {
    fontSize: 52,
  },
  doneTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: AppColors.textPrimary,
  },
  doneSub: {
    fontSize: 14,
    color: AppColors.textSecondary,
    marginBottom: 8,
  },
  doneStats: {
    flexDirection: 'row',
    gap: 32,
    marginBottom: 8,
  },
  doneStat: {
    alignItems: 'center',
    gap: 4,
  },
  doneStatNum: {
    fontSize: 28,
    fontWeight: '800',
    color: AppColors.textPrimary,
  },
  xpNum: {
    color: AppColors.gold,
  },
  doneStatLabel: {
    fontSize: 12,
    color: AppColors.textSecondary,
    fontWeight: '500',
  },
  doneBtn: {
    backgroundColor: AppColors.primary,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 28,
    marginTop: 8,
  },
  doneBtnText: {
    color: AppColors.onPrimary,
    fontSize: 15,
    fontWeight: '700',
  },
  weakDrillBtn: {
    borderWidth: 1,
    borderColor: AppColors.error,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 28,
    marginTop: 4,
  },
  weakDrillBtnText: {
    color: AppColors.error,
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'center',
  },
  weakBanner: {
    backgroundColor: AppColors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: AppColors.error,
    paddingVertical: 16,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  weakBannerLeft: {
    gap: 2,
  },
  weakBannerLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: AppColors.error,
    letterSpacing: 1,
  },
  weakBannerTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: AppColors.textPrimary,
  },
  weakBannerSub: {
    fontSize: 12,
    color: AppColors.textSecondary,
  },
  weakBannerArrow: {
    fontSize: 18,
    color: AppColors.error,
    fontWeight: '700',
  },
  weakContext: {
    backgroundColor: AppColors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: AppColors.border,
    padding: 16,
    gap: 4,
  },
  weakContextLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: AppColors.textTertiary,
    letterSpacing: 1,
  },
  weakContextSomali: {
    fontSize: 16,
    fontWeight: '700',
    color: AppColors.textPrimary,
  },
  weakContextEnglish: {
    fontSize: 13,
    color: AppColors.textSecondary,
  },
  weakStat: {
    marginTop: 4,
  },
  weakStatText: {
    fontSize: 11,
    color: AppColors.error,
    fontWeight: '600',
  },
});
