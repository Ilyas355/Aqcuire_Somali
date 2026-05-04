import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { AppColors } from '@/constants/theme';
import type { SuggestedPartner } from '@/types/api';

interface Props {
  partner: SuggestedPartner;
  onConnect: (id: number) => void;
  isConnecting: boolean;
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
}: {
  status: SuggestedPartner['request_status'];
  onPress: () => void;
  loading: boolean;
}) {
  if (status === 'pending') {
    return (
      <View style={[btnStyles.base, btnStyles.pending]}>
        <Text style={[btnStyles.label, btnStyles.pendingLabel]}>Pending</Text>
      </View>
    );
  }
  if (status === 'received') {
    return (
      <Pressable style={[btnStyles.base, btnStyles.accept]} onPress={onPress} disabled={loading}>
        {loading ? (
          <ActivityIndicator color={AppColors.background} size="small" />
        ) : (
          <Text style={[btnStyles.label, btnStyles.acceptLabel]}>Accept</Text>
        )}
      </Pressable>
    );
  }
  return (
    <Pressable style={[btnStyles.base, btnStyles.connect]} onPress={onPress} disabled={loading}>
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
    minWidth: 80,
  },
  connect: {
    borderWidth: 1,
    borderColor: AppColors.primary,
  },
  accept: {
    backgroundColor: AppColors.primary,
  },
  pending: {
    borderWidth: 1,
    borderColor: AppColors.border,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
  },
  connectLabel: { color: AppColors.primary },
  acceptLabel:  { color: AppColors.background },
  pendingLabel: { color: AppColors.textSecondary },
});

export function PartnerCard({ partner, onConnect, isConnecting }: Props) {
  const pp = partner.partner_profile;

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <Avatar username={partner.username} />
        <View style={styles.info}>
          <Text style={styles.name}>{partner.username}</Text>
          <Text style={styles.handle}>@{partner.handle}</Text>
          {pp.is_heritage_speaker && (
            <View style={styles.heritageBadge}>
              <Text style={styles.heritageText}>Heritage Speaker</Text>
            </View>
          )}
        </View>
        <ConnectButton
          status={partner.request_status}
          onPress={() => onConnect(partner.id)}
          loading={isConnecting}
        />
      </View>

      {pp.bio ? (
        <Text style={styles.bio} numberOfLines={2}>{pp.bio}</Text>
      ) : null}

      <View style={styles.metaRow}>
        {pp.availability ? (
          <Text style={styles.metaChip}>{pp.availability}</Text>
        ) : null}
        {pp.preferred_format ? (
          <Text style={styles.metaChip}>{pp.preferred_format}</Text>
        ) : null}
        {partner.match_percentage > 0 && (
          <Text style={styles.matchChip}>{partner.match_percentage}% match</Text>
        )}
        {pp.rating > 0 && (
          <Text style={styles.metaChip}>⭐ {pp.rating.toFixed(1)}</Text>
        )}
      </View>
    </View>
  );
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
  name: {
    fontSize: 15,
    fontWeight: '700',
    color: AppColors.textPrimary,
  },
  handle: {
    fontSize: 12,
    color: AppColors.textSecondary,
  },
  heritageBadge: {
    alignSelf: 'flex-start',
    marginTop: 4,
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
