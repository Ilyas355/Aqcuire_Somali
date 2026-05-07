import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AppColors } from '@/constants/theme';

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
}

interface Props {
  isPlaying: boolean;
  positionSeconds: number;
  durationSeconds: number;
  onPlayPause: () => void;
  onSeek: (seconds: number) => void;
}

export function StoryPlayer({ isPlaying, positionSeconds, durationSeconds, onPlayPause, onSeek }: Props) {
  const progress = durationSeconds > 0 ? positionSeconds / durationSeconds : 0;

  const handleScrubPress = (event: { nativeEvent: { locationX: number } }, width: number) => {
    if (durationSeconds === 0 || width === 0) return;
    const ratio = Math.max(0, Math.min(1, event.nativeEvent.locationX / width));
    onSeek(ratio * durationSeconds);
  };

  return (
    <View style={styles.container}>
      <Pressable style={styles.playBtn} onPress={onPlayPause}>
        <Text style={styles.playIcon}>{isPlaying ? '⏸' : '▶'}</Text>
      </Pressable>

      <View style={styles.scrubArea}>
        <View
          style={styles.track}
          onStartShouldSetResponder={() => true}
          onResponderGrant={(e) => {
            e.currentTarget.measure((_x, _y, width) => {
              handleScrubPress(e as any, width);
            });
          }}
        >
          <View style={[styles.fill, { flex: progress }]} />
          <View style={[styles.remaining, { flex: 1 - progress }]} />
          <View style={[styles.thumb, { left: `${progress * 100}%` as any }]} />
        </View>

        <View style={styles.timeRow}>
          <Text style={styles.timeText}>{formatTime(positionSeconds)}</Text>
          <Text style={styles.timeText}>{formatTime(durationSeconds)}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppColors.card,
    borderRadius: 16,
    padding: 14,
    gap: 14,
    borderWidth: 1,
    borderColor: AppColors.border,
  },
  playBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: AppColors.purple,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playIcon: {
    fontSize: 18,
    color: AppColors.textPrimary,
  },
  scrubArea: {
    flex: 1,
    gap: 6,
  },
  track: {
    height: 6,
    borderRadius: 3,
    flexDirection: 'row',
    overflow: 'hidden',
    position: 'relative',
  },
  fill: {
    backgroundColor: AppColors.purple,
    borderRadius: 3,
  },
  remaining: {
    backgroundColor: AppColors.border,
    borderRadius: 3,
  },
  thumb: {
    position: 'absolute',
    top: -4,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: AppColors.purple,
    marginLeft: -7,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeText: {
    fontSize: 11,
    color: AppColors.textSecondary,
    fontWeight: '500',
  },
});
