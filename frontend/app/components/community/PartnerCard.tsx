import { useRef } from 'react';
import { ActivityIndicator, Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import * as Haptics from 'expo-haptics';

import { AppColors } from '@/constants/theme';
import type { SuggestedPartner } from '@/types/api';

interface Props {
  partner: SuggestedPartner;
  onConnect: (id: number) => void;
  isConnecting: boolean;
  onReject?: (id: number) => void;
  isRejecting?: boolean;
  onRemove?: (id: number) => void;
  isRemoving?: boolean;
  onPress?: (id: number) => void;
}

// ─── Avatar ───────────────────────────────────────────────────────────────────

function Avatar({ initial, isOnline }: { initial: string; isOnline: boolean }) {
  return (
    <View style={[avS.ring, isOnline && avS.ringOnline]}>
      <View style={avS.circle}>
        <Text style={avS.letter}>{initial}</Text>
      </View>
      {isOnline && <View style={avS.dot} />}
    </View>
  );
}

const avS = StyleSheet.create({
  ring: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 2,
    borderColor: AppColors.border,
    padding: 2,
  },
  ringOnline: {
    borderColor: AppColors.primary,
  },
  circle: {
    flex: 1,
    borderRadius: 22,
    backgroundColor: AppColors.primaryMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  letter: {
    fontSize: 19,
    fontWeight: '800',
    color: AppColors.primary,
  },
  dot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: AppColors.primary,
    borderWidth: 2,
    borderColor: AppColors.card,
  },
});

// ─── Action button ────────────────────────────────────────────────────────────

function ActionBtn({
  status,
  loading,
  onPress,
  onReject,
  isRejecting,
  onRemove,
  isRemoving,
  navigateToDetail,
}: {
  status: SuggestedPartner['request_status'];
  loading: boolean;
  onPress: () => void;
  onReject?: () => void;
  isRejecting?: boolean;
  onRemove?: () => void;
  isRemoving?: boolean;
  navigateToDetail?: boolean;
}) {
  if (status === 'partner') {
    return (
      <View style={btnS.group}>
        <View style={[btnS.btn, btnS.partnerBtn]}>
          <Text style={[btnS.label, btnS.partnerLabel]}>✓ Connected</Text>
        </View>
        {onRemove && (
          <Pressable style={[btnS.btn, btnS.removeBtn]} onPress={onRemove} disabled={isRemoving}>
            {isRemoving
              ? <ActivityIndicator size="small" color={AppColors.error} />
              : <Text style={[btnS.label, btnS.removeLabel]}>Remove</Text>}
          </Pressable>
        )}
      </View>
    );
  }

  if (status === 'pending') {
    return (
      <View style={[btnS.btn, btnS.pendingBtn]}>
        <Text style={[btnS.label, btnS.pendingLabel]}>Pending…</Text>
      </View>
    );
  }

  if (status === 'received') {
    if (navigateToDetail) {
      return (
        <View style={[btnS.btn, btnS.respondBtn]}>
          <Text style={[btnS.label, btnS.respondLabel]}>Respond →</Text>
        </View>
      );
    }
    return (
      <View style={btnS.group}>
        <Pressable
          style={[btnS.btn, btnS.acceptBtn]}
          onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); onPress(); }}
          disabled={loading}
        >
          {loading
            ? <ActivityIndicator size="small" color={AppColors.onPrimary} />
            : <Text style={[btnS.label, btnS.acceptLabel]}>Accept</Text>}
        </Pressable>
        {onReject && (
          <Pressable style={[btnS.btn, btnS.rejectBtn]} onPress={onReject} disabled={isRejecting}>
            {isRejecting
              ? <ActivityIndicator size="small" color={AppColors.error} />
              : <Text style={[btnS.label, btnS.rejectLabel]}>Decline</Text>}
          </Pressable>
        )}
      </View>
    );
  }

  return (
    <Pressable
      style={[btnS.btn, btnS.connectBtn]}
      onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); onPress(); }}
      disabled={loading}
    >
      {loading
        ? <ActivityIndicator size="small" color={AppColors.primary} />
        : <Text style={[btnS.label, btnS.connectLabel]}>Connect</Text>}
    </Pressable>
  );
}

const btnS = StyleSheet.create({
  group: { flexDirection: 'row', gap: 6 },
  btn: {
    borderRadius: 20,
    paddingVertical: 7,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: { fontSize: 12, fontWeight: '700', letterSpacing: 0.1 },
  connectBtn:    { borderWidth: 1.5, borderColor: AppColors.primary },
  connectLabel:  { color: AppColors.primary },
  pendingBtn:    { backgroundColor: AppColors.surface2, borderWidth: 1, borderColor: AppColors.border },
  pendingLabel:  { color: AppColors.textTertiary },
  acceptBtn:     { backgroundColor: AppColors.primary },
  acceptLabel:   { color: AppColors.onPrimary },
  rejectBtn:     { borderWidth: 1.5, borderColor: AppColors.error },
  rejectLabel:   { color: AppColors.error },
  partnerBtn:    { backgroundColor: AppColors.primaryMuted, borderWidth: 1, borderColor: AppColors.primaryAlpha22 },
  partnerLabel:  { color: AppColors.primary },
  removeBtn:     { borderWidth: 1, borderColor: AppColors.border },
  removeLabel:   { color: AppColors.textSecondary },
  respondBtn:    { borderWidth: 1.5, borderColor: AppColors.orange },
  respondLabel:  { color: AppColors.orange },
});

// ─── Card ─────────────────────────────────────────────────────────────────────

export function PartnerCard({
  partner, onConnect, isConnecting, onReject, isRejecting, onRemove, isRemoving, onPress,
}: Props) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const pp = partner.partner_profile ?? {
    bio: '', total_partners: 0, is_heritage_speaker: false, availability: '', city: '',
  };

  const initial = partner.handle[0]?.toUpperCase() ?? '?';

  const onPressIn = () =>
    Animated.spring(scaleAnim, { toValue: 0.975, useNativeDriver: true, damping: 20, stiffness: 300 }).start();
  const onPressOut = () =>
    Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, damping: 20, stiffness: 300 }).start();

  const showFooter =
    partner.total_xp > 0 ||
    partner.match_percentage > 0 ||
    partner.current_section ||
    pp.availability;

  const cardBody = (
    <Animated.View style={[s.card, { transform: [{ scale: scaleAnim }] }]}>

      {/* ── Top row: avatar + info + button ── */}
      <View style={s.topRow}>
        <Avatar initial={initial} isOnline={partner.is_online} />

        <View style={s.info}>
          <Text style={s.handle} numberOfLines={1}>@{partner.handle}</Text>
          {pp.city ? <Text style={s.city}>📍 {pp.city}</Text> : null}
          {(partner.level_name || pp.is_heritage_speaker) && (
            <View style={s.tagRow}>
              {partner.level_name && (
                <View style={s.levelTag}>
                  <Text style={s.levelTagText}>{partner.level_name}</Text>
                </View>
              )}
              {pp.is_heritage_speaker && (
                <View style={s.heritageTag}>
                  <Text style={s.heritageTagText}>Heritage</Text>
                </View>
              )}
            </View>
          )}
        </View>

        <ActionBtn
          status={partner.request_status}
          loading={isConnecting}
          onPress={() => onConnect(partner.id)}
          onReject={onReject ? () => onReject(partner.id) : undefined}
          isRejecting={isRejecting}
          onRemove={onRemove ? () => onRemove(partner.id) : undefined}
          isRemoving={isRemoving}
          navigateToDetail={!!onPress}
        />
      </View>

      {/* ── Bio ── */}
      {pp.bio ? (
        <View style={s.bioRow}>
          <View style={s.bioAccent} />
          <Text style={s.bioText} numberOfLines={2}>{pp.bio}</Text>
        </View>
      ) : null}

      {/* ── Footer chips ── */}
      {showFooter && (
        <View style={s.footer}>
          {partner.total_xp > 0 && (
            <View style={s.xpChip}>
              <Text style={s.xpChipText}>🏆 {partner.total_xp.toLocaleString()} XP</Text>
            </View>
          )}
          {partner.match_percentage > 0 && (
            <View style={s.matchChip}>
              <Text style={s.matchChipText}>{partner.match_percentage}% match</Text>
            </View>
          )}
          {partner.current_section && (
            <View style={s.metaChip}>
              <Text style={s.metaChipText}>{partner.current_section}</Text>
            </View>
          )}
          {pp.availability && (
            <View style={s.metaChip}>
              <Text style={s.metaChipText}>{pp.availability}</Text>
            </View>
          )}
        </View>
      )}
    </Animated.View>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={() => onPress(partner.id)}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
      >
        {cardBody}
      </Pressable>
    );
  }

  return cardBody;
}

const s = StyleSheet.create({
  card: {
    backgroundColor: AppColors.card,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: AppColors.border,
    padding: 16,
    gap: 12,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  info: {
    flex: 1,
    gap: 4,
  },
  handle: {
    fontSize: 16,
    fontWeight: '700',
    color: AppColors.textPrimary,
    letterSpacing: -0.2,
  },
  city: {
    fontSize: 12,
    color: AppColors.textTertiary,
    marginTop: -1,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
  },
  levelTag: {
    backgroundColor: AppColors.primaryMuted,
    borderRadius: 20,
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: AppColors.primaryAlpha22,
  },
  levelTagText: {
    fontSize: 10,
    fontWeight: '700',
    color: AppColors.primary,
    letterSpacing: 0.2,
  },
  heritageTag: {
    backgroundColor: AppColors.goldAlpha10,
    borderRadius: 20,
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: AppColors.goldAlpha22,
  },
  heritageTagText: {
    fontSize: 10,
    fontWeight: '700',
    color: AppColors.gold,
    letterSpacing: 0.2,
  },
  bioRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  bioAccent: {
    width: 2,
    borderRadius: 2,
    alignSelf: 'stretch',
    backgroundColor: AppColors.primaryAlpha40,
  },
  bioText: {
    flex: 1,
    fontSize: 13,
    color: AppColors.textSecondary,
    lineHeight: 19,
    fontStyle: 'italic',
  },
  footer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  xpChip: {
    backgroundColor: AppColors.goldAlpha06,
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: AppColors.goldAlpha22,
  },
  xpChipText: {
    fontSize: 11,
    fontWeight: '700',
    color: AppColors.gold,
  },
  matchChip: {
    backgroundColor: AppColors.primaryMuted,
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: AppColors.primaryAlpha22,
  },
  matchChipText: {
    fontSize: 11,
    fontWeight: '700',
    color: AppColors.primary,
  },
  metaChip: {
    backgroundColor: AppColors.surface2,
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: AppColors.border,
  },
  metaChipText: {
    fontSize: 11,
    fontWeight: '500',
    color: AppColors.textSecondary,
  },
});
