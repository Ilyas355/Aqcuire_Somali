import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AppColors } from '@/constants/theme';
import type { Section } from '@/types/api';

interface Props {
  sections: Section[];
  onSelect: (subtopicId: number, subtopicTitle: string) => void;
}

export function SubtopicPicker({ sections, onSelect }: Props) {
  const unlocked = sections.filter((s) => s.is_unlocked);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>CHOOSE A TOPIC</Text>
      {unlocked.map((section) => (
        <View key={section.id} style={styles.section}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          {section.subtopics.map((sub) => (
            <Pressable
              key={sub.id}
              style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
              onPress={() => onSelect(sub.id, sub.title)}
            >
              <View style={styles.dot} />
              <View style={styles.rowText}>
                <Text style={styles.subTitle}>{sub.title}</Text>
                <Text style={styles.subDesc} numberOfLines={1}>{sub.description}</Text>
              </View>
              <Text style={styles.arrow}>›</Text>
            </Pressable>
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    color: AppColors.textSecondary,
    letterSpacing: 0.8,
    marginBottom: 12,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: AppColors.primary,
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppColors.card,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: AppColors.border,
    gap: 10,
  },
  rowPressed: {
    opacity: 0.7,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: AppColors.primary,
  },
  rowText: {
    flex: 1,
  },
  subTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: AppColors.textPrimary,
    marginBottom: 2,
  },
  subDesc: {
    fontSize: 12,
    color: AppColors.textSecondary,
  },
  arrow: {
    fontSize: 20,
    color: AppColors.textSecondary,
  },
});
