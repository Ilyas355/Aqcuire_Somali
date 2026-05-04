import { StyleSheet, Text, View } from 'react-native';

import { AppColors } from '@/constants/theme';
import type { LessonStep } from '@/types/api';

const STEPS: { key: LessonStep; label: string }[] = [
  { key: 'template', label: 'Template' },
  { key: 'practice', label: 'Practice' },
  { key: 'quiz', label: 'Quiz' },
  { key: 'review', label: 'Review' },
];

const STEP_ORDER: Record<LessonStep, number> = {
  template: 0,
  practice: 1,
  quiz: 2,
  review: 3,
};

interface Props {
  currentStep: LessonStep;
}

export function StepIndicator({ currentStep }: Props) {
  const currentOrder = STEP_ORDER[currentStep];

  return (
    <View style={styles.container}>
      {STEPS.map((step, index) => {
        const order = STEP_ORDER[step.key];
        const isPast = order < currentOrder;
        const isCurrent = order === currentOrder;

        return (
          <View key={step.key} style={styles.stepWrapper}>
            {index > 0 && (
              <View style={[styles.connector, isPast && styles.connectorActive]} />
            )}
            <View style={styles.dotColumn}>
              <View style={[
                styles.dot,
                isCurrent && styles.dotCurrent,
                isPast && styles.dotPast,
              ]}>
                <Text style={styles.dotText}>{isPast ? '✓' : ''}</Text>
              </View>
              <Text style={[styles.label, isCurrent && styles.labelCurrent]}>
                {step.label}
              </Text>
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  stepWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  connector: {
    width: 32,
    height: 2,
    backgroundColor: AppColors.border,
    marginBottom: 16,
  },
  connectorActive: {
    backgroundColor: AppColors.primary,
  },
  dotColumn: {
    alignItems: 'center',
    gap: 4,
  },
  dot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: AppColors.border,
    backgroundColor: AppColors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotCurrent: {
    borderColor: AppColors.primary,
    backgroundColor: AppColors.primary,
  },
  dotPast: {
    borderColor: AppColors.primary,
    backgroundColor: AppColors.primaryMuted,
  },
  dotText: {
    fontSize: 12,
    color: AppColors.primary,
    fontWeight: '700',
  },
  label: {
    fontSize: 10,
    color: AppColors.textSecondary,
    fontWeight: '500',
  },
  labelCurrent: {
    color: AppColors.primary,
    fontWeight: '700',
  },
});
