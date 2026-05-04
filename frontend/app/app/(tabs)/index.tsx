import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import { ContinueLearningCard } from '@/components/home/ContinueLearningCard';
import { GreetingHeader } from '@/components/home/GreetingHeader';
import { LevelCard } from '@/components/home/LevelCard';
import { OverallProgressCard } from '@/components/home/OverallProgressCard';
import { ShortcutTiles } from '@/components/home/ShortcutTiles';
import { ScreenWrapper } from '@/components/ui/ScreenWrapper';
import { AppColors } from '@/constants/theme';
import { useHomeScreen } from '@/hooks/useHomeScreen';

export default function HomeScreen() {
  const { data, isLoading, isError } = useHomeScreen();
  const router = useRouter();

  if (isLoading) {
    return (
      <ScreenWrapper>
        <View style={styles.center}>
          <ActivityIndicator color={AppColors.primary} size="large" />
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
    <ScreenWrapper scroll>
      <View style={styles.content}>
        <GreetingHeader
          levelName={data.greeting_level}
          streak={data.user_streak}
        />
        <OverallProgressCard
          percentage={data.overall_progress.percentage}
          totalSections={data.overall_progress.section}
        />
        <ContinueLearningCard
          subtopic={data.current_subtopic}
          onContinue={() => {
            if (data.current_subtopic) {
              router.push(`/lesson/${data.current_subtopic.id}`);
            } else {
              router.navigate('/(tabs)/learn');
            }
          }}
        />
        <ShortcutTiles
          vocabDueCount={data.vocab_due_count}
          onListenPress={() => router.navigate('/(tabs)/listen')}
          onVocabPress={() => router.navigate('/(tabs)/learn')}
        />
        <LevelCard
          levelName={data.greeting_level}
          levelDescription={data.level_description}
          levelPercentage={data.user_level_percentage}
          nextLevelName={data.next_level_name}
        />
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
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
});
