import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { AppColors } from '@/constants/theme';
import type { SubtopicDetail } from '@/types/api';

interface Props {
  subtopic: SubtopicDetail;
  onComplete: () => void;
  onBack: () => void;
}

export function ReviewStep({ subtopic, onComplete, onBack }: Props) {
  const { key_patterns, phrases, common_mistakes, survival_lines } = subtopic;

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Encouragement */}
        <View style={styles.encourageCard}>
          <Text style={styles.encourageEmoji}>🎉</Text>
          <Text style={styles.encourageTitle}>You've got this!</Text>
          <Text style={styles.encourageBody}>Here's your quick reference.</Text>
        </View>

        {/* Key Patterns */}
        {key_patterns.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>KEY PATTERNS</Text>
            {key_patterns.map(kp => (
              <View key={kp.id} style={styles.patternCard}>
                <View style={styles.patternRow}>
                  <Text style={styles.patternSomali}>{kp.somali_pattern}</Text>
                  <Text style={styles.patternArrow}>→</Text>
                  <Text style={styles.patternEnglish}>{kp.english_pattern}</Text>
                </View>
                {kp.breakdown.length > 0 && (
                  <Text style={styles.patternBreakdown}>{kp.breakdown}</Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Examples */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>EXAMPLES</Text>
          {phrases.slice(0, 8).map(p => (
            <View key={p.id} style={styles.exampleRow}>
              <Text style={styles.exampleSomali}>{p.somali}</Text>
              <Text style={styles.exampleEnglish}>{p.english}</Text>
            </View>
          ))}
          {phrases.length > 8 && (
            <Text style={styles.moreText}>+{phrases.length - 8} more phrases</Text>
          )}
        </View>

        {/* Common Mistakes */}
        {common_mistakes.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>COMMON MISTAKES</Text>
            {common_mistakes.map(cm => (
              <View key={cm.id} style={styles.mistakeCard}>
                <Text style={styles.mistakeWrong}>✗ {cm.wrong}</Text>
                <Text style={styles.mistakeCorrect}>✓ {cm.correct}</Text>
                {cm.explanation.length > 0 && (
                  <Text style={styles.mistakeExplanation}>{cm.explanation}</Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Survival Lines */}
        {survival_lines.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>SURVIVAL LINES</Text>
            <View style={styles.survivalCard}>
              {survival_lines.map(sl => (
                <Text key={sl.id} style={styles.survivalLine}>• {sl.somali}</Text>
              ))}
            </View>
          </View>
        )}
      </ScrollView>

      <View style={styles.navBar}>
        <Pressable style={styles.navBtn} onPress={onBack}>
          <Text style={styles.navBtnText}>← Back</Text>
        </Pressable>
        <Pressable style={styles.nextSubtopicBtn} onPress={onComplete}>
          <Text style={styles.nextSubtopicBtnText}>Next subtopic →</Text>
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
    gap: 20,
    paddingBottom: 8,
  },
  encourageCard: {
    backgroundColor: AppColors.primaryMuted,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    gap: 4,
  },
  encourageEmoji: {
    fontSize: 32,
    marginBottom: 4,
  },
  encourageTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: AppColors.primary,
  },
  encourageBody: {
    fontSize: 14,
    color: AppColors.primary,
    opacity: 0.8,
  },
  section: {
    gap: 10,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: AppColors.textSecondary,
    letterSpacing: 1,
  },
  patternCard: {
    backgroundColor: AppColors.card,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: AppColors.border,
    gap: 6,
  },
  patternRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  patternSomali: {
    fontSize: 15,
    fontWeight: '700',
    color: AppColors.textPrimary,
  },
  patternArrow: {
    fontSize: 14,
    color: AppColors.textSecondary,
  },
  patternEnglish: {
    fontSize: 14,
    color: AppColors.textSecondary,
    flex: 1,
  },
  patternBreakdown: {
    fontSize: 12,
    color: AppColors.textSecondary,
    fontStyle: 'italic',
    lineHeight: 18,
  },
  exampleRow: {
    backgroundColor: AppColors.card,
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: AppColors.border,
    gap: 2,
  },
  exampleSomali: {
    fontSize: 14,
    fontWeight: '600',
    color: AppColors.primary,
  },
  exampleEnglish: {
    fontSize: 13,
    color: AppColors.textSecondary,
  },
  moreText: {
    fontSize: 13,
    color: AppColors.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  mistakeCard: {
    backgroundColor: AppColors.card,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: AppColors.border,
    gap: 4,
  },
  mistakeWrong: {
    fontSize: 14,
    color: AppColors.error,
    fontWeight: '500',
  },
  mistakeCorrect: {
    fontSize: 14,
    color: AppColors.primary,
    fontWeight: '600',
  },
  mistakeExplanation: {
    fontSize: 12,
    color: AppColors.textSecondary,
    lineHeight: 18,
    marginTop: 2,
  },
  survivalCard: {
    backgroundColor: AppColors.card,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: AppColors.border,
    gap: 8,
  },
  survivalLine: {
    fontSize: 14,
    color: AppColors.textPrimary,
    lineHeight: 22,
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
  nextSubtopicBtn: {
    backgroundColor: AppColors.primary,
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 22,
  },
  nextSubtopicBtnText: {
    fontSize: 14,
    color: AppColors.background,
    fontWeight: '700',
  },
});
