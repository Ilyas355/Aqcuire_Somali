import { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { CommunityHeader } from '@/components/community/CommunityHeader';
import { CommunityTabs } from '@/components/community/CommunityTabs';
import type { CommunityTab } from '@/components/community/CommunityTabs';
import { LeaderboardView } from '@/components/community/LeaderboardView';
import { PartnerCard } from '@/components/community/PartnerCard';
import { ScreenWrapper } from '@/components/ui/ScreenWrapper';
import { AppColors } from '@/constants/theme';
import { useSendPartnerRequest, useSuggestedPartners } from '@/hooks/useCommunity';
import { useHomeScreen } from '@/hooks/useHomeScreen';

export default function CommunityScreen() {
  const [activeTab, setActiveTab] = useState<CommunityTab>('suggested');
  const [connectingId, setConnectingId] = useState<number | null>(null);

  const { data: homeData } = useHomeScreen();
  const { data: partners, isLoading, isError } = useSuggestedPartners();
  const { mutate: sendRequest } = useSendPartnerRequest();

  const handleConnect = (userId: number) => {
    setConnectingId(userId);
    sendRequest(userId, { onSettled: () => setConnectingId(null) });
  };

  const handleFindPartner = () => {
    setActiveTab('suggested');
  };

  return (
    <ScreenWrapper scroll>
      <View style={styles.content}>
        <CommunityHeader
          streak={homeData?.user_streak ?? 0}
          onFindPartner={handleFindPartner}
        />

        <CommunityTabs active={activeTab} onSelect={setActiveTab} />

        {activeTab === 'suggested' && (
          <>
            <Text style={styles.sectionLabel}>SUGGESTED FOR YOU</Text>

            {isLoading && (
              <View style={styles.center}>
                <ActivityIndicator color={AppColors.primary} />
              </View>
            )}

            {isError && (
              <Text style={styles.errorText}>Failed to load partners.</Text>
            )}

            {!isLoading && !isError && partners?.length === 0 && (
              <View style={styles.empty}>
                <Text style={styles.emptyText}>
                  No suggestions right now. Check back later.
                </Text>
              </View>
            )}

            {partners?.map((partner) => (
              <PartnerCard
                key={partner.id}
                partner={partner}
                onConnect={handleConnect}
                isConnecting={connectingId === partner.id}
              />
            ))}
          </>
        )}

        {activeTab === 'partners' && (
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>Your partners</Text>
            <Text style={styles.emptyText}>
              Connect with suggested partners to see them here.
            </Text>
          </View>
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
