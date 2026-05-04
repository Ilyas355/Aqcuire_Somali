import { useMemo, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { CategoryTabs } from '@/components/listen/CategoryTabs';
import { FeaturedStoryCard } from '@/components/listen/FeaturedStoryCard';
import { ListenHeader } from '@/components/listen/ListenHeader';
import { StoryRow } from '@/components/listen/StoryRow';
import { ScreenWrapper } from '@/components/ui/ScreenWrapper';
import { AppColors } from '@/constants/theme';
import { useHomeScreen } from '@/hooks/useHomeScreen';
import { useStories } from '@/hooks/useStories';
import type { StoryCategory } from '@/types/api';

export default function ListenScreen() {
  const { data: stories, isLoading, isError } = useStories();
  const { data: homeData } = useHomeScreen();
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);

  const categories = useMemo((): StoryCategory[] => {
    if (!stories) return [];
    const seen = new Set<number>();
    const result: StoryCategory[] = [];
    for (const s of stories) {
      if (!seen.has(s.category.id)) {
        seen.add(s.category.id);
        result.push(s.category);
      }
    }
    return result;
  }, [stories]);

  const filteredStories = useMemo(() => {
    if (!stories) return [];
    if (selectedCategoryId === null) return stories;
    return stories.filter((s) => s.category.id === selectedCategoryId);
  }, [stories, selectedCategoryId]);

  const featuredStory = useMemo(
    () => (selectedCategoryId === null ? stories?.find((s) => s.is_trending) ?? null : null),
    [stories, selectedCategoryId],
  );

  const listedStories = useMemo(
    () =>
      selectedCategoryId === null
        ? filteredStories.filter((s) => !s.is_trending)
        : filteredStories,
    [filteredStories, selectedCategoryId],
  );

  const sectionLabel = useMemo(() => {
    if (selectedCategoryId !== null) {
      const cat = categories.find((c) => c.id === selectedCategoryId);
      return cat ? `${cat.name.toUpperCase()} STORIES` : 'STORIES';
    }
    const first = listedStories[0];
    return first ? `${first.difficulty.toUpperCase()} STORIES` : 'STORIES';
  }, [listedStories, selectedCategoryId, categories]);

  const handleStoryPress = (_id: number) => {
    // Story player screen will be wired here
  };

  if (isLoading) {
    return (
      <ScreenWrapper>
        <View style={styles.center}>
          <ActivityIndicator color={AppColors.primary} size="large" />
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

  return (
    <ScreenWrapper scroll>
      <View style={styles.content}>
        <ListenHeader streak={homeData?.user_streak ?? 0} />

        <CategoryTabs
          categories={categories}
          selectedId={selectedCategoryId}
          onSelect={setSelectedCategoryId}
        />

        {featuredStory && (
          <FeaturedStoryCard story={featuredStory} onPress={handleStoryPress} />
        )}

        {listedStories.length > 0 && (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionLabel}>{sectionLabel}</Text>
              <Text style={styles.viewAll}>View all →</Text>
            </View>

            <View style={styles.list}>
              {listedStories.map((story) => (
                <StoryRow key={story.id} story={story} onPress={handleStoryPress} />
              ))}
            </View>
          </>
        )}

        {listedStories.length === 0 && !featuredStory && (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No stories yet. Add some in the admin panel.</Text>
          </View>
        )}
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
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    color: AppColors.textSecondary,
    fontSize: 14,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: AppColors.textSecondary,
    letterSpacing: 0.8,
  },
  viewAll: {
    fontSize: 12,
    fontWeight: '600',
    color: AppColors.primary,
  },
  list: {
    gap: 0,
  },
  empty: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyText: {
    color: AppColors.textSecondary,
    fontSize: 14,
    textAlign: 'center',
  },
});
