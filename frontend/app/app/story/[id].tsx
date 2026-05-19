import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Audio } from 'expo-av';
import { File, Paths } from 'expo-file-system';

import { StoryIllustration } from '@/components/story/StoryIllustration';
import { StoryPlayer } from '@/components/story/StoryPlayer';
import { StoryPlayerHeader } from '@/components/story/StoryPlayerHeader';
import { TranscriptLine } from '@/components/story/TranscriptLine';
import { AppColors } from '@/constants/theme';
import { useStoryDetail, useUpdateStoryProgress } from '@/hooks/useStories';
import type { StoryLine } from '@/types/api';

export default function StoryPlayerScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const storyId = Number(id ?? '0');

  const { data: story, isLoading, isError } = useStoryDetail(storyId);
  const { mutate: updateProgress } = useUpdateStoryProgress(storyId);
  const handleCompleteStory = () => router.push(`/story-quiz/${storyId}`);

  const soundRef = useRef<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [positionSeconds, setPositionSeconds] = useState(0);
  const [activeLineId, setActiveLineId] = useState<number | null>(null);
  const [tipLine, setTipLine] = useState<StoryLine | null>(null);
  const [showCompleteButton, setShowCompleteButton] = useState(false);
  const scrollRef = useRef<ScrollView>(null);
  const lineOffsetsRef = useRef<Record<number, number>>({});

  useEffect(() => {
    if (!story) return;
    if (!story.audio_url) {
      setShowCompleteButton(true);
      return;
    }
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
          if (status.didJustFinish) {
            setShowCompleteButton(true);
          }
        },
      );

      if (mounted) {
        soundRef.current = sound;
      } else {
        // Component unmounted while audio was loading — unload immediately
        sound.unloadAsync();
      }
    })();

    return () => {
      mounted = false;
      soundRef.current?.unloadAsync();
      soundRef.current = null;
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
      scrollRef.current?.scrollTo({ y: Math.max(0, offset - 80), animated: true });
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

  const speakers = story ? Array.from(new Set(story.lines.map((l) => l.speaker_name))) : [];
  const leftSpeaker = speakers[0] ?? '';
  const rightSpeaker = speakers[1] ?? '';

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <StoryPlayerHeader
        title={story?.title ?? ''}
        xpReward={story?.xp_reward ?? 0}
        onBack={() => router.back()}
      />

      {/* Top half — image renders immediately, no API gate */}
      <View style={styles.illustrationPane}>
        <StoryIllustration leftSpeaker={leftSpeaker} rightSpeaker={rightSpeaker} />
      </View>

      {/* Bottom half — transcript + player */}
      <View style={styles.bottomPane}>
        {isLoading && (
          <View style={styles.centered}>
            <ActivityIndicator color={AppColors.primary} size="large" />
          </View>
        )}

        {isError && !story && (
          <View style={styles.centered}>
            <Text style={styles.errorText}>Failed to load story. Please try again.</Text>
          </View>
        )}

        {story && (
          <>
            <ScrollView
              ref={scrollRef}
              style={styles.scroll}
              contentContainerStyle={styles.transcriptContent}
              showsVerticalScrollIndicator={false}
            >
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
                    onPress={handleLinePress}
                  />
                </View>
              ))}
            </ScrollView>

            {showCompleteButton && (
              <Pressable style={styles.completeBtn} onPress={handleCompleteStory}>
                <Text style={styles.completeBtnText}>Complete Story →</Text>
              </Pressable>
            )}

            {story.audio_url ? (
              <View style={styles.playerBar}>
                <StoryPlayer
                  isPlaying={isPlaying}
                  positionSeconds={positionSeconds}
                  durationSeconds={story.duration_seconds}
                  onPlayPause={handlePlayPause}
                  onSeek={handleSeek}
                />
              </View>
            ) : null}
          </>
        )}
      </View>

      {/* Tip bottom sheet */}
      <Modal
        visible={tipLine !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setTipLine(null)}
      >
        <Pressable style={styles.overlay} onPress={() => setTipLine(null)}>
          <Pressable style={styles.tipCard} onPress={() => {}}>
            <Text style={styles.tipLineTextSomali}>{tipLine?.somali ?? ''}</Text>
            <Text style={styles.tipLineTextEnglish}>{tipLine?.english ?? ''}</Text>
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
  illustrationPane: {
    flex: 1,
  },
  bottomPane: {
    flex: 1,
    borderTopWidth: 1,
    borderTopColor: AppColors.border,
  },
  scroll: {
    flex: 1,
  },
  transcriptContent: {
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 8,
    gap: 2,
  },
  completeBtn: {
    marginHorizontal: 16,
    marginVertical: 10,
    backgroundColor: AppColors.primary,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  completeBtnText: {
    color: AppColors.background,
    fontSize: 15,
    fontWeight: '700',
  },
  playerBar: {
    paddingHorizontal: 16,
    paddingVertical: 10,
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
    gap: 14,
    borderWidth: 1,
    borderColor: AppColors.border,
  },
  tipLineTextSomali: {
    fontSize: 16,
    fontWeight: '700',
    color: AppColors.textPrimary,
  },
  tipLineTextEnglish: {
    fontSize: 13,
    color: AppColors.textSecondary,
    fontStyle: 'italic',
    marginTop: -8,
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
