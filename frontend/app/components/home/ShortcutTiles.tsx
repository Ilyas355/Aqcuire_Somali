import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { AppColors } from '@/constants/theme';

interface Props {
  vocabDueCount: number;
  onListenPress: () => void;
  onVocabPress: () => void;
}

interface TileProps {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  iconColor: string;
  iconBg: string;
  title: string;
  subtitle: string;
  badge?: string;
  onPress: () => void;
}

function Tile({ icon, iconColor, iconBg, title, subtitle, badge, onPress }: TileProps) {
  return (
    <Pressable style={styles.tile} onPress={onPress}>
      <View style={[styles.iconWrap, { backgroundColor: iconBg }]}>
        <Ionicons name={icon} size={20} color={iconColor} />
      </View>
      <Text style={styles.tileTitle}>{title}</Text>
      <Text style={styles.tileSub}>{subtitle}</Text>
      {badge ? <Text style={styles.badge}>{badge}</Text> : null}
    </Pressable>
  );
}

export function ShortcutTiles({ vocabDueCount, onListenPress, onVocabPress }: Props) {
  return (
    <View style={styles.row}>
      <Tile
        icon="headset"
        iconColor={AppColors.purple}
        iconBg={AppColors.purpleMuted}
        title="Listening"
        subtitle="Stories & audio"
        onPress={onListenPress}
      />
      <Tile
        icon="book"
        iconColor={AppColors.primary}
        iconBg={AppColors.primaryMuted}
        title="Vocab Quiz"
        subtitle="Word recall"
        badge={vocabDueCount > 0 ? `${vocabDueCount} due` : undefined}
        onPress={onVocabPress}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  tile: {
    flex: 1,
    backgroundColor: AppColors.card,
    borderRadius: 16,
    padding: 16,
    gap: 4,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  tileTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: AppColors.textPrimary,
  },
  tileSub: {
    fontSize: 12,
    color: AppColors.textSecondary,
  },
  badge: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: '600',
    color: AppColors.gold,
  },
});
