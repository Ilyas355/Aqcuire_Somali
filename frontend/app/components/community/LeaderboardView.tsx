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
  if (xp >= 1000) return (xp / 1000).toFixed(xp % 1000 === 0 ? 0 : 1) + 'k XP';
  return xp.toLocaleString() + ' XP';
}

function medalEmoji(rank: number): string | null {
  if (rank === 1) return '🥇';
  if (rank === 2) return '🥈';
  if (rank === 3) return '🥉';
  return null;
}

function rankAccent(rank: number): string {
  if (rank === 1) return AppColors.gold;
  if (rank === 2) return AppColors.white45;
  if (rank === 3) return AppColors.orange;
  return AppColors.textTertiary;
}

function avatarBorderColor(rank: number): string {
  if (rank === 1) return AppColors.gold;
  if (rank === 2) return AppColors.white22;
  if (rank === 3) return AppColors.orange;
  return AppColors.border;
}

function LeaderboardEntry({
  rank,
  handle,
  xp,
  city,
}: {
  rank: number;
  handle: string;
  xp: number;
  city: string;
}) {
  const isPodium = rank <= 3;
  const medal = medalEmoji(rank);
  const accent = rankAccent(rank);
  const xpColor = rank === 1 ? AppColors.gold : AppColors.textSecondary;

  return (
    <View style={[s.entry, isPodium && s.entryPodium]}>
      <View style={s.rankWrap}>
        {medal
          ? <Text style={s.medal}>{medal}</Text>
          : <Text style={[s.rankNum, { color: accent }]}>#{rank}</Text>}
      </View>

      <View style={[s.avatar, { borderColor: avatarBorderColor(rank) }]}>
        <Text style={[s.avatarLetter, isPodium && { color: accent }]}>
          {handle[0]?.toUpperCase() ?? '?'}
        </Text>
      </View>

      <View style={s.entryInfo}>
        <Text style={[s.entryHandle, isPodium && { color: AppColors.textPrimary }]}>
          @{handle}
        </Text>
        {city ? <Text style={s.entryCity}>📍 {city}</Text> : null}
      </View>

      <Text style={[s.entryXP, { color: xpColor }]}>{formatXP(xp)}</Text>
    </View>
  );
}

export function LeaderboardView() {
  const [activeTab, setActiveTab] = useState<LeaderboardTab>('this_week');
  const { data, isLoading } = useLeaderboard(activeTab);
  const { user } = useAuth();

  return (
    <View style={s.container}>

      {/* ── Weekly challenge ── */}
      {data?.current_challenge && (
        <View style={s.challengeCard}>
          <View style={s.challengeAccent} />
          <View style={s.challengeInner}>
            <Text style={s.challengeLabel}>WEEKLY CHALLENGE</Text>
            <View style={s.challengeRow}>
              <Text style={s.challengeIcon}>🏆</Text>
              <Text style={s.challengeTitle}>{data.current_challenge.title}</Text>
            </View>
            <Text style={s.challengeBadge}>Reward: {data.current_challenge.reward_badge}</Text>
          </View>
        </View>
      )}

      {/* ── Sub-tabs ── */}
      <View style={s.subTabRow}>
        {SUB_TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <Pressable
              key={tab.id}
              style={[s.subTab, isActive && s.subTabActive]}
              onPress={() => setActiveTab(tab.id)}
            >
              <Text style={[s.subTabLabel, isActive && s.subTabLabelActive]}>
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Text style={s.sectionLabel}>TOP LEARNERS</Text>

      {/* ── List ── */}
      {isLoading ? (
        <View style={s.loading}>
          <ActivityIndicator color={AppColors.primary} />
        </View>
      ) : (
        <View style={s.list}>
          {data?.leaderboard.map((entry, index) => (
            <LeaderboardEntry
              key={entry.handle}
              rank={index + 1}
              handle={entry.handle}
              xp={entry.xp}
              city={entry.city}
            />
          ))}
          {data?.leaderboard.length === 0 && (
            <Text style={s.empty}>No learners yet.</Text>
          )}
        </View>
      )}

      {/* ── Your rank ── */}
      {data?.my_rank && user && (
        <View style={s.myRankRow}>
          <View style={s.rankWrap}>
            <Text style={[s.rankNum, { color: AppColors.primary }]}>#{data.my_rank.rank}</Text>
          </View>
          <View style={[s.avatar, s.myAvatar]}>
            <Text style={[s.avatarLetter, { color: AppColors.onPrimary }]}>
              {user.username[0]?.toUpperCase() ?? '?'}
            </Text>
          </View>
          <View style={s.entryInfo}>
            <Text style={[s.entryHandle, { color: AppColors.primary }]}>You</Text>
            <Text style={s.entryCity}>@{user.username}</Text>
          </View>
          <Text style={[s.entryXP, { color: AppColors.primary }]}>{formatXP(data.my_rank.xp)}</Text>
        </View>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    gap: 14,
  },

  // Challenge
  challengeCard: {
    flexDirection: 'row',
    backgroundColor: AppColors.goldAlpha06,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: AppColors.goldAlpha22,
    overflow: 'hidden',
  },
  challengeAccent: {
    width: 3,
    backgroundColor: AppColors.gold,
  },
  challengeInner: {
    flex: 1,
    padding: 14,
    gap: 6,
  },
  challengeLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: AppColors.gold,
    letterSpacing: 1,
  },
  challengeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  challengeIcon: { fontSize: 18 },
  challengeTitle: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    color: AppColors.textPrimary,
  },
  challengeBadge: {
    fontSize: 12,
    color: AppColors.gold,
    fontWeight: '500',
  },

  // Sub-tabs
  subTabRow: {
    flexDirection: 'row',
    backgroundColor: AppColors.surface1,
    borderRadius: 10,
    padding: 4,
    gap: 3,
    borderWidth: 1,
    borderColor: AppColors.border,
  },
  subTab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 7,
    borderRadius: 7,
  },
  subTabActive: {
    backgroundColor: AppColors.surface3,
    borderWidth: 1,
    borderColor: AppColors.white12,
  },
  subTabLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: AppColors.textTertiary,
  },
  subTabLabelActive: {
    color: AppColors.textPrimary,
    fontWeight: '700',
  },

  sectionLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: AppColors.textTertiary,
    letterSpacing: 1,
  },

  loading: {
    paddingVertical: 32,
    alignItems: 'center',
  },

  list: {
    backgroundColor: AppColors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: AppColors.border,
    overflow: 'hidden',
  },

  // Entry
  entry: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 13,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.border,
  },
  entryPodium: {
    backgroundColor: AppColors.surface1,
  },
  rankWrap: {
    width: 28,
    alignItems: 'center',
  },
  medal: {
    fontSize: 18,
  },
  rankNum: {
    fontSize: 13,
    fontWeight: '700',
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1.5,
    borderColor: AppColors.border,
    backgroundColor: AppColors.primaryMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  myAvatar: {
    backgroundColor: AppColors.primary,
    borderColor: AppColors.primary,
  },
  avatarLetter: {
    fontSize: 15,
    fontWeight: '700',
    color: AppColors.primary,
  },
  entryInfo: {
    flex: 1,
    gap: 2,
  },
  entryHandle: {
    fontSize: 14,
    fontWeight: '600',
    color: AppColors.textSecondary,
  },
  entryCity: {
    fontSize: 11,
    color: AppColors.textTertiary,
  },
  entryXP: {
    fontSize: 13,
    fontWeight: '700',
    color: AppColors.textSecondary,
  },

  empty: {
    paddingVertical: 32,
    textAlign: 'center',
    color: AppColors.textTertiary,
    fontSize: 14,
  },

  // Your rank row
  myRankRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 13,
    paddingHorizontal: 16,
    backgroundColor: AppColors.primaryMuted,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: AppColors.primaryAlpha22,
  },
});
