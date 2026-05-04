import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AppColors } from '@/constants/theme';

export type CommunityTab = 'suggested' | 'partners' | 'leaderboard';

const TABS: { id: CommunityTab; label: string }[] = [
  { id: 'suggested',   label: 'Suggested' },
  { id: 'partners',    label: 'My Partners' },
  { id: 'leaderboard', label: 'Leaderboard' },
];

interface Props {
  active: CommunityTab;
  onSelect: (tab: CommunityTab) => void;
}

export function CommunityTabs({ active, onSelect }: Props) {
  return (
    <View style={styles.row}>
      {TABS.map((tab) => {
        const isActive = active === tab.id;
        return (
          <Pressable
            key={tab.id}
            style={[styles.tab, isActive && styles.tabActive]}
            onPress={() => onSelect(tab.id)}
          >
            <Text style={[styles.label, isActive && styles.labelActive]}>
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: AppColors.border,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: AppColors.primary,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: AppColors.textSecondary,
  },
  labelActive: {
    color: AppColors.primary,
  },
});
