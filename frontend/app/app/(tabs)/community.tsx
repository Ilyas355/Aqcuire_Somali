import { useCallback, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';

import { CommunityHeader } from '@/components/community/CommunityHeader';
import { CommunityTabs } from '@/components/community/CommunityTabs';
import type { CommunityTab } from '@/components/community/CommunityTabs';
import { LeaderboardView } from '@/components/community/LeaderboardView';
import { PartnerCard } from '@/components/community/PartnerCard';
import { ScreenWrapper } from '@/components/ui/ScreenWrapper';
import { AppColors } from '@/constants/theme';
import { useOnlineCount, usePartners, usePingPresence, useRemovePartner, useSendPartnerRequest, useSuggestedPartners } from '@/hooks/useCommunity';
import { useHomeScreen } from '@/hooks/useHomeScreen';
import type { MyPartner } from '@/types/api';

export default function CommunityScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<CommunityTab>('suggested');
  const [connectingId, setConnectingId] = useState<number | null>(null);
  const [removingId, setRemovingId] = useState<number | null>(null);

  const { data: homeData } = useHomeScreen();
  const { data: suggested, isLoading: suggestedLoading, isError: suggestedError, refetch: refetchSuggested, isRefetching: isSuggestedRefetching } = useSuggestedPartners();
  const { data: myPartners, isLoading: partnersLoading, isError: partnersError, refetch: refetchPartners, isRefetching: isPartnersRefetching } = usePartners();
  const { data: presenceData } = useOnlineCount();
  const { mutate: pingPresence } = usePingPresence();

  useFocusEffect(
    useCallback(() => {
      pingPresence();
      refetchSuggested();
      refetchPartners();
    }, [pingPresence, refetchSuggested, refetchPartners]),
  );
  const { mutate: sendRequest } = useSendPartnerRequest();
  const { mutate: removePartnerMutation } = useRemovePartner();

  const handleConnect = (userId: number) => {
    setConnectingId(userId);
    sendRequest(userId, { onSettled: () => setConnectingId(null) });
  };

  const handleRemove = (userId: number) => {
    setRemovingId(userId);
    removePartnerMutation(userId, { onSettled: () => setRemovingId(null) });
  };

  const handleFindPartner = () => setActiveTab('suggested');

  const handleRefresh = () => {
    refetchSuggested();
    refetchPartners();
  };
  const isRefreshing = isSuggestedRefetching || isPartnersRefetching;

  return (
    <ScreenWrapper scroll onRefresh={handleRefresh} isRefreshing={isRefreshing}>
      <View style={styles.content}>
        <CommunityHeader
          streak={homeData?.user_streak ?? 0}
          onFindPartner={handleFindPartner}
        />

        <CommunityTabs active={activeTab} onSelect={setActiveTab} />

        {activeTab === 'suggested' && (
          <>
            {presenceData && presenceData.online_count > 0 && (
              <View style={styles.onlineBanner}>
                <View style={styles.onlineDot} />
                <Text style={styles.onlineBannerText}>
                  Learners online right now
                </Text>
                <Text style={styles.onlineCount}>{presenceData.online_count}</Text>
              </View>
            )}

            <Text style={styles.sectionLabel}>SUGGESTED FOR YOU</Text>

            {suggestedLoading && (
              <View style={styles.center}>
                <ActivityIndicator color={AppColors.primary} />
              </View>
            )}

            {suggestedError && (
              <Text style={styles.errorText}>Failed to load partners.</Text>
            )}

            {!suggestedLoading && !suggestedError && suggested?.length === 0 && (
              <View style={styles.empty}>
                <Text style={styles.emptyText}>
                  No suggestions right now. Check back later.
                </Text>
              </View>
            )}

            {suggested?.map((partner) => (
              <PartnerCard
                key={partner.id}
                partner={partner}
                onConnect={handleConnect}
                isConnecting={connectingId === partner.id}
                onPress={(id) => router.push(`/partner/${id}`)}
              />
            ))}
          </>
        )}

        {activeTab === 'partners' && (
          <>
            <Text style={styles.sectionLabel}>YOUR PARTNERS</Text>

            {partnersLoading && (
              <View style={styles.center}>
                <ActivityIndicator color={AppColors.primary} />
              </View>
            )}

            {partnersError && (
              <Text style={styles.errorText}>Failed to load your partners.</Text>
            )}

            {!partnersLoading && !partnersError && myPartners?.length === 0 && (
              <View style={styles.empty}>
                <Text style={styles.emptyTitle}>No partners yet</Text>
                <Text style={styles.emptyText}>
                  Connect with suggested partners to see them here.
                </Text>
              </View>
            )}

            {myPartners?.map((p: MyPartner) => (
              <PartnerCard
                key={p.id}
                partner={{
                  id: p.id,
                  username: p.username,
                  handle: p.handle,
                  avatar: p.avatar,
                  partner_profile: p.partner_profile,
                  request_status: 'partner',
                  match_percentage: 0,
                  total_xp: 0,
                  level_name: null,
                  current_section: null,
                  is_online: false,
                }}
                onConnect={() => {}}
                isConnecting={false}
                onRemove={handleRemove}
                isRemoving={removingId === p.id}
              />
            ))}
          </>
        )}

        {activeTab === 'leaderboard' && <LeaderboardView />}
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 8,
    gap: 16,
  },
  onlineBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: AppColors.primaryMuted,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: AppColors.primary,
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: AppColors.primary,
  },
  onlineBannerText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '500',
    color: AppColors.primary,
  },
  onlineCount: {
    fontSize: 14,
    fontWeight: '700',
    color: AppColors.primary,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: AppColors.textSecondary,
    letterSpacing: 0.8,
  },
  center: {
    paddingVertical: 32,
    alignItems: 'center',
  },
  errorText: {
    color: AppColors.textSecondary,
    fontSize: 14,
    textAlign: 'center',
  },
  empty: {
    paddingVertical: 40,
    alignItems: 'center',
    gap: 8,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: AppColors.textPrimary,
  },
  emptyText: {
    fontSize: 14,
    color: AppColors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});
