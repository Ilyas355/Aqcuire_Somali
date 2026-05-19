import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { AppColors } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { useLeaderboard } from '@/hooks/useCommunity';
import type { LeaderboardTab } from '@/types/api';

const SUB_TABS: { id: LeaderboardTab; label: string }[] = [
  { id: 'this_week', label: 'This week' },
  { id: 'all_time',  label: 'All time' },
  { id: 'partners',  label: 'Partners' },
];

function formatXP(xp: number): string {
  return xp.toLocaleString() + ' XP';
}

function rankColor(rank: number): string {
  if (rank === 1) return AppColors.gold;
  if (rank <= 3) return AppColors.textPrimary;
  return AppColors.textSecondary;
}

function LeaderboardEntry({
  rank,
  username,
  handle,
  xp,
}: {
  rank: number;
  username: string;
  handle: string;
  xp: number;
}) {
  return (
    <View style={styles.entry}>
      <Text style={[styles.rank, { color: rankColor(rank) }]}>#{rank}</Text>
      <View style={styles.avatarCircle}>
        <Text style={styles.avatarLetter}>{username[0]?.toUpperCase() ?? '?'}</Text>
      </View>
      <View style={styles.entryInfo}>
        <Text style={styles.entryName}>{username}</Text>
        <Text style={styles.entryHandle}>@{handle}</Text>
      </View>
      <Text style={[styles.entryXP, rank === 1 && styles.goldXP]}>{formatXP(xp)}</Text>
    </View>
  );
}

export function LeaderboardView() {
  const [activeTab, setActiveTab] = useState<LeaderboardTab>('this_week');
  const { data, isLoading } = useLeaderboard(activeTab);
  const { user } = useAuth();

  return (
    <View style={styles.container}>
      {data?.current_challenge && (
        <View style={styles.challengeCard}>
          <Text style={styles.challengeLabel}>WEEKLY CHALLENGE</Text>
          <View style={styles.challengeRow}>
            <Text style={styles.challengeIcon}>🥇</Text>
            <Text style={styles.challengeTitle}>{data.current_challenge.title}</Text>
          </View>
          <Text style={styles.challengeBadge}>
            Reward: {data.current_challenge.reward_badge}
          </Text>
        </View>
      )}

      <View style={styles.subTabRow}>
        {SUB_TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <Pressable
              key={tab.id}
              style={[styles.subTab, isActive && styles.subTabActive]}
              onPress={() => setActiveTab(tab.id)}
            >
              <Text style={[styles.subTabLabel, isActive && styles.subTabLabelActive]}>
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Text style={styles.sectionLabel}>TOP LEARNERS</Text>

      {isLoading ? (
        <View style={styles.loading}>
          <ActivityIndicator color={AppColors.primary} />
        </View>
      ) : (
        <View style={styles.list}>
          {data?.leaderboard.map((entry, index) => (
            <LeaderboardEntry
              key={entry.handle}
              rank={index + 1}
              username={entry.username}
              handle={entry.handle}
              xp={entry.xp}
            />
          ))}
          {data?.leaderboard.length === 0 && (
            <Text style={styles.empty}>No learners yet.</Text>
          )}
        </View>
      )}

      {data?.my_rank && user && (
        <View style={styles.myRankRow}>
          <Text style={[styles.rank, styles.myRankText]}>#{data.my_rank.rank}</Text>
          <View style={[styles.avatarCircle, styles.myRankAvatar]}>
            <Text style={[styles.avatarLetter, styles.myRankAvatarLetter]}>
              {user.username[0]?.toUpperCase() ?? '?'}
            </Text>
          </View>
          <View style={styles.entryInfo}>
            <Text style={[styles.entryName, styles.myRankText]}>You</Text>
            <Text style={styles.entryHandle}>@{user.username}</Text>
          </View>
          <Text style={[styles.entryXP, styles.myRankText]}>{formatXP(data.my_rank.xp)}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  challengeCard: {
    backgroundColor: AppColors.goldMuted,
    borderRadius: 14,
    padding: 14,
    gap: 8,
    borderWidth: 1,
    borderColor: AppColors.border,
  },
  challengeLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: AppColors.gold,
    letterSpacing: 0.8,
  },
  challengeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  challengeIcon: {
    fontSize: 20,
  },
  challengeTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: AppColors.textPrimary,
    flex: 1,
  },
  challengeBadge: {
    fontSize: 12,
    color: AppColors.gold,
  },
  subTabRow: {
    flexDirection: 'row',
    backgroundColor: AppColors.card,
    borderRadius: 10,
    padding: 4,
    gap: 4,
  },
  subTab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 7,
    borderRadius: 8,
  },
  subTabActive: {
    backgroundColor: AppColors.background,
  },
  subTabLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: AppColors.textSecondary,
  },
  subTabLabelActive: {
    color: AppColors.textPrimary,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: AppColors.textSecondary,
    letterSpacing: 0.8,
  },
  loading: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  list: {
    gap: 2,
  },
  entry: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.border,
  },
  rank: {
    fontSize: 13,
    fontWeight: '700',
    width: 28,
    textAlign: 'center',
  },
  avatarCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: AppColors.primaryMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarLetter: {
    fontSize: 15,
    fontWeight: '700',
    color: AppColors.primary,
  },
  entryInfo: {
    flex: 1,
    gap: 1,
  },
  entryName: {
    fontSize: 14,
    fontWeight: '600',
    color: AppColors.textPrimary,
  },
  entryHandle: {
    fontSize: 11,
    color: AppColors.textSecondary,
  },
  entryXP: {
    fontSize: 13,
    fontWeight: '600',
    color: AppColors.textSecondary,
  },
  goldXP: {
    color: AppColors.gold,
  },
  empty: {
    paddingVertical: 24,
    textAlign: 'center',
    color: AppColors.textSecondary,
    fontSize: 14,
  },
  myRankRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: AppColors.primaryMuted,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: AppColors.primary,
  },
  myRankAvatar: {
    backgroundColor: AppColors.primary,
  },
  myRankAvatarLetter: {
    color: AppColors.background,
  },
  myRankText: {
    color: AppColors.primary,
  },
});
