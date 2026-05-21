import { useRef, useState } from 'react';
import { Animated, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { AppColors } from '@/constants/theme';
import { DAILY_QUOTES } from '@/constants/quotes';

const CHARACTER_URI =
  'https://api.dicebear.com/9.x/adventurer/png?seed=AquireSomali&size=128&backgroundColor=transparent';

const START_INDEX = Math.floor(Date.now() / 86400000) % DAILY_QUOTES.length;

export function DailyQuoteCard() {
  const [index, setIndex] = useState(START_INDEX);
  const opacity = useRef(new Animated.Value(1)).current;

  const quote = DAILY_QUOTES[index];

  const handlePress = () => {
    Animated.timing(opacity, {
      toValue: 0,
      duration: 180,
      useNativeDriver: true,
    }).start(() => {
      setIndex((i) => (i + 1) % DAILY_QUOTES.length);
      Animated.timing(opacity, {
        toValue: 1,
        duration: 220,
        useNativeDriver: true,
      }).start();
    });
  };

  return (
    <Pressable onPress={handlePress} style={styles.pressable}>
      <LinearGradient
        colors={[AppColors.goldAlpha10, AppColors.card]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}
      >
        <View style={styles.topRow}>
          <View style={styles.labelPill}>
            <Text style={styles.labelText}>✨  QUOTE OF THE DAY</Text>
          </View>
          <View style={styles.avatarWrap}>
            <Image
              source={{ uri: CHARACTER_URI }}
              style={styles.avatar}
              resizeMode="contain"
            />
          </View>
        </View>

        <Animated.View style={{ opacity }}>
          <View style={styles.quoteBlock}>
            <Text style={styles.openMark}>{'"'}</Text>
            <View style={styles.quoteLines}>
              <Text style={styles.somali}>{quote.somali}</Text>
              <Text style={styles.english}>{quote.english}{'"'}</Text>
            </View>
          </View>

          <View style={styles.meaningRow}>
            <Text style={styles.meaningIcon}>💡</Text>
            <Text style={styles.meaning}>{quote.meaning}</Text>
          </View>
        </Animated.View>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    borderRadius: 20,
  },
  card: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: AppColors.goldAlpha22,
    padding: 12,
    gap: 6,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  labelPill: {
    backgroundColor: AppColors.goldAlpha22,
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 9,
  },
  labelText: {
    fontSize: 9,
    fontWeight: '700',
    color: AppColors.gold,
    letterSpacing: 0.5,
  },
  avatarWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: AppColors.goldAlpha06,
    borderWidth: 1.5,
    borderColor: AppColors.goldAlpha30,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  avatar: {
    width: 50,
    height: 50,
  },
  quoteBlock: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 5,
  },
  openMark: {
    fontSize: 34,
    lineHeight: 28,
    color: AppColors.gold,
    opacity: 0.5,
    fontWeight: '800',
  },
  quoteLines: {
    flex: 1,
    gap: 3,
  },
  somali: {
    fontSize: 13,
    fontWeight: '700',
    fontFamily: 'serif',
    color: AppColors.textPrimary,
    lineHeight: 19,
    letterSpacing: 0,
  },
  english: {
    fontSize: 12,
    color: AppColors.textSecondary,
    lineHeight: 17,
    fontStyle: 'italic',
    paddingBottom: 8,
  },
  meaningRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 5,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: AppColors.goldAlpha22,
  },
  meaningIcon: {
    fontSize: 11,
    lineHeight: 16,
  },
  meaning: {
    flex: 1,
    fontSize: 11,
    color: AppColors.textTertiary,
    lineHeight: 16,
  },
});
