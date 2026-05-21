import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import { useEffect, useRef, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';

import { AppColors } from '@/constants/theme';

interface Props {
  levelName: string | null;
  streak: number;
}

export function GreetingHeader({ levelName, streak }: Props) {
  const breathe = useRef(new Animated.Value(0)).current;
  const animRef = useRef<Animated.CompositeAnimation | null>(null);

  useFocusEffect(
    useCallback(() => {
      animRef.current = Animated.loop(
        Animated.sequence([
          Animated.timing(breathe, { toValue: 1, duration: 1800, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
          Animated.timing(breathe, { toValue: 0, duration: 1800, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        ])
      );
      animRef.current.start();
      return () => animRef.current?.stop();
    }, [breathe])
  );

  const pillScale = breathe.interpolate({ inputRange: [0, 1], outputRange: [1, 1.04] });

  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <View style={styles.eyebrowRow}>
          <View style={styles.accentDot} />
          <Text style={styles.eyebrow}>KU SOO DHAWOOW</Text>
        </View>
        <Text style={styles.title}>Acquire Somali</Text>
        <Text style={styles.subtitle}>
          {levelName === 'Newbie'  ? <>You're a <Text style={styles.levelName}>Newbie</Text> — keep going</> :
           levelName === 'Elite'   ? <>You're <Text style={styles.levelName}>Elite</Text> — keep going</> :
           levelName === 'Expert'  ? <>You're an <Text style={styles.levelName}>Expert!</Text></> :
           'Your Somali journey starts here'}
        </Text>
      </View>

      {streak > 0 && (
        <Animated.View style={[styles.streakPill, { transform: [{ scale: pillScale }] }]}>
          <Text style={styles.streakText}>🔥 {streak}</Text>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingTop: 4,
    marginBottom: 10,
  },
  left: {
    flex: 1,
  },
  eyebrowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  accentDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: AppColors.primary,
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: '700',
    fontFamily: 'serif',
    color: AppColors.primary,
    letterSpacing: 1.2,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: AppColors.textPrimary,
    letterSpacing: -0.8,
    lineHeight: 36,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: AppColors.textSecondary,
    fontWeight: '400',
  },
  levelName: {
    color: AppColors.textPrimary,
    fontWeight: '600',
  },
  streakPill: {
    backgroundColor: AppColors.orangeMuted,
    borderWidth: 1,
    borderColor: 'rgba(245,166,35,0.28)',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginTop: 2,
  },
  streakText: {
    color: AppColors.orange,
    fontWeight: '700',
    fontSize: 12,
  },
});
