import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { LevelCard } from '@/components/home/LevelCard';
import { AchievementsGrid } from '@/components/profile/AchievementsGrid';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { SectionProgressList } from '@/components/profile/SectionProgressList';
import { SettingsSection } from '@/components/profile/SettingsSection';
import { StatsRow } from '@/components/profile/StatsRow';
import { ScreenWrapper } from '@/components/ui/ScreenWrapper';
import { AppColors } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { useCurriculum } from '@/hooks/useCurriculum';
import { useProfile, useUpdateProfile } from '@/hooks/useProfile';

export default function ProfileScreen() {
  const { data: profile, isLoading, isError } = useProfile();
  const { data: sections } = useCurriculum();
  const { mutate: updateProfile } = useUpdateProfile();
  const { logout } = useAuth();

  if (isLoading) {
    return (
      <ScreenWrapper>
        <View style={styles.center}>
          <ActivityIndicator color={AppColors.primary} size="large" />
        </View>
      </ScreenWrapper>
    );
  }

  if (isError || !profile) {
    return (
      <ScreenWrapper>
        <View style={styles.center}>
          <Text style={styles.errorText}>Failed to load profile.</Text>
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper scroll>
      <View style={styles.content}>
        <ProfileHeader profile={profile} />

        <LevelCard
          levelName={profile.level?.current_level.name ?? null}
          levelDescription={profile.level?.current_level.description ?? null}
          levelPercentage={profile.level?.level_percentage ?? 0}
          nextLevelName={profile.level?.next_level_name ?? null}
        />

        <StatsRow profile={profile} sections={sections} />

        <SectionProgressList sections={sections ?? []} />

        <AchievementsGrid achievements={profile.achievements} />

        <SettingsSection
          profile={profile}
          onUpdate={updateProfile}
          onLogout={logout}
        />
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
    gap: 20,
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
});
