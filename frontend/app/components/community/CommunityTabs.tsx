import { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import type { LayoutChangeEvent } from 'react-native';

import { AppColors } from '@/constants/theme';

export type CommunityTab = 'suggested' | 'partners' | 'leaderboard';

const TABS: { id: CommunityTab; label: string }[] = [
  { id: 'suggested',   label: 'Suggested' },
  { id: 'partners',    label: 'My Partners' },
  { id: 'leaderboard', label: 'Leaderboard' },
];

const IDX: Record<CommunityTab, number> = { suggested: 0, partners: 1, leaderboard: 2 };

interface Props {
  active: CommunityTab;
  onSelect: (tab: CommunityTab) => void;
}

export function CommunityTabs({ active, onSelect }: Props) {
  const [barWidth, setBarWidth] = useState(0);
  const indicatorX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (barWidth === 0) return;
    const tabWidth = (barWidth - 8) / TABS.length;
    Animated.spring(indicatorX, {
      toValue: IDX[active] * tabWidth,
      useNativeDriver: true,
      damping: 20,
      stiffness: 200,
    }).start();
  }, [active, barWidth]);

  return (
    <View
      style={styles.bar}
      onLayout={(e: LayoutChangeEvent) => setBarWidth(e.nativeEvent.layout.width)}
    >
      {barWidth > 0 && (
        <Animated.View
          style={[
            styles.pill,
            {
              width: (barWidth - 8) / TABS.length,
              transform: [{ translateX: indicatorX }],
            },
          ]}
        />
      )}
      {TABS.map((tab) => {
        const isActive = active === tab.id;
        return (
          <Pressable key={tab.id} style={styles.tab} onPress={() => onSelect(tab.id)}>
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
  bar: {
    flexDirection: 'row',
    backgroundColor: AppColors.surface1,
    borderRadius: 14,
    padding: 4,
    borderWidth: 1,
    borderColor: AppColors.border,
  },
  pill: {
    position: 'absolute',
    top: 4,
    bottom: 4,
    left: 4,
    borderRadius: 10,
    backgroundColor: AppColors.surface3,
    borderWidth: 1,
    borderColor: AppColors.white12,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    zIndex: 1,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: AppColors.textTertiary,
    letterSpacing: 0.1,
  },
  labelActive: {
    color: AppColors.textPrimary,
    fontWeight: '700',
  },
});
