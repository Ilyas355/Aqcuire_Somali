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

// ─── Action buttons ───────────────────────────────────────────────────────────

function ActionButtons({
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
      <View style={aStyles.row}>
        <View style={aStyles.circleBtnWrap}>
          <View style={[aStyles.circleBtn, aStyles.btnPartner]}>
            <Text style={[aStyles.circleIcon, aStyles.iconPartner]}>✓</Text>
          </View>
          <Text style={[aStyles.circleBtnLabel, aStyles.labelPartner]}>Connected</Text>
        </View>
        <Pressable
          style={({ pressed }) => ({ opacity: pressed ? 0.72 : 1 })}
          onPress={onRemove}
          disabled={isActioning}
        >
          <View style={aStyles.circleBtnWrap}>
            <View style={[aStyles.circleBtn, aStyles.btnDanger]}>
              {isActioning
                ? <ActivityIndicator color={AppColors.error} size="small" />
                : <Text style={[aStyles.circleIcon, aStyles.iconDanger]}>✕</Text>}
            </View>
            <Text style={[aStyles.circleBtnLabel, aStyles.labelDanger]}>Remove</Text>
          </View>
        </Pressable>
      </View>
    );
  }

  if (status === 'received') {
    return (
      <View style={aStyles.row}>
        <Pressable
          style={({ pressed }) => ({ opacity: pressed ? 0.72 : 1 })}
          onPress={onReject}
          disabled={isActioning}
        >
          <View style={aStyles.circleBtnWrap}>
            <View style={[aStyles.circleBtn, aStyles.btnDanger]}>
              {isActioning
                ? <ActivityIndicator color={AppColors.error} size="small" />
                : <Text style={[aStyles.circleIcon, aStyles.iconDanger]}>✕</Text>}
            </View>
            <Text style={[aStyles.circleBtnLabel, aStyles.labelDanger]}>Decline</Text>
          </View>
        </Pressable>
        <Pressable
          style={({ pressed }) => ({ opacity: pressed ? 0.72 : 1 })}
          onPress={onAccept}
          disabled={isActioning}
        >
          <View style={aStyles.circleBtnWrap}>
            <View style={[aStyles.circleBtn, aStyles.btnPrimary]}>
              {isActioning
                ? <ActivityIndicator color={AppColors.onPrimary} size="small" />
                : <Text style={[aStyles.circleIcon, aStyles.iconPrimary]}>✓</Text>}
            </View>
            <Text style={[aStyles.circleBtnLabel, aStyles.labelPrimary]}>Accept</Text>
          </View>
        </Pressable>
      </View>
    );
  }

  if (status === 'pending') {
    return (
      <View style={aStyles.pendingPill}>
        <Text style={aStyles.pendingDot}>●</Text>
        <Text style={aStyles.pendingText}>Request Sent</Text>
      </View>
    );
  }

  return (
    <Pressable
      style={({ pressed }) => ({ opacity: pressed ? 0.72 : 1 })}
      onPress={onConnect}
      disabled={isActioning}
    >
      <View style={aStyles.circleBtnWrap}>
        <View style={[aStyles.circleBtn, aStyles.btnPrimary]}>
          {isActioning
            ? <ActivityIndicator color={AppColors.onPrimary} size="small" />
            : <Text style={[aStyles.circleIcon, aStyles.iconPrimary]}>✓</Text>}
        </View>
        <Text style={[aStyles.circleBtnLabel, aStyles.labelPrimary]}>Connect</Text>
      </View>
    </Pressable>
  );
}

const aStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 52,
    alignItems: 'flex-start',
  },
  circleBtnWrap: {
    alignItems: 'center',
    gap: 8,
  },
  circleBtn: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleIcon: {
    fontSize: 26,
    fontWeight: '700',
  },
  circleBtnLabel: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.1,
  },
  btnPrimary:   { backgroundColor: AppColors.primary },
  btnDanger:    { backgroundColor: AppColors.errorMuted, borderWidth: 2, borderColor: AppColors.error },
  btnPartner:   { backgroundColor: AppColors.primaryMuted, borderWidth: 2, borderColor: AppColors.primaryAlpha40 },
  iconPrimary:  { color: AppColors.onPrimary },
  iconDanger:   { color: AppColors.error },
  iconPartner:  { color: AppColors.primary },
  labelPrimary: { color: AppColors.primary },
  labelDanger:  { color: AppColors.error },
  labelPartner: { color: AppColors.primary },
  pendingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    alignSelf: 'center',
    backgroundColor: AppColors.surface2,
    borderRadius: 20,
    paddingVertical: 13,
    paddingHorizontal: 24,
    borderWidth: 1,
    borderColor: AppColors.border,
  },
  pendingDot:  { fontSize: 8, color: AppColors.textTertiary },
  pendingText: { fontSize: 14, fontWeight: '600', color: AppColors.textSecondary },
});

// ─── Stat ─────────────────────────────────────────────────────────────────────

function Stat({ value, label, accent }: { value: string; label: string; accent?: string }) {
  return (
    <View style={s.statItem}>
      <Text style={[s.statValue, accent ? { color: accent } : null]}>{value}</Text>
      <Text style={s.statLabel}>{label}</Text>
    </View>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function PartnerDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const partnerId = Number(id);

  const { data: partner, isLoading, isError, refetch } = useSuggestedPartner(partnerId);
  const [isActioning, setIsActioning] = useState(false);

  const { mutate: sendRequest }   = useSendPartnerRequest();
  const { mutate: rejectRequest } = useRejectPartnerRequest();
  const { mutate: removePartner } = useRemovePartner();

  const act = (fn: () => void) => { setIsActioning(true); fn(); };

  const handleConnect = () => act(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    sendRequest(partnerId, { onSuccess: () => refetch(), onSettled: () => setIsActioning(false) });
  });
  const handleAccept = () => act(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    sendRequest(partnerId, { onSuccess: () => refetch(), onSettled: () => setIsActioning(false) });
  });
  const handleReject = () => act(() => {
    rejectRequest(partnerId, { onSuccess: () => router.back(), onSettled: () => setIsActioning(false) });
  });
  const handleRemove = () => act(() => {
    removePartner(partnerId, { onSuccess: () => router.back(), onSettled: () => setIsActioning(false) });
  });

  if (isLoading) {
    return (
      <SafeAreaView style={s.safe}>
        <View style={s.center}><ActivityIndicator color={AppColors.primary} size="large" /></View>
      </SafeAreaView>
    );
  }

  if (isError || !partner) {
    return (
      <SafeAreaView style={s.safe}>
        <Pressable style={s.backRow} onPress={() => router.back()}>
          <Text style={s.backText}>← Back</Text>
        </Pressable>
        <View style={s.center}>
          <Text style={s.errorText}>Could not load this profile.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const pp = partner.partner_profile ?? {
    bio: '', total_partners: 0, is_heritage_speaker: false, availability: '', city: '',
  };

  const isPartner = partner.request_status === 'partner';
  const hasBadges = partner.level_name || partner.current_streak > 0 || pp.is_heritage_speaker || partner.is_diaspora;

  const infoRows: { icon: string; label: string; value: string; accent?: string; highlight?: boolean }[] = [];
  if (pp.city)                 infoRows.push({ icon: '📍', label: 'City',            value: pp.city });
  if (partner.current_section) infoRows.push({ icon: '📖', label: 'Studying',        value: partner.current_section });
  if (pp.availability)         infoRows.push({ icon: '🗓',  label: 'Available',       value: pp.availability });
  if (pp.preferred_format)     infoRows.push({ icon: '💬',  label: 'Discord Account', value: pp.preferred_format, accent: AppColors.purple, highlight: isPartner });

  const initial = partner.username[0]?.toUpperCase() ?? '?';
  const partnerCount = String(pp.total_partners ?? 0);

  return (
    <SafeAreaView style={s.safe} edges={['top', 'left', 'right']}>
      <View style={s.flex}>
        <ScrollView style={s.scroll} contentContainerStyle={s.scrollContent} showsVerticalScrollIndicator={false}>

          {/* ── Hero ── */}
          <View style={s.hero}>
            <Pressable style={s.backRow} onPress={() => router.back()}>
              <Text style={s.backText}>← Back</Text>
            </Pressable>

            {/* Glow rings + avatar */}
            <View style={s.glowHost}>
              <View style={s.glowOuter} />
              <View style={s.glowMid} />
              <View style={s.glowInner} />
              <View style={s.avatarRing}>
                <View style={s.avatarCircle}>
                  <Text style={s.avatarLetter}>{initial}</Text>
                </View>
              </View>
            </View>

            {/* Name + handle */}
            <Text style={s.heroName}>{partner.username}</Text>
            <Text style={s.heroHandle}>@{partner.handle}</Text>

            {/* Online indicator */}
            {partner.is_online && (
              <View style={s.onlineBadge}>
                <View style={s.onlinePulse} />
                <Text style={s.onlineBadgeText}>Online now</Text>
              </View>
            )}

            {/* Badges */}
            {hasBadges && (
              <View style={s.badgeRow}>
                {partner.level_name ? (
                  <View style={s.levelBadge}>
                    <Text style={s.levelText}>🏆 {partner.level_name}</Text>
                  </View>
                ) : null}
                {partner.current_streak > 0 ? (
                  <View style={s.streakBadge}>
                    <Text style={s.streakText}>🔥 {partner.current_streak} day streak</Text>
                  </View>
                ) : null}
                {pp.is_heritage_speaker ? (
                  <View style={s.goldTag}>
                    <Text style={s.goldTagText}>Heritage Speaker</Text>
                  </View>
                ) : null}
                {partner.is_diaspora ? (
                  <View style={s.purpleTag}>
                    <Text style={s.purpleTagText}>Diaspora</Text>
                  </View>
                ) : null}
              </View>
            )}
          </View>

          {/* ── Bio ── */}
          {pp.bio ? (
            <View style={s.bioCard}>
              <View style={s.bioAccent} />
              <Text style={s.bioText}>{pp.bio}</Text>
            </View>
          ) : null}

          {/* ── Stats ── */}
          <View style={s.statsCard}>
            <Stat value={partner.total_xp.toLocaleString()} label="Total XP"   accent={AppColors.gold} />
            <View style={s.statDivider} />
            <Stat value={partnerCount}                       label="Partners"   accent={AppColors.blue} />
            <View style={s.statDivider} />
            <Stat value={`${partner.current_streak} 🔥`}    label="Day Streak" accent={AppColors.orange} />
          </View>

          {/* ── Compatibility ── */}
          {partner.match_percentage > 0 ? (
            <View style={s.compatCard}>
              <View style={s.compatHeader}>
                <Text style={s.compatTitle}>Compatibility</Text>
                <View style={s.compatPctWrap}>
                  <Text style={s.compatPct}>{partner.match_percentage}%</Text>
                </View>
              </View>
              <View style={s.compatTrack}>
                <View style={[s.compatFill, { width: `${partner.match_percentage}%` as `${number}%` }]} />
              </View>
            </View>
          ) : null}

          {/* ── Info list ── */}
          {infoRows.length > 0 ? (
            <View style={s.infoCard}>
              {infoRows.map((row, i) => (
                <View
                  key={row.label}
                  style={[
                    s.infoRow,
                    i === infoRows.length - 1 && s.infoRowLast,
                    row.highlight && s.infoRowHighlight,
                  ]}
                >
                  <Text style={s.infoIcon}>{row.icon}</Text>
                  <Text style={[s.infoLabel, row.highlight && s.infoLabelHighlight]}>{row.label}</Text>
                  <Text style={[s.infoValue, row.accent ? { color: row.accent } : null]}>
                    {row.value}
                  </Text>
                </View>
              ))}
            </View>
          ) : null}

          <View style={s.spacer} />
        </ScrollView>

        {/* ── Action bar ── */}
        <View style={s.actionBar}>
          {partner.request_status === 'received' && (
            <Text style={s.actionHint}>@{partner.handle} sent you a partner request</Text>
          )}
          <ActionButtons
            status={partner.request_status}
            isActioning={isActioning}
            onConnect={handleConnect}
            onAccept={handleAccept}
            onReject={handleReject}
            onRemove={handleRemove}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const GLOW_HOST   = 164;
const AVATAR_SIZE = 96;

const s = StyleSheet.create({
  safe:  { flex: 1, backgroundColor: AppColors.background },
  flex:  { flex: 1 },
  center:{ flex: 1, alignItems: 'center', justifyContent: 'center' },
  scroll: { flex: 1, backgroundColor: AppColors.background },
  scrollContent: { paddingBottom: 16 },
  errorText: { color: AppColors.textSecondary, fontSize: 15 },

  // Back
  backRow: { alignSelf: 'flex-start', paddingHorizontal: 20, paddingTop: 14, paddingBottom: 4 },
  backText: { fontSize: 14, fontWeight: '600', color: AppColors.textSecondary },

  // ── Hero ──
  hero: {
    backgroundColor: AppColors.surface1,
    alignItems: 'center',
    paddingBottom: 28,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.border,
  },

  // Glow system
  glowHost: {
    width: GLOW_HOST,
    height: GLOW_HOST,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  glowOuter: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    borderRadius: GLOW_HOST / 2,
    backgroundColor: AppColors.primaryGlow,
    opacity: 0.18,
  },
  glowMid: {
    position: 'absolute',
    top: 18, left: 18,
    width: GLOW_HOST - 36,
    height: GLOW_HOST - 36,
    borderRadius: (GLOW_HOST - 36) / 2,
    backgroundColor: AppColors.primaryGlow,
    opacity: 0.35,
  },
  glowInner: {
    position: 'absolute',
    top: 34, left: 34,
    width: GLOW_HOST - 68,
    height: GLOW_HOST - 68,
    borderRadius: (GLOW_HOST - 68) / 2,
    backgroundColor: AppColors.primaryGlow,
    opacity: 0.55,
  },

  // Avatar
  avatarRing: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    borderWidth: 2.5,
    borderColor: AppColors.primary,
    padding: 3,
    backgroundColor: AppColors.surface1,
  },
  avatarCircle: {
    flex: 1,
    borderRadius: 100,
    backgroundColor: AppColors.primaryMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarLetter: {
    fontSize: 32,
    fontWeight: '800',
    color: AppColors.primary,
  },

  // Name / handle
  heroName: {
    marginTop: 12,
    fontSize: 22,
    fontWeight: '800',
    color: AppColors.textPrimary,
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  heroHandle: {
    marginTop: 4,
    fontSize: 13,
    color: AppColors.textSecondary,
    textAlign: 'center',
  },

  // Online indicator
  onlineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
    backgroundColor: AppColors.primaryMuted,
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: AppColors.primaryAlpha22,
  },
  onlinePulse: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: AppColors.primary,
  },
  onlineBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: AppColors.primary,
    letterSpacing: 0.2,
  },

  // Badges
  badgeRow: {
    flexDirection: 'row',
    gap: 7,
    marginTop: 12,
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  levelBadge: {
    backgroundColor: AppColors.primaryMuted,
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: AppColors.primaryAlpha22,
  },
  levelText: { fontSize: 12, fontWeight: '700', color: AppColors.primary },
  streakBadge: {
    backgroundColor: AppColors.orangeMuted,
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: AppColors.orangeMuted,
  },
  streakText: { fontSize: 12, fontWeight: '700', color: AppColors.orange },
  goldTag: {
    backgroundColor: AppColors.goldAlpha10,
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: AppColors.goldAlpha22,
  },
  goldTagText: { fontSize: 12, fontWeight: '600', color: AppColors.gold },
  purpleTag: {
    backgroundColor: AppColors.purpleMuted,
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: AppColors.purpleAlpha24,
  },
  purpleTagText: { fontSize: 12, fontWeight: '600', color: AppColors.purple },

  // ── Bio ──
  bioCard: {
    marginHorizontal: 20,
    marginTop: 20,
    backgroundColor: AppColors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: AppColors.border,
    padding: 18,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  bioAccent: {
    width: 2,
    borderRadius: 2,
    alignSelf: 'stretch',
    backgroundColor: AppColors.primaryAlpha40,
  },
  bioText: {
    flex: 1,
    fontSize: 14,
    color: AppColors.textSecondary,
    lineHeight: 22,
    fontStyle: 'italic',
  },

  // ── Stats ──
  statsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppColors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: AppColors.border,
    marginHorizontal: 20,
    marginTop: 20,
    paddingVertical: 22,
    paddingHorizontal: 8,
  },
  statItem:    { flex: 1, alignItems: 'center', gap: 5 },
  statValue:   { fontSize: 22, fontWeight: '800', color: AppColors.textPrimary },
  statLabel:   { fontSize: 11, color: AppColors.textSecondary, fontWeight: '500', textAlign: 'center' },
  statDivider: { width: 1, height: 36, backgroundColor: AppColors.border },

  // ── Compatibility ──
  compatCard: {
    marginHorizontal: 20,
    marginTop: 20,
    backgroundColor: AppColors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: AppColors.border,
    padding: 18,
    gap: 12,
  },
  compatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  compatTitle:   { fontSize: 14, fontWeight: '700', color: AppColors.textPrimary },
  compatPctWrap: {
    backgroundColor: AppColors.primaryMuted,
    borderRadius: 20,
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: AppColors.primaryAlpha22,
  },
  compatPct: { fontSize: 13, fontWeight: '800', color: AppColors.primary },
  compatTrack: {
    height: 7,
    borderRadius: 4,
    backgroundColor: AppColors.surface2,
    overflow: 'hidden',
  },
  compatFill: {
    height: '100%',
    borderRadius: 4,
    backgroundColor: AppColors.primary,
  },

  // ── Info list ──
  infoCard: {
    marginHorizontal: 20,
    marginTop: 20,
    backgroundColor: AppColors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: AppColors.border,
    overflow: 'hidden',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.border,
    gap: 14,
  },
  infoRowLast:        { borderBottomWidth: 0 },
  infoRowHighlight:   { backgroundColor: AppColors.purpleAlpha06 },
  infoIcon:           { fontSize: 16, width: 22, textAlign: 'center' },
  infoLabel:          { flex: 1, fontSize: 14, color: AppColors.textSecondary, fontWeight: '500' },
  infoLabelHighlight: { color: AppColors.purpleLight, fontWeight: '600' },
  infoValue:          { fontSize: 14, fontWeight: '600', color: AppColors.textPrimary, flexShrink: 1, textAlign: 'right' },

  spacer: { height: 8 },

  // ── Action bar ──
  actionBar: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 36,
    borderTopWidth: 1,
    borderTopColor: AppColors.border,
    backgroundColor: AppColors.surface1,
    alignItems: 'center',
    gap: 16,
  },
  actionHint: {
    fontSize: 12,
    color: AppColors.textTertiary,
    fontWeight: '500',
    letterSpacing: 0.2,
  },
});
