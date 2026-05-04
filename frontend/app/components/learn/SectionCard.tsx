import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { AppColors } from '@/constants/theme';
import type { Section } from '@/types/api';

type BadgeVariant = 'primary' | 'purple' | 'gold';
const BADGE_VARIANTS: BadgeVariant[] = ['primary', 'purple', 'gold'];

interface Props {
  section: Section;
  previousSectionOrder: number | null;
  onContinue: (subtopicId: number) => void;
}

export function SectionCard({ section, previousSectionOrder, onContinue }: Props) {
  const variant = BADGE_VARIANTS[(section.order - 1) % 3];
  const totalSubtopics = section.subtopics.length;
  const progressPct =
    totalSubtopics > 0
      ? Math.round((section.subtopics_completed / totalSubtopics) * 100)
      : 0;

  const tagSubtopics = section.subtopics.slice(0, 2);
  const overflow = totalSubtopics - tagSubtopics.length;

  const currentSubtopicId =
    section.subtopics_completed < totalSubtopics
      ? section.subtopics[section.subtopics_completed].id
      : section.subtopics[totalSubtopics - 1]?.id;

  return (
    <Card>
      <View style={styles.topRow}>
        <Badge label={section.category_tag} variant={variant} />
        <View style={styles.xpBadge}>
          <Text style={styles.xpText}>⚡ {section.xp_reward} XP</Text>
        </View>
      </View>

      <Text style={styles.sectionNumber}>Section {section.order}</Text>
      <Text style={styles.title}>{section.title}</Text>

      {!section.is_unlocked ? (
        <>
          <Text style={styles.lockText}>
            🔒 Complete Section {previousSectionOrder} to unlock
          </Text>
          <View style={styles.tagsRow}>
            {tagSubtopics.map((s) => (
              <View key={s.id} style={styles.tag}>
                <Text style={styles.tagText}>{s.title}</Text>
              </View>
            ))}
            {overflow > 0 && (
              <View style={styles.tag}>
                <Text style={styles.tagText}>+{overflow}</Text>
              </View>
            )}
          </View>
        </>
      ) : (
        <>
          <Text style={styles.description}>{section.description}</Text>

          <View style={styles.progressRow}>
            <Text style={styles.subtopicCount}>
              {section.subtopics_completed} / {totalSubtopics} subtopics
            </Text>
            <Text style={styles.progressPct}>{progressPct}%</Text>
          </View>
          <View style={styles.barWrap}>
            <ProgressBar value={progressPct} height={4} />
          </View>

          {!section.is_completed && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.actionRow}
            >
              <Button
                label="Continue →"
                size="sm"
                onPress={() => currentSubtopicId !== undefined && onContinue(currentSubtopicId)}
              />
              {tagSubtopics.map((s) => (
                <View key={s.id} style={styles.tag}>
                  <Text style={styles.tagText}>{s.title}</Text>
                </View>
              ))}
              {overflow > 0 && (
                <View style={styles.tag}>
                  <Text style={styles.tagText}>+{overflow}</Text>
                </View>
              )}
            </ScrollView>
          )}

          {section.is_completed && (
            <View style={styles.completedBadge}>
              <Text style={styles.completedText}>✓ Completed</Text>
            </View>
          )}
        </>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  xpBadge: {
    backgroundColor: AppColors.goldMuted,
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  xpText: {
    color: AppColors.gold,
    fontSize: 12,
    fontWeight: '600',
  },
  sectionNumber: {
    fontSize: 12,
    color: AppColors.textSecondary,
    fontWeight: '500',
    marginBottom: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: AppColors.textPrimary,
    marginBottom: 8,
  },
  description: {
    fontSize: 13,
    color: AppColors.textSecondary,
    lineHeight: 18,
    marginBottom: 12,
  },
  lockText: {
    fontSize: 13,
    color: AppColors.textSecondary,
    fontStyle: 'italic',
    marginBottom: 12,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  subtopicCount: {
    fontSize: 12,
    color: AppColors.textSecondary,
  },
  progressPct: {
    fontSize: 12,
    fontWeight: '600',
    color: AppColors.primary,
  },
  barWrap: {
    marginBottom: 14,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 12,
    backgroundColor: AppColors.card,
    borderWidth: 1,
    borderColor: AppColors.border,
  },
  tagText: {
    fontSize: 12,
    color: AppColors.textSecondary,
    fontWeight: '500',
  },
  completedBadge: {
    alignSelf: 'flex-start',
    backgroundColor: AppColors.primaryMuted,
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 12,
  },
  completedText: {
    fontSize: 12,
    color: AppColors.primary,
    fontWeight: '600',
  },
});
