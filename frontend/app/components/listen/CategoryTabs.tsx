import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';

import { AppColors } from '@/constants/theme';
import type { StoryCategory } from '@/types/api';

interface Props {
  categories: StoryCategory[];
  selectedId: number | null;
  onSelect: (id: number | null) => void;
}

export function CategoryTabs({ categories, selectedId, onSelect }: Props) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
    >
      <Pressable
        style={[styles.tab, selectedId === null && styles.tabActive]}
        onPress={() => onSelect(null)}
      >
        <Text style={[styles.label, selectedId === null && styles.labelActive]}>
          All Stories
        </Text>
      </Pressable>

      {categories.map((cat) => (
        <Pressable
          key={cat.id}
          style={[styles.tab, selectedId === cat.id && styles.tabActive]}
          onPress={() => onSelect(cat.id)}
        >
          <Text style={[styles.label, selectedId === cat.id && styles.labelActive]}>
            {cat.name}
          </Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  tab: {
    borderRadius: 20,
    paddingVertical: 7,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: AppColors.border,
  },
  tabActive: {
    backgroundColor: AppColors.primary,
    borderColor: AppColors.primary,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: AppColors.textSecondary,
  },
  labelActive: {
    color: AppColors.background,
  },
});
