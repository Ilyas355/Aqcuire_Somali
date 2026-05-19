import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { LevelCard } from '@/components/home/LevelCard';
import { PartnerProfileModal } from '@/components/community/PartnerProfileModal';
import { AchievementsGrid } from '@/components/profile/AchievementsGrid';
import { EditProfileModal } from '@/components/profile/EditProfileModal';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { SettingsSection } from '@/components/profile/SettingsSection';
import { StatsRow } from '@/components/profile/StatsRow';
import { ScreenWrapper } from '@/components/ui/ScreenWrapper';
import { Skeleton, SkeletonCard } from '@/components/ui/Skeleton';
import { AppColors } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { useCurriculum } from '@/hooks/useCurriculum';
import { useMyPartnerProfile, useUpdatePartnerProfile } from '@/hooks/useCommunity';
import { useProfile, useUpdateProfile } from '@/hooks/useProfile';

export default function ProfileScreen() {
  const [partnerModalVisible, setPartnerModalVisible] = useState(false);
  const [editProfileVisible, setEditProfileVisible] = useState(false);

  const { data: profile, isLoading, isError, refetch, isRefetching } = useProfile();
  const { data: sections } = useCurriculum();
  const { mutate: updateProfile, isPending: isSavingProfile } = useUpdateProfile();
  const { logout } = useAuth();
  const { data: ownPartnerProfile } = useMyPartnerProfile();
  const { mutate: updatePartnerProfile, isPending: isSavingPartnerProfile } = useUpdatePartnerProfile();

  if (isLoading) {
    return (
      <ScreenWrapper scroll>
        <View style={styles.content}>
          <SkeletonCard>
            <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
              <Skeleton width={64} height={64} borderRadius={32} />
              <View style={{ flex: 1, gap: 8 }}>
                <Skeleton height={18} width="60%" />
                <Skeleton height={14} width="40%" />
              </View>
            </View>
          </SkeletonCard>
          <SkeletonCard><Skeleton height={60} /></SkeletonCard>
          <SkeletonCard><Skeleton height={80} /></SkeletonCard>
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
    <ScreenWrapper scroll onRefresh={refetch} isRefreshing={isRefetching}>
      <View style={styles.content}>
        <ProfileHeader profile={profile} />

        <LevelCard
          levelName={profile.level?.current_level.name ?? null}
          levelDescription={profile.level?.current_level.description ?? null}
          levelPercentage={profile.level?.level_percentage ?? 0}
          nextLevelName={profile.level?.next_level_name ?? null}
        />

        <StatsRow profile={profile} sections={sections} />

<AchievementsGrid achievements={profile.achievements} />

        <SettingsSection
          profile={profile}
          onUpdate={updateProfile}
          onLogout={logout}
          onEditProfile={() => setEditProfileVisible(true)}
          onEditPartnerProfile={() => setPartnerModalVisible(true)}
        />
      </View>

      <EditProfileModal
        visible={editProfileVisible}
        profile={profile}
        isSaving={isSavingProfile}
        onSave={(data) => {
          updateProfile(data, {
            onSuccess: () => setEditProfileVisible(false),
          });
        }}
        onClose={() => setEditProfileVisible(false)}
      />

      <PartnerProfileModal
        visible={partnerModalVisible}
        current={ownPartnerProfile}
        isSaving={isSavingPartnerProfile}
        onSave={(data) => {
          updatePartnerProfile(data, {
            onSuccess: () => setPartnerModalVisible(false),
          });
        }}
        onClose={() => setPartnerModalVisible(false)}
      />
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
