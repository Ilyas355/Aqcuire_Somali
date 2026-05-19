import { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';

import { AppColors } from '@/constants/theme';
import {
  useRejectPartnerRequest,
  useRemovePartner,
  useSendPartnerRequest,
  useSuggestedPartner,
} from '@/hooks/useCommunity';
import type { SuggestedPartnerDetail } from '@/types/api';

type ActionStatus = SuggestedPartnerDetail['request_status'];

function ActionBar({
  status,
  isActioning,
  onConnect,
  onAccept,
  onReject,
  onRemove,
}: {
  status: ActionStatus;
  isActioning: boolean;
  onConnect: () => void;
  onAccept: () => void;
  onReject: () => void;
  onRemove: () => void;
}) {
  if (status === 'partner') {
    return (
      <View style={barStyles.row}>
        <View style={[barStyles.circleBtn, barStyles.circleBtnPartner]}>
          <Text style={[barStyles.circleIcon, barStyles.iconPartner]}>✓</Text>
        </View>
        <Pressable style={[barStyles.circleBtn, barStyles.circleBtnDanger]} onPress={onRemove} disabled={isActioning}>
          {isActioning
            ? <ActivityIndicator color={AppColors.error} size="small" />
            : <Text style={[barStyles.circleIcon, barStyles.iconDanger]}>✕</Text>}
        </Pressable>
      </View>
    );
  }

  if (status === 'received') {
    return (
      <View style={barStyles.row}>
        <Pressable style={[barStyles.circleBtn, barStyles.circleBtnDanger]} onPress={onReject} disabled={isActioning}>
          {isActioning
            ? <ActivityIndicator color={AppColors.error} size="small" />
            : <Text style={[barStyles.circleIcon, barStyles.iconDanger]}>✕</Text>}
        </Pressable>
        <Pressable style={[barStyles.circleBtn, barStyles.circleBtnPrimary]} onPress={onAccept} disabled={isActioning}>
          {isActioning
            ? <ActivityIndicator color={AppColors.background} size="small" />
            : <Text style={[barStyles.circleIcon, barStyles.iconPrimary]}>✓</Text>}
        </Pressable>
      </View>
    );
  }

  if (status === 'pending') {
    return (
      <View style={barStyles.wideBtn}>
        <Text style={barStyles.wideBtnLabel}>Request Sent</Text>
      </View>
    );
  }

  return (
    <View style={barStyles.row}>
      <Pressable style={[barStyles.circleBtn, barStyles.circleBtnPrimary]} onPress={onConnect} disabled={isActioning}>
        {isActioning
          ? <ActivityIndicator color={AppColors.background} size="small" />
          : <Text style={[barStyles.circleIcon, barStyles.iconPrimary]}>✓</Text>}
      </Pressable>
    </View>
  );
}

const barStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 32,
    alignItems: 'center',
  },
  circleBtn: {
    width: 68,
    height: 68,
    borderRadius: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleBtnPrimary: {
    backgroundColor: AppColors.primary,
  },
  circleBtnDanger: {
    borderWidth: 2,
    borderColor: AppColors.error,
  },
  circleBtnPartner: {
    borderWidth: 2,
    borderColor: AppColors.primary,
    backgroundColor: AppColors.primaryMuted,
  },
  circleBtnPending: {
    borderWidth: 2,
    borderColor: AppColors.border,
  },
  circleIcon: {
    fontSize: 24,
    fontWeight: '700',
  },
  iconPrimary: { color: AppColors.background },
  iconDanger:  { color: AppColors.error },
  iconPartner: { color: AppColors.primary },
  iconPending: { color: AppColors.textSecondary },
  wideBtn: {
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: AppColors.border,
  },
  wideBtnLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: AppColors.textSecondary,
  },
});

export default function PartnerDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const partnerId = Number(id);

  const { data: partner, isLoading, isError, refetch } = useSuggestedPartner(partnerId);
  const [isActioning, setIsActioning] = useState(false);

  const { mutate: sendRequest } = useSendPartnerRequest();
  const { mutate: rejectRequest } = useRejectPartnerRequest();
  const { mutate: removePartner } = useRemovePartner();

  const act = (fn: () => void) => {
    setIsActioning(true);
    fn();
  };

  const handleConnect = () => act(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    sendRequest(partnerId, {
      onSuccess: () => refetch(),
      onSettled: () => setIsActioning(false),
    });
  });

  const handleAccept = () => act(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    sendRequest(partnerId, {
      onSuccess: () => refetch(),
      onSettled: () => setIsActioning(false),
    });
  });

  const handleReject = () => act(() => {
    rejectRequest(partnerId, {
      onSuccess: () => router.back(),
      onSettled: () => setIsActioning(false),
    });
  });

  const handleRemove = () => act(() => {
    removePartner(partnerId, {
      onSuccess: () => router.back(),
      onSettled: () => setIsActioning(false),
    });
  });

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <ActivityIndicator color={AppColors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (isError || !partner) {
    return (
      <SafeAreaView style={styles.safe}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backText}>← Back</Text>
        </Pressable>
        <View style={styles.center}>
          <Text style={styles.errorText}>Could not load this partner.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const pp = partner.partner_profile ?? {
    bio: '', rating: 0, total_partners: 0,
    is_heritage_speaker: false, availability: '', preferred_format: '',
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <Pressable style={styles.backBtn} onPress={() => router.back()}>
        <Text style={styles.backText}>← Back</Text>
      </Pressable>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Avatar */}
        <View style={styles.avatarWrap}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarLetter}>{partner.username[0]?.toUpperCase() ?? '?'}</Text>
          </View>
          {partner.is_online && (
            <View style={styles.onlinePill}>
              <View style={styles.onlineDot} />
              <Text style={styles.onlinePillText}>Online</Text>
            </View>
          )}
        </View>

        {/* Name + handle */}
        <Text style={styles.name}>{partner.username}</Text>
        <Text style={styles.handle}>@{partner.handle}</Text>

        {/* Badges */}
        <View style={styles.badgeRow}>
          {partner.level_name && (
            <View style={styles.levelBadge}>
              <Text style={styles.levelText}>{partner.level_name}</Text>
            </View>
          )}
          {pp.is_heritage_speaker && (
            <View style={styles.heritageBadge}>
              <Text style={styles.heritageText}>Heritage</Text>
            </View>
          )}
          {partner.is_diaspora && (
            <View style={styles.diasporaBadge}>
              <Text style={styles.diasporaText}>Diaspora</Text>
            </View>
          )}
        </View>

        {/* Bio */}
        {pp.bio ? <Text style={styles.bio}>{pp.bio}</Text> : null}

        {/* Stats */}
        <View style={styles.statsCard}>
          <StatItem label="XP" value={partner.total_xp.toLocaleString()} />
          <View style={styles.statDivider} />
          <StatItem label="Rating" value={pp.rating > 0 ? pp.rating.toFixed(1) : '—'} />
          <View style={styles.statDivider} />
          <StatItem label="Partners" value={String(pp.total_partners)} />
          <View style={styles.statDivider} />
          <StatItem label="Streak" value={String(partner.current_streak)} suffix="🔥" />
        </View>

        {/* Compatibility bar */}
        {partner.match_percentage > 0 && (
          <View style={styles.compatSection}>
            <View style={styles.compatHeader}>
              <Text style={styles.compatLabel}>Compatibility</Text>
              <Text style={styles.compatPct}>{partner.match_percentage}%</Text>
            </View>
            <View style={styles.compatTrack}>
              <View style={[styles.compatFill, { width: `${partner.match_percentage}%` as `${number}%` }]} />
            </View>
          </View>
        )}

        {/* Detail tags */}
        {(partner.current_section || pp.availability || pp.preferred_format) ? (
          <View style={styles.tagsRow}>
            {partner.current_section && (
              <View style={styles.tag}>
                <Text style={styles.tagText}>{partner.current_section}</Text>
              </View>
            )}
            {pp.availability ? (
              <View style={styles.tag}>
                <Text style={styles.tagText}>{pp.availability}</Text>
              </View>
            ) : null}
            {pp.preferred_format ? (
              <View style={styles.tag}>
                <Text style={styles.tagText}>{pp.preferred_format}</Text>
              </View>
            ) : null}
          </View>
        ) : null}
      </ScrollView>

      <View style={styles.actionBar}>
        <ActionBar
          status={partner.request_status}
          isActioning={isActioning}
          onConnect={handleConnect}
          onAccept={handleAccept}
          onReject={handleReject}
          onRemove={handleRemove}
        />
      </View>
    </SafeAreaView>
  );
}

function StatItem({ label, value, suffix }: { label: string; value: string; suffix?: string }) {
  return (
    <View style={styles.statItem}>
      <Text style={styles.statValue}>{value}{suffix ? ` ${suffix}` : ''}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: AppColors.background,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    color: AppColors.textSecondary,
    fontSize: 14,
  },
  backBtn: {
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  backText: {
    fontSize: 15,
    color: AppColors.primary,
    fontWeight: '600',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    alignItems: 'center',
    gap: 12,
  },
  avatarWrap: {
    alignItems: 'center',
    gap: 10,
    marginTop: 8,
  },
  avatarCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: AppColors.primaryMuted,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: AppColors.primary,
  },
  avatarLetter: {
    fontSize: 36,
    fontWeight: '700',
    color: AppColors.primary,
  },
  onlinePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: AppColors.primaryMuted,
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: AppColors.primary,
  },
  onlineDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: AppColors.primary,
  },
  onlinePillText: {
    fontSize: 12,
    fontWeight: '600',
    color: AppColors.primary,
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
    color: AppColors.textPrimary,
    textAlign: 'center',
  },
  handle: {
    fontSize: 14,
    color: AppColors.textSecondary,
    textAlign: 'center',
    marginTop: -4,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 6,
  },
  levelBadge: {
    backgroundColor: AppColors.primaryMuted,
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: AppColors.primary,
  },
  levelText: {
    fontSize: 12,
    fontWeight: '600',
    color: AppColors.primary,
  },
  heritageBadge: {
    backgroundColor: AppColors.goldMuted,
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  heritageText: {
    fontSize: 12,
    fontWeight: '600',
    color: AppColors.gold,
  },
  diasporaBadge: {
    backgroundColor: AppColors.purpleMuted,
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  diasporaText: {
    fontSize: 12,
    fontWeight: '600',
    color: AppColors.purple,
  },
  bio: {
    fontSize: 14,
    color: AppColors.textSecondary,
    lineHeight: 21,
    textAlign: 'center',
    marginHorizontal: 8,
  },
  statsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppColors.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: AppColors.border,
    paddingVertical: 16,
    paddingHorizontal: 8,
    width: '100%',
    marginTop: 4,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    fontSize: 17,
    fontWeight: '700',
    color: AppColors.textPrimary,
  },
  statLabel: {
    fontSize: 11,
    color: AppColors.textSecondary,
    fontWeight: '500',
  },
  statDivider: {
    width: 1,
    height: 28,
    backgroundColor: AppColors.border,
  },
  compatSection: {
    width: '100%',
    gap: 8,
    marginTop: 4,
  },
  compatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  compatLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: AppColors.textSecondary,
  },
  compatPct: {
    fontSize: 13,
    fontWeight: '700',
    color: AppColors.primary,
  },
  compatTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: AppColors.surface2,
    overflow: 'hidden',
  },
  compatFill: {
    height: '100%',
    borderRadius: 3,
    backgroundColor: AppColors.primary,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 6,
    width: '100%',
  },
  tag: {
    backgroundColor: AppColors.surface1,
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: AppColors.border,
  },
  tagText: {
    fontSize: 12,
    color: AppColors.textSecondary,
  },
  actionBar: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: 24,
    borderTopWidth: 1,
    borderTopColor: AppColors.border,
    backgroundColor: AppColors.background,
  },
});
