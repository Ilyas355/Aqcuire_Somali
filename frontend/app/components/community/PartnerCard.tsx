import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
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

function Avatar({ username }: { username: string }) {
  return (
    <View style={avatarStyles.circle}>
      <Text style={avatarStyles.letter}>{username[0]?.toUpperCase() ?? '?'}</Text>
    </View>
  );
}

const avatarStyles = StyleSheet.create({
  circle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: AppColors.primaryMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  letter: {
    fontSize: 20,
    fontWeight: '700',
    color: AppColors.primary,
  },
});

function ConnectButton({
  status,
  onPress,
  loading,
  onReject,
  isRejecting,
  onRemove,
  isRemoving,
  navigateToDetail,
}: {
  status: SuggestedPartner['request_status'];
  onPress: () => void;
  loading: boolean;
  onReject?: () => void;
  isRejecting?: boolean;
  onRemove?: () => void;
  isRemoving?: boolean;
  navigateToDetail?: boolean;
}) {
  if (status === 'partner') {
    return (
      <View style={btnStyles.partnerRow}>
        <View style={[btnStyles.base, btnStyles.partner]}>
          <Text style={[btnStyles.label, btnStyles.partnerLabel]}>Partners ✓</Text>
        </View>
        {onRemove && (
          <Pressable style={[btnStyles.base, btnStyles.reject]} onPress={onRemove} disabled={isRemoving}>
            {isRemoving ? (
              <ActivityIndicator color={AppColors.error} size="small" />
            ) : (
              <Text style={[btnStyles.label, btnStyles.rejectLabel]}>Remove</Text>
            )}
          </Pressable>
        )}
      </View>
    );
  }
  if (status === 'pending') {
    return (
      <View style={[btnStyles.base, btnStyles.pending]}>
        <Text style={[btnStyles.label, btnStyles.pendingLabel]}>Pending</Text>
      </View>
    );
  }
  if (status === 'received') {
    if (navigateToDetail) {
      return (
        <View style={[btnStyles.base, btnStyles.respond]}>
          <Text style={[btnStyles.label, btnStyles.respondLabel]}>Respond →</Text>
        </View>
      );
    }
    return (
      <View style={btnStyles.partnerRow}>
        <Pressable
          style={[btnStyles.base, btnStyles.accept]}
          onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); onPress(); }}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={AppColors.background} size="small" />
          ) : (
            <Text style={[btnStyles.label, btnStyles.acceptLabel]}>Accept</Text>
          )}
        </Pressable>
        {onReject && (
          <Pressable style={[btnStyles.base, btnStyles.reject]} onPress={onReject} disabled={isRejecting}>
            {isRejecting ? (
              <ActivityIndicator color={AppColors.error} size="small" />
            ) : (
              <Text style={[btnStyles.label, btnStyles.rejectLabel]}>Reject</Text>
            )}
          </Pressable>
        )}
      </View>
    );
  }
  return (
    <Pressable
      style={[btnStyles.base, btnStyles.connect]}
      onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); onPress(); }}
      disabled={loading}
    >
      {loading ? (
        <ActivityIndicator color={AppColors.primary} size="small" />
      ) : (
        <Text style={[btnStyles.label, btnStyles.connectLabel]}>Connect</Text>
      )}
    </Pressable>
  );
}

const btnStyles = StyleSheet.create({
  base: {
    borderRadius: 8,
    paddingVertical: 7,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 70,
  },
  partnerRow: {
    flexDirection: 'row',
    gap: 6,
  },
  connect: {
    borderWidth: 1,
    borderColor: AppColors.primary,
  },
  accept: {
    backgroundColor: AppColors.primary,
  },
  partner: {
    borderWidth: 1,
    borderColor: AppColors.primary,
    backgroundColor: AppColors.primaryMuted,
  },
  pending: {
    borderWidth: 1,
    borderColor: AppColors.border,
  },
  reject: {
    borderWidth: 1,
    borderColor: AppColors.error,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
  },
  connectLabel: { color: AppColors.primary },
  acceptLabel:  { color: AppColors.background },
  pendingLabel: { color: AppColors.textSecondary },
  partnerLabel: { color: AppColors.primary },
  rejectLabel:   { color: AppColors.error },
  respond:       { borderWidth: 1, borderColor: AppColors.orange },
  respondLabel:  { color: AppColors.orange },
});

export function PartnerCard({ partner, onConnect, isConnecting, onReject, isRejecting, onRemove, isRemoving, onPress }: Props) {
  const pp = partner.partner_profile ?? {
    bio: '', rating: 0, total_partners: 0,
    is_heritage_speaker: false, availability: '', preferred_format: '',
  };

  const cardContent = (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <Avatar username={partner.username} />
        <View style={styles.info}>
          <View style={styles.nameRow}>
            <Text style={styles.name}>{partner.username}</Text>
            {partner.is_online && <View style={styles.onlineDot} />}
          </View>
          <Text style={styles.handle}>@{partner.handle}</Text>
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
          </View>
        </View>
        <ConnectButton
          status={partner.request_status}
          onPress={() => onConnect(partner.id)}
          loading={isConnecting}
          onReject={onReject ? () => onReject(partner.id) : undefined}
          isRejecting={isRejecting}
          onRemove={onRemove ? () => onRemove(partner.id) : undefined}
          isRemoving={isRemoving}
          navigateToDetail={!!onPress}
        />
      </View>

      {pp.bio ? (
        <Text style={styles.bio} numberOfLines={2}>{pp.bio}</Text>
      ) : null}

      <View style={styles.metaRow}>
        {partner.current_section && (
          <Text style={styles.metaChip}>{partner.current_section}</Text>
        )}
        {partner.total_xp > 0 && (
          <Text style={styles.metaChip}>{partner.total_xp.toLocaleString()} XP</Text>
        )}
        {partner.match_percentage > 0 && (
          <Text style={styles.matchChip}>{partner.match_percentage}% match</Text>
        )}
        {pp.availability ? (
          <Text style={styles.metaChip}>{pp.availability}</Text>
        ) : null}
        {pp.preferred_format ? (
          <Text style={styles.metaChip}>{pp.preferred_format}</Text>
        ) : null}
        {pp.rating > 0 && (
          <Text style={styles.metaChip}>⭐ {pp.rating.toFixed(1)}</Text>
        )}
      </View>
    </View>
  );

  if (onPress) {
    return (
      <Pressable onPress={() => onPress(partner.id)}>
        {cardContent}
      </Pressable>
    );
  }
  return cardContent;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: AppColors.card,
    borderRadius: 14,
    padding: 14,
    gap: 10,
    borderWidth: 1,
    borderColor: AppColors.border,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  info: {
    flex: 1,
    gap: 2,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  name: {
    fontSize: 15,
    fontWeight: '700',
    color: AppColors.textPrimary,
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: AppColors.primary,
  },
  handle: {
    fontSize: 12,
    color: AppColors.textSecondary,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  levelBadge: {
    backgroundColor: AppColors.primaryMuted,
    borderRadius: 20,
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: AppColors.primary,
  },
  levelText: {
    fontSize: 10,
    fontWeight: '600',
    color: AppColors.primary,
  },
  heritageBadge: {
    backgroundColor: AppColors.goldMuted,
    borderRadius: 20,
    paddingVertical: 2,
    paddingHorizontal: 8,
  },
  heritageText: {
    fontSize: 10,
    fontWeight: '600',
    color: AppColors.gold,
  },
  bio: {
    fontSize: 13,
    color: AppColors.textSecondary,
    lineHeight: 18,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  metaChip: {
    fontSize: 11,
    color: AppColors.textSecondary,
    backgroundColor: AppColors.background,
    borderRadius: 20,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: AppColors.border,
    overflow: 'hidden',
  },
  matchChip: {
    fontSize: 11,
    fontWeight: '600',
    color: AppColors.primary,
    backgroundColor: AppColors.primaryMuted,
    borderRadius: 20,
    paddingVertical: 3,
    paddingHorizontal: 8,
    overflow: 'hidden',
  },
});
