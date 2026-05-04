import { ActivityIndicator, Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import { LearnHeader } from '@/components/learn/LearnHeader';
import { SectionCard } from '@/components/learn/SectionCard';
import { ScreenWrapper } from '@/components/ui/ScreenWrapper';
import { AppColors } from '@/constants/theme';
import { useCurriculum } from '@/hooks/useCurriculum';
import { useHomeScreen } from '@/hooks/useHomeScreen';

export default function LearnScreen() {
  const { data: sections, isLoading: sectionsLoading, isError: sectionsError } = useCurriculum();
  const { data: homeData } = useHomeScreen();
  const router = useRouter();

  const isLoading = sectionsLoading;
  const isError = sectionsError;

  if (isLoading) {
    return (
      <ScreenWrapper>
        <View style={styles.center}>
          <ActivityIndicator color={AppColors.primary} size="large" />
        </View>
      </ScreenWrapper>
    );
  }

  if (isError || !sections) {
    return (
      <ScreenWrapper>
        <View style={styles.center}>
          <Text style={styles.errorText}>Failed to load. Pull down to retry.</Text>
        </View>
      </ScreenWrapper>
    );
  }

  const handleContinue = (subtopicId: number) => {
    router.push(`/lesson/${subtopicId}`);
  };

  const handleHowItWorks = () => {
    Alert.alert(
      'How it works',
      'Complete subtopics in order to unlock the next section. Each section awards XP toward your level.',
    );
  };

  return (
    <ScreenWrapper scroll>
      <View style={styles.content}>
        <LearnHeader
          streak={homeData?.user_streak ?? 0}
          overallPercentage={homeData?.overall_progress.percentage ?? 0}
        />

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionLabel}>SECTIONS</Text>
          <Pressable onPress={handleHowItWorks} style={styles.howItWorks}>
            <Text style={styles.howItWorksText}>HOW IT WORKS ℹ</Text>
          </Pressable>
        </View>

        {sections.map((section, index) => (
          <SectionCard
            key={section.id}
            section={section}
            previousSectionOrder={index > 0 ? sections[index - 1].order : null}
            onContinue={handleContinue}
          />
        ))}
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
  howItWorks: {
    padding: 4,
  },
  howItWorksText: {
    fontSize: 11,
    fontWeight: '600',
    color: AppColors.primary,
    letterSpacing: 0.6,
  },
});
