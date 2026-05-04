import { StyleSheet, Text, View } from 'react-native';

import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { AppColors } from '@/constants/theme';
import type { CurrentSubtopic, LessonStep } from '@/types/api';

const STEP_PROGRESS: Record<LessonStep, number> = {
  template: 0,
  practice: 33,
  quiz: 66,
  review: 99,
};

const STEP_LABEL: Record<LessonStep, string> = {
  template: 'Template',
  practice: 'Practice',
  quiz: 'Quiz',
  review: 'Review',
};

interface Props {
  subtopic: CurrentSubtopic | null;
  onContinue: () => void;
}

export function ContinueLearningCard({ subtopic, onContinue }: Props) {
  if (!subtopic) {
    return (
      <Card>
        <Text style={styles.emptyLabel}>Ready to start?</Text>
        <Text style={styles.emptyBody}>
          Head to Learn to begin your first lesson.
        </Text>
      </Card>
    );
  }

  const progress = STEP_PROGRESS[subtopic.current_step];

  return (
    <Card>
      <Badge label={subtopic.section} variant="primary" />
      <Text style={styles.continueLabel}>CONTINUE LEARNING</Text>
      <Text style={styles.title}>{subtopic.title}</Text>
      <Text style={styles.step}>Step: {STEP_LABEL[subtopic.current_step]}</Text>
      <View style={styles.progressRow}>
        <ProgressBar value={progress} />
        <Text style={styles.progressText}>{progress}%</Text>
      </View>
      <Button label="Continue →" onPress={onContinue} fullWidth />
    </Card>
  );
}

const styles = StyleSheet.create({
  emptyLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: AppColors.textPrimary,
    marginBottom: 4,
  },
  emptyBody: {
    fontSize: 14,
    color: AppColors.textSecondary,
  },
  continueLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: AppColors.textSecondary,
    letterSpacing: 0.8,
    marginTop: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: AppColors.textPrimary,
    marginTop: 4,
  },
  step: {
    fontSize: 13,
    color: AppColors.textSecondary,
    marginTop: 2,
    marginBottom: 12,
  },
  progressRow: {
    gap: 6,
    marginBottom: 16,
  },
  progressText: {
    fontSize: 12,
    color: AppColors.textSecondary,
  },
});
