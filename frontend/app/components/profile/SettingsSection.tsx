import { Alert, Pressable, StyleSheet, Switch, Text, View } from 'react-native';

import { AppColors } from '@/constants/theme';
import type { Profile, UpdateProfileRequest } from '@/types/api';

interface Props {
  profile: Profile;
  onUpdate: (data: UpdateProfileRequest) => void;
  onLogout: () => void;
}

function ToggleRow({
  label,
  description,
  value,
  onToggle,
}: {
  label: string;
  description: string;
  value: boolean;
  onToggle: (v: boolean) => void;
}) {
  return (
    <View style={styles.row}>
      <View style={styles.rowText}>
        <Text style={styles.rowLabel}>{label}</Text>
        <Text style={styles.rowDesc}>{description}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: AppColors.border, true: AppColors.primary }}
        thumbColor={AppColors.textPrimary}
        ios_backgroundColor={AppColors.border}
      />
    </View>
  );
}

function ActionRow({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable style={styles.row} onPress={onPress}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.chevron}>›</Text>
    </Pressable>
  );
}

export function SettingsSection({ profile, onUpdate, onLogout }: Props) {
  const handleEditProfile = () =>
    Alert.alert('Edit profile', 'Profile editing will be available soon.');
  const handlePrivacy = () =>
    Alert.alert('Privacy', 'Privacy settings will be available soon.');
  const handleFeedback = () =>
    Alert.alert('Send feedback', 'Thank you! Feedback form coming soon.');

  return (
    <View style={styles.container}>
      <Text style={styles.groupLabel}>SETTINGS</Text>

      <View style={styles.card}>
        <ToggleRow
          label="Daily reminder"
          description="Play phrases on load"
          value={profile.daily_reminder_time !== null}
          onToggle={(v) =>
            onUpdate({ daily_reminder_time: v ? '08:00:00' : null })
          }
        />
        <View style={styles.sep} />
        <ToggleRow
          label="Audio autoplay"
          description="Play phrases on load"
          value={profile.audio_autoplay}
          onToggle={(v) => onUpdate({ audio_autoplay: v })}
        />
        <View style={styles.sep} />
        <ToggleRow
          label="Dark mode"
          description="Always on"
          value={profile.dark_mode}
          onToggle={(v) => onUpdate({ dark_mode: v })}
        />
        <View style={styles.sep} />
        <ToggleRow
          label="Transliteration"
          description="Show romanised Somali"
          value={profile.transliteration}
          onToggle={(v) => onUpdate({ transliteration: v })}
        />
      </View>

      <View style={styles.card}>
        <ActionRow label="Edit profile" onPress={handleEditProfile} />
        <View style={styles.sep} />
        <ActionRow label="Privacy" onPress={handlePrivacy} />
        <View style={styles.sep} />
        <ActionRow label="Send feedback" onPress={handleFeedback} />
      </View>

      <Pressable style={styles.logoutButton} onPress={onLogout}>
        <Text style={styles.logoutText}>🔴  Log out</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  groupLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: AppColors.textSecondary,
    letterSpacing: 0.8,
  },
  card: {
    backgroundColor: AppColors.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: AppColors.border,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 12,
  },
  rowText: {
    flex: 1,
    gap: 2,
  },
  rowLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: AppColors.textPrimary,
  },
  rowDesc: {
    fontSize: 12,
    color: AppColors.textSecondary,
  },
  chevron: {
    fontSize: 20,
    color: AppColors.textSecondary,
    lineHeight: 22,
  },
  sep: {
    height: 1,
    backgroundColor: AppColors.border,
    marginHorizontal: 16,
  },
  logoutButton: {
    backgroundColor: AppColors.card,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: AppColors.error,
  },
  logoutText: {
    fontSize: 15,
    fontWeight: '600',
    color: AppColors.error,
  },
});
