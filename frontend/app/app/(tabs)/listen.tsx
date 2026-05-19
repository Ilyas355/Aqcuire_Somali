import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import { DifficultyLane } from '@/components/listen/DifficultyLane';
import { HeroCard } from '@/components/listen/HeroCard';
import { ListenHeader } from '@/components/listen/ListenHeader';
import { ScreenWrapper } from '@/components/ui/ScreenWrapper';
import { Skeleton } from '@/components/ui/Skeleton';
import { AppColors } from '@/constants/theme';
import { useHomeScreen } from '@/hooks/useHomeScreen';
import { useStories } from '@/hooks/useStories';
import type { StorySummary } from '@/types/api';

const DIFFICULTY_ORDER = ['beginner', 'intermediate', 'advanced'];

export default function ListenScreen() {
  const router = useRouter();
  const { data: stories, isLoading, isError, refetch, isRefetching } = useStories();
  const { data: homeData } = useHomeScreen();

  const heroStory = useMemo((): StorySummary | null => {
    if (!stories) return null;
    return (
      stories.find((s) => s.last_line_position > 0 && !s.is_completed) ??
      stories.find((s) => s.is_trending) ??
      stories[0] ??
      null
    );
  }, [stories]);

  const isResuming = useMemo(
    () => !!heroStory && heroStory.last_line_position > 0 && !heroStory.is_completed,
    [heroStory],
  );

  const lanes = useMemo(() => {
    if (!stories) return [];
    const grouped: Record<string, StorySummary[]> = {};
    for (const s of stories) {
      const key = s.difficulty.toLowerCase();
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(s);
    }
    return DIFFICULTY_ORDER
      .filter((d) => grouped[d]?.length)
      .map((d) => ({ difficulty: d, stories: grouped[d] }));
  }, [stories]);

  const handleStoryPress = (id: number) => router.push(`/story/${id}`);

  if (isLoading) {
    return (
      <ScreenWrapper scroll>
        <View style={styles.header}>
          <Skeleton height={30} width="40%" />
          <Skeleton height={13} width="60%" />
        </View>
        <View style={styles.heroSkeleton}>
          <Skeleton height={172} borderRadius={20} />
        </View>
        <View style={styles.laneSkeleton}>
          <Skeleton height={12} width="30%" />
          <View style={styles.laneSkeletonRow}>
            <Skeleton width={152} height={200} borderRadius={16} />
            <Skeleton width={152} height={200} borderRadius={16} />
            <Skeleton width={152} height={200} borderRadius={16} />
          </View>
        </View>
      </ScreenWrapper>
    );
  }

  if (isError || !stories) {
    return (
      <ScreenWrapper>
        <View style={styles.center}>
          <Text style={styles.errorText}>Failed to load. Pull down to retry.</Text>
        </View>
      </ScreenWrapper>
    );
  }

  if (stories.length === 0) {
    return (
      <ScreenWrapper>
        <View style={styles.center}>
          <Text style={styles.emptyText}>No stories yet.</Text>
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper scroll onRefresh={refetch} isRefreshing={isRefetching}>
      <View style={styles.headerPad}>
        <ListenHeader streak={homeData?.user_streak ?? 0} storyCount={stories.length} />
      </View>

      {heroStory && (
        <View style={styles.heroPad}>
          <HeroCard story={heroStory} isResuming={isResuming} onPress={handleStoryPress} />
        </View>
      )}

      <View style={styles.lanes}>
        {lanes.map((lane) => (
          <DifficultyLane
            key={lane.difficulty}
            difficulty={lane.difficulty}
            stories={lane.stories}
            onPress={handleStoryPress}
          />
        ))}
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  headerPad: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  heroPad: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  lanes: {
    gap: 28,
    paddingBottom: 32,
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
  emptyText: {
    color: AppColors.textSecondary,
    fontSize: 14,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    gap: 8,
    marginBottom: 16,
  },
  heroSkeleton: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  laneSkeleton: {
    paddingHorizontal: 20,
    gap: 12,
  },
  laneSkeletonRow: {
    flexDirection: 'row',
    gap: 12,
  },
});
