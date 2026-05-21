import { StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import { ContinueListeningCard } from '@/components/home/ContinueListeningCard';
import { DailyQuoteCard } from '@/components/home/DailyQuoteCard';
import { GreetingHeader } from '@/components/home/GreetingHeader';
import { LevelCard } from '@/components/home/LevelCard';
import { ShortcutTiles } from '@/components/home/ShortcutTiles';
import { ScreenWrapper } from '@/components/ui/ScreenWrapper';
import { Skeleton, SkeletonCard } from '@/components/ui/Skeleton';
import { AppColors } from '@/constants/theme';
import { useHomeScreen } from '@/hooks/useHomeScreen';

export default function HomeScreen() {
  const { data, isLoading, isError, refetch, isRefetching } = useHomeScreen();
  const router = useRouter();

  if (isLoading) {
    return (
      <ScreenWrapper scroll>
        <View style={styles.content}>
          <Skeleton height={28} width="60%" />
          <SkeletonCard><Skeleton height={80} /></SkeletonCard>
          <SkeletonCard><Skeleton height={120} /></SkeletonCard>
          <SkeletonCard><Skeleton height={60} /></SkeletonCard>
        </View>
      </ScreenWrapper>
    );
  }

  if (isError || !data) {
    return (
      <ScreenWrapper>
        <View style={styles.center}>
          <Text style={styles.errorText}>Failed to load. Pull down to retry.</Text>
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper scroll onRefresh={refetch} isRefreshing={isRefetching}>
      <View style={styles.content}>
        <GreetingHeader
          levelName={data.greeting_level}
          streak={data.user_streak}
        />
<ContinueListeningCard
          story={data.current_story}
          onPress={() => {
            if (data.current_story) {
              router.push(`/story/${data.current_story.id}`);
            } else {
              router.navigate('/(tabs)/listen');
            }
          }}
        />
        <ShortcutTiles
          onPracticePress={() => router.navigate('/(tabs)/learn')}
          onConnectPress={() => router.navigate('/(tabs)/community')}
        />
        <LevelCard
          levelName={data.greeting_level}
          levelDescription={data.level_description}
          levelPercentage={data.user_level_percentage}
          nextLevelName={data.next_level_name}
          xpIntoLevel={data.xp_into_level}
          levelXpRequired={data.level_xp_required}
        />
        <DailyQuoteCard />
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
