import { StyleSheet, Text, View } from 'react-native';

import { ProgressBar } from '@/components/ui/ProgressBar';
import { AppColors } from '@/constants/theme';
import type { Section } from '@/types/api';

interface Props {
  sections: Section[];
}

function SectionItem({ section }: { section: Section }) {
  const total = section.subtopics.length;
  const pct = total > 0 ? Math.round((section.subtopics_completed / total) * 100) : 0;

  return (
    <View style={styles.item}>
      <View style={styles.headerRow}>
        <Text style={styles.sectionTitle}>
          Section {section.order} — {section.category_tag}
        </Text>
        {section.is_unlocked ? (
          <Text style={styles.pct}>{pct}%</Text>
        ) : (
          <View style={styles.lockedBadge}>
            <Text style={styles.lockedText}>🔒 Locked</Text>
          </View>
        )}
      </View>

      <Text style={styles.subtitle} numberOfLines={1}>
        {section.title} · {section.subtopics_completed} of {total} subtopics
      </Text>

      {section.is_unlocked && (
        <View style={styles.bar}>
          <ProgressBar value={pct} height={4} />
        </View>
      )}
    </View>
  );
}

export function SectionProgressList({ sections }: Props) {
  if (sections.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>No sections available yet.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.groupLabel}>SECTION PROGRESS</Text>
      <View style={styles.list}>
        {sections.map((section) => (
          <SectionItem key={section.id} section={section} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  groupLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: AppColors.textSecondary,
    letterSpacing: 0.8,
  },
  list: {
    gap: 2,
  },
  item: {
    backgroundColor: AppColors.card,
    borderRadius: 12,
    padding: 14,
    gap: 6,
    borderWidth: 1,
    borderColor: AppColors.border,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: AppColors.textPrimary,
    flex: 1,
  },
  pct: {
    fontSize: 13,
    fontWeight: '600',
    color: AppColors.primary,
  },
  lockedBadge: {
    backgroundColor: AppColors.card,
    borderRadius: 20,
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: AppColors.border,
  },
  lockedText: {
    fontSize: 11,
    color: AppColors.textSecondary,
  },
  subtitle: {
    fontSize: 12,
    color: AppColors.textSecondary,
  },
  bar: {
    marginTop: 2,
  },
  empty: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 13,
    color: AppColors.textSecondary,
  },
});
