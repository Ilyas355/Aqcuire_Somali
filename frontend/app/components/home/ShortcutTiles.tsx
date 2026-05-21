import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AppColors } from '@/constants/theme';

interface Props {
  onPracticePress: () => void;
  onConnectPress: () => void;
}

interface TileProps {
  icon: string;
  title: string;
  subtitle: string;
  accentColor: string;
  iconBg: string;
  gradientStart: string;
  borderColor: string;
  onPress: () => void;
}

function Tile({ icon, title, subtitle, accentColor, iconBg, gradientStart, borderColor, onPress }: TileProps) {
  return (
    <Pressable
      style={({ pressed }) => [styles.tile, { borderColor }, pressed && styles.tilePressed]}
      onPress={onPress}
    >
      <LinearGradient
        colors={[gradientStart, AppColors.card]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      <View style={[styles.iconCircle, { backgroundColor: iconBg }]}>
        <Text style={styles.iconEmoji}>{icon}</Text>
      </View>

      <View style={styles.textGroup}>
        <Text style={[styles.title, { color: accentColor }]}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
    </Pressable>
  );
}

export function ShortcutTiles({ onPracticePress, onConnectPress }: Props) {
  return (
    <View style={styles.grid}>
      <Tile
        icon="✏️"
        title="Practice"
        subtitle="Phrases & quizzes"
        accentColor={AppColors.purpleLight}
        iconBg={AppColors.purpleMuted}
        gradientStart={AppColors.purpleAlpha20}
        borderColor={AppColors.purpleAlpha24}
        onPress={onPracticePress}
      />
      <Tile
        icon="🤝"
        title="Community"
        subtitle="Find partners"
        accentColor={AppColors.blueLight}
        iconBg={AppColors.blueMuted}
        gradientStart={AppColors.blueAlpha20}
        borderColor={AppColors.blueAlpha24}
        onPress={onConnectPress}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    gap: 10,
  },
  tile: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    minHeight: 116,
    overflow: 'hidden',
    justifyContent: 'space-between',
  },
  tilePressed: {
    opacity: 0.75,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconEmoji: {
    fontSize: 20,
    lineHeight: 24,
  },
  textGroup: {
    gap: 3,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  subtitle: {
    fontSize: 11,
    color: AppColors.textTertiary,
    lineHeight: 15,
  },
});
