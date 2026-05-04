import { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { LessonHeader } from '@/components/lesson/LessonHeader';
import { StepIndicator } from '@/components/lesson/StepIndicator';
import { TemplateStep } from '@/components/lesson/TemplateStep';
import { PracticeStep } from '@/components/lesson/PracticeStep';
import { QuizStep } from '@/components/lesson/QuizStep';
import { ReviewStep } from '@/components/lesson/ReviewStep';
import { AppColors } from '@/constants/theme';
import { useSubtopicDetail, useUpdateSubtopicProgress } from '@/hooks/useLesson';
import type { LessonStep } from '@/types/api';

const STEP_LABELS: Record<LessonStep, string> = {
  template: 'Template',
  practice: 'Practice',
  quiz: 'Quiz',
  review: 'Review',
};

export default function LessonScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const subtopicId = Number(id);
  const router = useRouter();

  const { data: subtopic, isLoading, isError } = useSubtopicDetail(subtopicId);
  const { mutate: updateProgress } = useUpdateSubtopicProgress(subtopicId);

  const [currentStep, setCurrentStep] = useState<LessonStep>('template');

  const advanceToStep = (step: LessonStep, isCompleted = false) => {
    setCurrentStep(step);
    if (subtopic) {
      updateProgress({
        current_step: step,
        phrases_completed: subtopic.phrases.length,
        is_completed: isCompleted,
      });
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
        <View style={styles.centered}>
          <ActivityIndicator color={AppColors.primary} size="large" />
        </View>
      </SafeAreaView>
    );
  }

  if (isError || !subtopic) {
    return (
      <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
        <View style={styles.centered}>
          <Text style={styles.errorText}>Failed to load lesson. Please try again.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <LessonHeader
        sectionTitle={subtopic.section_title}
        xpReward={subtopic.section_xp_reward}
        stepLabel={STEP_LABELS[currentStep]}
      />
      <StepIndicator currentStep={currentStep} />

      {currentStep === 'template' && (
        <TemplateStep
          phrases={subtopic.phrases}
          onComplete={() => advanceToStep('practice')}
          onBack={() => router.back()}
        />
      )}

      {currentStep === 'practice' && (
        <PracticeStep
          phrases={subtopic.phrases}
          onComplete={() => advanceToStep('quiz')}
          onBack={() => setCurrentStep('template')}
        />
      )}

      {currentStep === 'quiz' && (
        <QuizStep
          phrases={subtopic.phrases}
          onComplete={() => advanceToStep('review')}
          onBack={() => setCurrentStep('practice')}
        />
      )}

      {currentStep === 'review' && (
        <ReviewStep
          subtopic={subtopic}
          onComplete={() => {
            advanceToStep('review', true);
            router.back();
          }}
          onBack={() => setCurrentStep('quiz')}
        />
      )}
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
  errorText: {
    fontSize: 14,
    color: AppColors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
});
