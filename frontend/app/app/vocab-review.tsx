import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';

import { AppColors } from '@/constants/theme';
import { useVocabDue, useReviewVocab } from '@/hooks/useProgress';
import type { VocabDueItem } from '@/types/api';

function ProgressDots({ total, current }: { total: number; current: number }) {
  return (
    <View style={styles.dots}>
      {Array.from({ length: total }).map((_, i) => (
        <View
          key={i}
          style={[styles.dot, i < current && styles.dotDone, i === current && styles.dotActive]}
        />
      ))}
    </View>
  );
}

function FlashCard({ item, onGotIt, onAgain, isPending }: {
  item: VocabDueItem;
  onGotIt: () => void;
  onAgain: () => void;
  isPending: boolean;
}) {
  const [flipped, setFlipped] = useState(false);

  return (
    <View style={styles.cardArea}>
      <Pressable
        style={styles.flashcard}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          setFlipped(true);
        }}
      >
        <Text style={styles.cardSomali}>{item.phrase.somali}</Text>
        {flipped ? (
          <Text style={styles.cardEnglish}>{item.phrase.english}</Text>
        ) : (
          <Text style={styles.tapHint}>Tap to reveal</Text>
        )}
      </Pressable>

      {flipped && (
        <View style={styles.ratingRow}>
          <Pressable
            style={[styles.ratingBtn, styles.againBtn]}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              onAgain();
            }}
            disabled={isPending}
          >
            <Text style={styles.againBtnText}>Again</Text>
          </Pressable>
          <Pressable
            style={[styles.ratingBtn, styles.gotItBtn]}
            onPress={() => {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              onGotIt();
            }}
            disabled={isPending}
          >
            {isPending ? (
              <ActivityIndicator color={AppColors.background} size="small" />
            ) : (
              <Text style={styles.gotItBtnText}>Got it ✓</Text>
            )}
          </Pressable>
        </View>
      )}
    </View>
  );
}

export default function VocabReviewScreen() {
  const router = useRouter();
  const { data: items, isLoading } = useVocabDue();
  const { mutate: review, isPending } = useReviewVocab();
  const [index, setIndex] = useState(0);
  const [reviewed, setReviewed] = useState(0);

  const advance = () => {
    setReviewed(r => r + 1);
    setIndex(i => i + 1);
  };

  const handleGotIt = (id: number) => {
    review({ id, quality: 4 }, { onSuccess: advance });
  };

  const handleAgain = (id: number) => {
    review({ id, quality: 1 }, { onSuccess: advance });
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <ActivityIndicator color={AppColors.primary} size="large" />
        </View>
      </SafeAreaView>
    );
  }

  const due = items ?? [];
  const done = due.length === 0 || index >= due.length;

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>← Back</Text>
        </Pressable>
        <Text style={styles.title}>Vocab Review</Text>
        <Text style={styles.counter}>{Math.min(index, due.length)}/{due.length}</Text>
      </View>

      {!done && (
        <ProgressDots total={due.length} current={index} />
      )}

      <View style={styles.body}>
        {done ? (
          <View style={styles.doneCard}>
            <Text style={styles.doneEmoji}>🎉</Text>
            <Text style={styles.doneTitle}>
              {due.length === 0 ? 'Nothing due!' : 'All done!'}
            </Text>
            <Text style={styles.doneBody}>
              {due.length === 0
                ? 'No vocab cards are due right now. Keep learning to add more.'
                : `You reviewed ${reviewed} card${reviewed !== 1 ? 's' : ''}. Great work!`}
            </Text>
            <Pressable
              style={styles.doneBtn}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                router.back();
              }}
            >
              <Text style={styles.doneBtnText}>Back to Home</Text>
            </Pressable>
          </View>
        ) : (
          <FlashCard
            key={due[index].id}
            item={due[index]}
            onGotIt={() => handleGotIt(due[index].id)}
            onAgain={() => handleAgain(due[index].id)}
            isPending={isPending}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: AppColors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.border,
  },
  backBtn: { minWidth: 60 },
  backText: { fontSize: 14, color: AppColors.textSecondary, fontWeight: '600' },
  title: { fontSize: 17, fontWeight: '700', color: AppColors.textPrimary },
  counter: { fontSize: 13, color: AppColors.textSecondary, minWidth: 60, textAlign: 'right' },
  dots: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: AppColors.border,
  },
  dotDone: { backgroundColor: AppColors.primary },
  dotActive: { backgroundColor: AppColors.primary, opacity: 0.5 },
  body: {
    flex: 1,
    padding: 20,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardArea: {
    flex: 1,
    gap: 16,
  },
  flashcard: {
    flex: 1,
    backgroundColor: AppColors.card,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: AppColors.border,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    gap: 20,
  },
  cardSomali: {
    fontSize: 28,
    fontWeight: '700',
    color: AppColors.textPrimary,
    textAlign: 'center',
    lineHeight: 36,
  },
  cardEnglish: {
    fontSize: 18,
    color: AppColors.textSecondary,
    textAlign: 'center',
    lineHeight: 26,
  },
  tapHint: {
    fontSize: 13,
    color: AppColors.textSecondary,
    fontStyle: 'italic',
  },
  ratingRow: {
    flexDirection: 'row',
    gap: 12,
  },
  ratingBtn: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  againBtn: {
    borderWidth: 1.5,
    borderColor: AppColors.error,
  },
  gotItBtn: {
    backgroundColor: AppColors.primary,
  },
  againBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: AppColors.error,
  },
  gotItBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: AppColors.background,
  },
  doneCard: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    padding: 32,
  },
  doneEmoji: { fontSize: 56 },
  doneTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: AppColors.textPrimary,
  },
  doneBody: {
    fontSize: 15,
    color: AppColors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  doneBtn: {
    marginTop: 8,
    backgroundColor: AppColors.primary,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 32,
  },
  doneBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: AppColors.background,
  },
});
