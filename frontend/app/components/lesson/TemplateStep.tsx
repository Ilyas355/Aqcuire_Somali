import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { AppColors } from '@/constants/theme';
import type { Phrase } from '@/types/api';

interface ChipExercise {
  stem: string;
  answer: string;
  options: string[];
}

function buildChipExercise(phrase: Phrase, allPhrases: Phrase[]): ChipExercise {
  const words = phrase.somali.trim().split(/\s+/);
  if (words.length < 2) {
    return { stem: '___', answer: phrase.somali.replace(/[.,!?;]/g, ''), options: [] };
  }
  const rawLast = words[words.length - 1];
  const answer = rawLast.replace(/[.,!?;]/g, '');
  const stem = [...words.slice(0, -1), '___'].join(' ');

  const pool = allPhrases
    .filter(p => p.id !== phrase.id)
    .flatMap(p => p.somali.split(/\s+/).map(w => w.replace(/[.,!?;]/g, '')))
    .filter(w => w.length > 1 && w.toLowerCase() !== answer.toLowerCase());

  const unique = [...new Set(pool)];
  const distractors = unique.sort(() => Math.random() - 0.5).slice(0, 3);
  const options = [answer, ...distractors].sort(() => Math.random() - 0.5);

  return { stem, answer, options };
}

interface Props {
  phrases: Phrase[];
  onComplete: () => void;
  onBack: () => void;
}

export function TemplateStep({ phrases, onComplete, onBack }: Props) {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [selectedChip, setSelectedChip] = useState<string | null>(null);
  const [chipResult, setChipResult] = useState<'correct' | 'wrong' | null>(null);

  const phrase = phrases[phraseIndex];
  const total = phrases.length;

  const exercise = useMemo(
    () => buildChipExercise(phrase, phrases),
    [phrase.id],
  );

  const handleChip = (chip: string) => {
    if (chipResult === 'correct') return;
    setSelectedChip(chip);
    if (chip.toLowerCase() === exercise.answer.toLowerCase()) {
      setChipResult('correct');
    } else {
      setChipResult('wrong');
      setTimeout(() => {
        setSelectedChip(null);
        setChipResult(null);
      }, 600);
    }
  };

  const handleNext = () => {
    if (phraseIndex < total - 1) {
      setPhraseIndex(i => i + 1);
      setSelectedChip(null);
      setChipResult(null);
    } else {
      onComplete();
    }
  };

  const handleBack = () => {
    if (phraseIndex > 0) {
      setPhraseIndex(i => i - 1);
      setSelectedChip(null);
      setChipResult(null);
    } else {
      onBack();
    }
  };

  const chipColor = (chip: string) => {
    if (selectedChip !== chip) return styles.chip;
    if (chipResult === 'correct') return [styles.chip, styles.chipCorrect];
    if (chipResult === 'wrong') return [styles.chip, styles.chipWrong];
    return [styles.chip, styles.chipSelected];
  };

  const hasChips = exercise.options.length > 0;

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.langLabel}>SOMALI</Text>

        {/* Phrase card */}
        <View style={styles.phraseCard}>
          <Text style={styles.somali}>{phrase.somali}</Text>
          <Text style={styles.english}>{phrase.english}</Text>
          <View style={styles.audioRow}>
            <Pressable style={styles.audioBtn}>
              <Text style={styles.audioBtnText}>🔊 Tap to hear</Text>
            </Pressable>
          </View>
        </View>

        {/* Grammar notes */}
        {phrase.grammar_notes.map(note => (
          <View key={note.id} style={styles.grammarNote}>
            <Text style={styles.grammarIcon}>💡</Text>
            <Text style={styles.grammarText}>{note.note}</Text>
          </View>
        ))}

        {/* Word chip exercise */}
        {hasChips && (
          <>
            <Text style={styles.chipInstruction}>── Tap the correct word ──</Text>
            <Text style={styles.stemText}>{exercise.stem}</Text>
            <View style={styles.chipsRow}>
              {exercise.options.map(chip => (
                <Pressable
                  key={chip}
                  style={chipColor(chip)}
                  onPress={() => handleChip(chip)}
                >
                  <Text style={[
                    styles.chipText,
                    selectedChip === chip && chipResult === 'correct' && styles.chipTextCorrect,
                    selectedChip === chip && chipResult === 'wrong' && styles.chipTextWrong,
                  ]}>
                    {chip}
                  </Text>
                </Pressable>
              ))}
            </View>

            {chipResult === 'correct' && (
              <View style={styles.completedRow}>
                <Text style={styles.completedText}>✓ {phrase.somali}</Text>
              </View>
            )}
          </>
        )}
      </ScrollView>

      {/* Nav bar */}
      <View style={styles.navBar}>
        <Pressable style={styles.navBtn} onPress={handleBack}>
          <Text style={styles.navBtnText}>← Back</Text>
        </Pressable>
        <Text style={styles.counter}>{phraseIndex + 1} of {total}</Text>
        <Pressable style={[styles.navBtn, styles.navBtnNext]} onPress={handleNext}>
          <Text style={styles.navBtnNextText}>
            {phraseIndex < total - 1 ? 'Next →' : 'Done →'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    gap: 14,
    paddingBottom: 8,
  },
  langLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: AppColors.textSecondary,
    letterSpacing: 1.2,
  },
  phraseCard: {
    backgroundColor: AppColors.card,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: AppColors.border,
    gap: 8,
  },
  somali: {
    fontSize: 26,
    fontWeight: '700',
    color: AppColors.textPrimary,
    lineHeight: 34,
  },
  english: {
    fontSize: 15,
    color: AppColors.textSecondary,
    lineHeight: 22,
  },
  audioRow: {
    marginTop: 4,
  },
  audioBtn: {
    alignSelf: 'flex-start',
    backgroundColor: AppColors.primaryMuted,
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 14,
  },
  audioBtnText: {
    fontSize: 13,
    color: AppColors.primary,
    fontWeight: '600',
  },
  grammarNote: {
    flexDirection: 'row',
    backgroundColor: AppColors.goldMuted,
    borderRadius: 12,
    padding: 14,
    gap: 10,
    alignItems: 'flex-start',
  },
  grammarIcon: {
    fontSize: 16,
  },
  grammarText: {
    fontSize: 13,
    color: AppColors.gold,
    flex: 1,
    lineHeight: 20,
  },
  chipInstruction: {
    fontSize: 12,
    color: AppColors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
  },
  stemText: {
    fontSize: 20,
    fontWeight: '600',
    color: AppColors.textPrimary,
    textAlign: 'center',
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'center',
    marginTop: 4,
  },
  chip: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: AppColors.border,
    backgroundColor: AppColors.card,
  },
  chipSelected: {
    borderColor: AppColors.primary,
  },
  chipCorrect: {
    borderColor: AppColors.primary,
    backgroundColor: AppColors.primaryMuted,
  },
  chipWrong: {
    borderColor: AppColors.error,
    backgroundColor: '#2D0A0A',
  },
  chipText: {
    fontSize: 15,
    color: AppColors.textPrimary,
    fontWeight: '600',
  },
  chipTextCorrect: {
    color: AppColors.primary,
  },
  chipTextWrong: {
    color: AppColors.error,
  },
  completedRow: {
    backgroundColor: AppColors.primaryMuted,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginTop: 4,
  },
  completedText: {
    fontSize: 15,
    color: AppColors.primary,
    fontWeight: '600',
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: AppColors.border,
    backgroundColor: AppColors.background,
  },
  navBtn: {
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  navBtnText: {
    fontSize: 14,
    color: AppColors.textSecondary,
    fontWeight: '600',
  },
  navBtnNext: {
    backgroundColor: AppColors.primary,
    borderRadius: 20,
    paddingHorizontal: 18,
  },
  navBtnNextText: {
    fontSize: 14,
    color: AppColors.background,
    fontWeight: '700',
  },
  counter: {
    fontSize: 13,
    color: AppColors.textSecondary,
    fontWeight: '500',
  },
});
