import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Audio } from 'expo-av';
import { File, Paths } from 'expo-file-system';

import { StoryPlayer } from '@/components/story/StoryPlayer';
import { StoryPlayerHeader } from '@/components/story/StoryPlayerHeader';
import { TranscriptLine } from '@/components/story/TranscriptLine';
import { TranscriptToggle } from '@/components/story/TranscriptToggle';
import { AppColors } from '@/constants/theme';
import { useCompleteStory, useStoryDetail, useUpdateStoryProgress } from '@/hooks/useStories';
import type { StoryLine } from '@/types/api';

export default function StoryPlayerScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const storyId = Number(id ?? '0');

  const { data: story, isLoading, isError } = useStoryDetail(storyId);
  const { mutate: updateProgress } = useUpdateStoryProgress(storyId);
  const { mutate: completeStory } = useCompleteStory();

  const soundRef = useRef<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [positionSeconds, setPositionSeconds] = useState(0);
  const [activeLineId, setActiveLineId] = useState<number | null>(null);
  const [language, setLanguage] = useState<'somali' | 'english'>('somali');
  const [tipLine, setTipLine] = useState<StoryLine | null>(null);
  const scrollRef = useRef<ScrollView>(null);
  const lineOffsetsRef = useRef<Record<number, number>>({});
  const completedRef = useRef(false);

  useEffect(() => {
    if (!story?.audio_url) return;
    let mounted = true;

    (async () => {
      await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });

      // Django dev server doesn't support range requests required by AVPlayer.
      // Download to device cache first so playback works locally.
      const filename = story.audio_url.split('/').pop() ?? `story_${storyId}.mp4`;
      const localFile = new File(Paths.cache, filename);
      if (!localFile.exists) {
        await File.downloadFileAsync(story.audio_url, localFile, { idempotent: true });
      }

      const { sound } = await Audio.Sound.createAsync(
        { uri: localFile.uri },
        { shouldPlay: false },
        (status) => {
          if (!status.isLoaded || !mounted) return;
          setPositionSeconds(status.positionMillis / 1000);
          setIsPlaying(status.isPlaying);
          if (status.didJustFinish && !completedRef.current) {
            completedRef.current = true;
            completeStory(storyId);
          }
        },
      );
      soundRef.current = sound;
    })();

    return () => {
      mounted = false;
      soundRef.current?.unloadAsync();
    };
  }, [story?.audio_url]);

  useEffect(() => {
    if (!story?.lines?.length) return;

    const sorted = [...story.lines].sort((a, b) => a.timestamp_seconds - b.timestamp_seconds);
    let active: StoryLine | null = null;
    for (const line of sorted) {
      if (line.timestamp_seconds <= positionSeconds) active = line;
      else break;
    }

    if (!active || active.id === activeLineId) return;
    setActiveLineId(active.id);

    const offset = lineOffsetsRef.current[active.id];
    if (offset !== undefined) {
      scrollRef.current?.scrollTo({ y: Math.max(0, offset - 100), animated: true });
    }

    const idx = sorted.findIndex((l) => l.id === active!.id);
    if (idx > 0 && idx % 5 === 0) {
      updateProgress({ last_line_position: idx });
    }
  }, [positionSeconds, story?.lines]);

  const handlePlayPause = async () => {
    const sound = soundRef.current;
    if (!sound) return;
    if (isPlaying) {
      await sound.pauseAsync();
    } else {
      await sound.playAsync();
    }
  };

  const handleSeek = async (seconds: number) => {
    await soundRef.current?.setPositionAsync(seconds * 1000);
  };

  const handleLinePress = (line: StoryLine) => {
    handleSeek(line.timestamp_seconds);
    if (line.tips.length > 0) setTipLine(line);
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
        <View style={styles.centered}>
          <ActivityIndicator color={AppColors.primary} size="large" />
        </View>
      </SafeAreaView>
    );
  }

  if (isError || !story) {
    return (
      <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
        <View style={styles.centered}>
          <Text style={styles.errorText}>Failed to load story. Please try again.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <StoryPlayerHeader
        title={story.title}
        xpReward={story.xp_reward}
        onBack={() => router.back()}
      />

      <ScrollView
        ref={scrollRef}
        style={styles.scroll}
        contentContainerStyle={styles.transcript}
        showsVerticalScrollIndicator={false}
      >
        <TranscriptToggle selected={language} onChange={setLanguage} />

        <View style={styles.lines}>
          {story.lines.map((line) => (
            <View
              key={line.id}
              onLayout={(e) => {
                lineOffsetsRef.current[line.id] = e.nativeEvent.layout.y;
              }}
            >
              <TranscriptLine
                line={line}
                isActive={line.id === activeLineId}
                language={language}
                onPress={handleLinePress}
              />
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={styles.playerBar}>
        <StoryPlayer
          isPlaying={isPlaying}
          positionSeconds={positionSeconds}
          durationSeconds={story.duration_seconds}
          onPlayPause={handlePlayPause}
          onSeek={handleSeek}
        />
      </View>

      <Modal
        visible={tipLine !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setTipLine(null)}
      >
        <Pressable style={styles.overlay} onPress={() => setTipLine(null)}>
          <Pressable style={styles.tipCard} onPress={() => {}}>
            <Text style={styles.tipLineText}>
              {tipLine ? (language === 'somali' ? tipLine.somali : tipLine.english) : ''}
            </Text>
            {tipLine?.tips.map((tip) => (
              <View key={tip.id} style={styles.tipItem}>
                <Text style={styles.tipTitle}>{tip.tip_text}</Text>
                <Text style={styles.tipExplanation}>{tip.explanation}</Text>
              </View>
            ))}
            <Pressable style={styles.closeBtn} onPress={() => setTipLine(null)}>
              <Text style={styles.closeBtnText}>Got it</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: AppColors.background,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    fontSize: 14,
    color: AppColors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  scroll: {
    flex: 1,
  },
  transcript: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
    gap: 8,
  },
  lines: {
    marginTop: 12,
    gap: 4,
  },
  playerBar: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: AppColors.border,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  tipCard: {
    backgroundColor: AppColors.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    gap: 16,
    borderWidth: 1,
    borderColor: AppColors.border,
  },
  tipLineText: {
    fontSize: 16,
    fontWeight: '700',
    color: AppColors.textPrimary,
    marginBottom: 4,
  },
  tipItem: {
    gap: 4,
  },
  tipTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: AppColors.gold,
  },
  tipExplanation: {
    fontSize: 13,
    color: AppColors.textSecondary,
    lineHeight: 19,
  },
  closeBtn: {
    backgroundColor: AppColors.primary,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 4,
  },
  closeBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: AppColors.background,
  },
});
