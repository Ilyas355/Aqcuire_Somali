import { StyleSheet, Text, View } from 'react-native';

import { AppColors } from '@/constants/theme';
import type { Profile, Section } from '@/types/api';

interface Props {
  profile: Profile;
  sections: Section[] | undefined;
}

function StatTile({ value, label }: { value: string; label: string }) {
  return (
    <View style={styles.tile}>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

export function StatsRow({ profile, sections }: Props) {
  const overallPct = (() => {
    if (!sections || sections.length === 0) return 0;
    const total = sections.reduce((s, sec) => s + sec.subtopics.length, 0);
    const done = sections.reduce((s, sec) => s + sec.subtopics_completed, 0);
    return total > 0 ? Math.round((done / total) * 100) : 0;
  })();

  return (
    <View style={styles.card}>
      <StatTile value={profile.total_xp.toLocaleString()} label="TOTAL XP" />
      <View style={styles.divider} />
      <StatTile value={`${overallPct}%`} label="COMPLETE" />
      <View style={styles.divider} />
      <StatTile value={String(profile.current_streak)} label="DAY STREAK" />
      <View style={styles.divider} />
      <StatTile value={String(profile.partners_count)} label="PARTNERS" />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: AppColors.card,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: AppColors.border,
  },
  tile: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  value: {
    fontSize: 20,
    fontWeight: '700',
    color: AppColors.textPrimary,
  },
  label: {
    fontSize: 10,
    fontWeight: '600',
    color: AppColors.textSecondary,
    letterSpacing: 0.6,
  },
  divider: {
    width: 1,
    height: 32,
    backgroundColor: AppColors.border,
  },
});
