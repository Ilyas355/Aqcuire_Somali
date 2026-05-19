import { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { StoryQuizCard } from '@/components/story/StoryQuizCard';
import { AppColors } from '@/constants/theme';
import { useCompleteStory, useStoryQuiz } from '@/hooks/useStories';

export default function StoryQuizScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const storyId = Number(id ?? '0');

  const { data: questions, isLoading } = useStoryQuiz(storyId);
  const { mutate: completeStory, isPending: isCompleting } = useCompleteStory();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [phase, setPhase] = useState<'quiz' | 'results' | 'done'>('quiz');
  const [xpEarned, setXpEarned] = useState(0);

  const handleNext = (wasCorrect: boolean) => {
    const newCorrect = correctCount + (wasCorrect ? 1 : 0);
    setCorrectCount(newCorrect);

    if (!questions) return;
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      setPhase('results');
    }
  };

  const handleCollectXp = () => {
    completeStory(storyId, {
      onSuccess: (data) => {
        setXpEarned(data.xp_awarded);
        setPhase('done');
      },
    });
  };

  const handleDone = () => {
    router.replace('/(tabs)/listen');
  };

  if (isLoading || !questions) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.centered}>
          <ActivityIndicator color={AppColors.purple} size="large" />
        </View>
      </SafeAreaView>
    );
  }

  if (questions.length === 0) {
    completeStory(storyId);
    router.replace('/(tabs)/listen');
    return null;
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <Text style={styles.headerLabel}>STORY QUIZ</Text>
        {phase === 'quiz' && (
          <View style={styles.dotsRow}>
            {questions.map((_, i) => (
              <View
                key={i}
                style={[
                  styles.dot,
                  i < currentIndex ? styles.dotDone :
                  i === currentIndex ? styles.dotActive :
                  styles.dotEmpty,
                ]}
              />
            ))}
          </View>
        )}
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {phase === 'quiz' && (
          <StoryQuizCard
            question={questions[currentIndex]}
            index={currentIndex}
            total={questions.length}
            onNext={handleNext}
          />
        )}

        {phase === 'results' && (
          <View style={styles.resultsCard}>
            <Text style={styles.resultsEmoji}>
              {correctCount === questions.length ? '🏆' : correctCount >= questions.length / 2 ? '⭐' : '📚'}
            </Text>
            <Text style={styles.resultsTitle}>Quiz complete!</Text>
            <Text style={styles.resultsScore}>
              {correctCount} / {questions.length} correct
            </Text>
            <Text style={styles.resultsSub}>
              {correctCount === questions.length
                ? 'Perfect score — outstanding comprehension!'
                : correctCount >= questions.length / 2
                ? 'Good work — keep listening to improve.'
                : 'Keep practising — every listen counts.'}
            </Text>
            <Pressable
              style={[styles.collectBtn, isCompleting && styles.btnDisabled]}
              onPress={handleCollectXp}
              disabled={isCompleting}
            >
              <Text style={styles.collectBtnText}>
                {isCompleting ? 'Saving...' : 'Collect XP →'}
              </Text>
            </Pressable>
          </View>
        )}

        {phase === 'done' && (
          <View style={styles.resultsCard}>
            <Text style={styles.resultsEmoji}>🎉</Text>
            <Text style={styles.resultsTitle}>Story complete!</Text>
            {xpEarned > 0 && (
              <View style={styles.xpBadge}>
                <Text style={styles.xpBadgeText}>+{xpEarned} XP</Text>
              </View>
            )}
            {xpEarned === 0 && (
              <Text style={styles.resultsSub}>Already completed — no new XP.</Text>
            )}
            <Pressable style={styles.doneBtn} onPress={handleDone}>
              <Text style={styles.doneBtnText}>Back to Stories</Text>
            </Pressable>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: AppColors.background,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.border,
    gap: 10,
  },
  headerLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: AppColors.purple,
    letterSpacing: 1.2,
    textAlign: 'center',
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  dot: {
    width: 28,
    height: 4,
    borderRadius: 2,
  },
  dotDone: {
    backgroundColor: AppColors.purple,
  },
  dotActive: {
    backgroundColor: AppColors.purpleLight,
  },
  dotEmpty: {
    backgroundColor: AppColors.surface3,
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  resultsCard: {
    backgroundColor: AppColors.card,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: AppColors.border,
    padding: 32,
    alignItems: 'center',
    gap: 14,
    marginTop: 24,
  },
  resultsEmoji: {
    fontSize: 56,
  },
  resultsTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: AppColors.textPrimary,
  },
  resultsScore: {
    fontSize: 32,
    fontWeight: '800',
    color: AppColors.purple,
  },
  resultsSub: {
    fontSize: 14,
    color: AppColors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  collectBtn: {
    backgroundColor: AppColors.purple,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 32,
    marginTop: 8,
  },
  btnDisabled: {
    opacity: 0.5,
  },
  collectBtnText: {
    color: AppColors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
  },
  xpBadge: {
    backgroundColor: AppColors.gold,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 24,
  },
  xpBadgeText: {
    fontSize: 22,
    fontWeight: '800',
    color: AppColors.background,
  },
  doneBtn: {
    backgroundColor: AppColors.primary,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 32,
    marginTop: 8,
  },
  doneBtnText: {
    color: AppColors.background,
    fontSize: 16,
    fontWeight: '700',
  },
});
