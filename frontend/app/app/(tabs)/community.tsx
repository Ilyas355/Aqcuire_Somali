import { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Animated, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import { useRouter } from 'expo-router';

import { CommunityHeader } from '@/components/community/CommunityHeader';
import { CommunityTabs } from '@/components/community/CommunityTabs';
import type { CommunityTab } from '@/components/community/CommunityTabs';
import { LeaderboardView } from '@/components/community/LeaderboardView';
import { PartnerCard } from '@/components/community/PartnerCard';
import { PartnerProfileModal } from '@/components/community/PartnerProfileModal';
import { SetupPartnerProfilePrompt } from '@/components/community/SetupPartnerProfilePrompt';
import { ScreenWrapper } from '@/components/ui/ScreenWrapper';
import { AppColors } from '@/constants/theme';
import { useMyPartnerProfile, useOnlineCount, usePartners, usePingPresence, useRemovePartner, useSendPartnerRequest, useSuggestedPartners, useUpdatePartnerProfile } from '@/hooks/useCommunity';
import { useHomeScreen } from '@/hooks/useHomeScreen';
import type { MyPartner, OwnPartnerProfile } from '@/types/api';

function isBlankProfile(p: OwnPartnerProfile): boolean {
  return p.bio.trim() === '' && p.availability.trim() === '' && p.preferred_format.trim() === '';
}

export default function CommunityScreen() {
  const router = useRouter();
  const isFocused = useIsFocused();
  const [activeTab, setActiveTab] = useState<CommunityTab>('suggested');
  const [connectingId, setConnectingId] = useState<number | null>(null);
  const [removingId, setRemovingId] = useState<number | null>(null);
  const [showSetupPrompt, setShowSetupPrompt] = useState(false);
  const [partnerProfileVisible, setPartnerProfileVisible] = useState(false);

  // Tab-switch animation
  const contentFade  = useRef(new Animated.Value(1)).current;
  const contentSlide = useRef(new Animated.Value(0)).current;

  const handleTabChange = useCallback((tab: CommunityTab) => {
    contentFade.setValue(0);
    contentSlide.setValue(14);
    setActiveTab(tab);
    Animated.parallel([
      Animated.timing(contentFade,  { toValue: 1, duration: 220, useNativeDriver: true }),
      Animated.spring(contentSlide, { toValue: 0, useNativeDriver: true, damping: 20, stiffness: 250 }),
    ]).start();
  }, []);

  const { data: homeData } = useHomeScreen();
  const { data: suggested, isLoading: suggestedLoading, isError: suggestedError, refetch: refetchSuggested } = useSuggestedPartners();
  const { data: myPartners, isLoading: partnersLoading, isError: partnersError, refetch: refetchPartners } = usePartners();
  const { data: presenceData } = useOnlineCount();
  const { mutate: pingPresence } = usePingPresence();
  const { data: ownPartnerProfile } = useMyPartnerProfile();
  const { mutate: updatePartnerProfile, isPending: isSavingPartnerProfile } = useUpdatePartnerProfile();
  const [isPullRefreshing, setIsPullRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      pingPresence();
      refetchSuggested();
      refetchPartners();
    }, [pingPresence, refetchSuggested, refetchPartners]),
  );

  useEffect(() => {
    if (isFocused && ownPartnerProfile !== undefined && isBlankProfile(ownPartnerProfile)) {
      setShowSetupPrompt(true);
    }
  }, [isFocused, ownPartnerProfile]);

  const handleSetUpProfile = () => {
    setShowSetupPrompt(false);
    setPartnerProfileVisible(true);
  };

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

  const handleFindPartner = () => handleTabChange('suggested');

  const handlePullRefresh = useCallback(async () => {
    setIsPullRefreshing(true);
    await Promise.all([refetchSuggested(), refetchPartners()]);
    setIsPullRefreshing(false);
  }, [refetchSuggested, refetchPartners]);

  return (
    <>
    <ScreenWrapper scroll onRefresh={handlePullRefresh} isRefreshing={isPullRefreshing}>
      <View style={styles.content}>

        <CommunityHeader
          streak={homeData?.user_streak ?? 0}
          onFindPartner={handleFindPartner}
        />

        <CommunityTabs active={activeTab} onSelect={handleTabChange} />

        <Animated.View style={{ opacity: contentFade, transform: [{ translateY: contentSlide }] }}>

          {/* ── Suggested ── */}
          {activeTab === 'suggested' && (
            <View style={styles.tabContent}>
              {presenceData && presenceData.online_count > 0 && (
                <View style={styles.onlineBanner}>
                  <View style={styles.onlineDot} />
                  <Text style={styles.onlineBannerText}>Learners online right now</Text>
                  <View style={styles.onlineCountBadge}>
                    <Text style={styles.onlineCountText}>{presenceData.online_count}</Text>
                  </View>
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
                  <Text style={styles.emptyTitle}>No suggestions right now</Text>
                  <Text style={styles.emptyText}>Check back later — we'll find you a match.</Text>
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
            </View>
          )}

          {/* ── Partners ── */}
          {activeTab === 'partners' && (
            <View style={styles.tabContent}>
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
                    Connect with someone from the Suggested tab.
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
                  onPress={(id) => router.push(`/partner/${id}`)}
                />
              ))}
            </View>
          )}

          {/* ── Leaderboard ── */}
          {activeTab === 'leaderboard' && (
            <View style={styles.tabContent}>
              <LeaderboardView />
            </View>
          )}

        </Animated.View>
      </View>
    </ScreenWrapper>

    <SetupPartnerProfilePrompt
      visible={showSetupPrompt}
      onSetUp={handleSetUpProfile}
      onDismiss={() => setShowSetupPrompt(false)}
    />

    <PartnerProfileModal
      visible={partnerProfileVisible}
      current={ownPartnerProfile}
      isSaving={isSavingPartnerProfile}
      onSave={(data) => {
        updatePartnerProfile(data, {
          onSuccess: () => setPartnerProfileVisible(false),
        });
      }}
      onClose={() => setPartnerProfileVisible(false)}
    />
    </>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    gap: 16,
  },
  tabContent: {
    gap: 12,
  },
  onlineBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: AppColors.primaryMuted,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: AppColors.primaryAlpha22,
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
  onlineCountBadge: {
    backgroundColor: AppColors.primary,
    borderRadius: 10,
    paddingVertical: 2,
    paddingHorizontal: 8,
  },
  onlineCountText: {
    fontSize: 12,
    fontWeight: '800',
    color: AppColors.onPrimary,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: AppColors.textTertiary,
    letterSpacing: 1,
  },
  center: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  errorText: {
    color: AppColors.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    paddingVertical: 24,
  },
  empty: {
    paddingVertical: 48,
    alignItems: 'center',
    gap: 6,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: AppColors.textPrimary,
  },
  emptyText: {
    fontSize: 14,
    color: AppColors.textTertiary,
    textAlign: 'center',
    lineHeight: 20,
  },
});
