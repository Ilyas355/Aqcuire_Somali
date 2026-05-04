import { StyleSheet, Text, View } from 'react-native';

import { AppColors } from '@/constants/theme';
import type { Profile } from '@/types/api';

interface Props {
  profile: Profile;
}

function formatJoinDate(iso: string): string {
  const date = new Date(iso);
  return `Joined ${date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`;
}

export function ProfileHeader({ profile }: Props) {
  const initials = profile.username.slice(0, 2).toUpperCase();
  const levelSubtitle = profile.level?.current_level.subtitle ?? null;

  return (
    <View style={styles.container}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{initials}</Text>
      </View>

      <Text style={styles.username}>{profile.username}</Text>

      <Text style={styles.sub}>
        @{profile.handle}
        {profile.location ? ` · ${profile.location}` : ''}
      </Text>

      <View style={styles.badgeRow}>
        {profile.current_streak > 0 && (
          <View style={styles.streakBadge}>
            <Text style={styles.streakText}>🔥 {profile.current_streak} day streak</Text>
          </View>
        )}
        {levelSubtitle ? (
          <View style={styles.levelBadge}>
            <Text style={styles.levelBadgeText}>{levelSubtitle}</Text>
          </View>
        ) : null}
      </View>

      <Text style={styles.joinDate}>{formatJoinDate(profile.joined_date)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 8,
    paddingTop: 8,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: AppColors.primaryMuted,
    borderWidth: 2,
    borderColor: AppColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  avatarText: {
    fontSize: 28,
    fontWeight: '700',
    color: AppColors.primary,
  },
  username: {
    fontSize: 24,
    fontWeight: '700',
    color: AppColors.textPrimary,
  },
  sub: {
    fontSize: 13,
    color: AppColors.textSecondary,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  streakBadge: {
    backgroundColor: AppColors.goldMuted,
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 12,
  },
  streakText: {
    color: AppColors.gold,
    fontWeight: '600',
    fontSize: 12,
  },
  levelBadge: {
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: AppColors.border,
  },
  levelBadgeText: {
    color: AppColors.textSecondary,
    fontWeight: '600',
    fontSize: 12,
  },
  joinDate: {
    fontSize: 12,
    color: AppColors.textSecondary,
  },
});
