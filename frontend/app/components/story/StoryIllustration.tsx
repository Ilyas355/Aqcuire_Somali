import { StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';

import { AppColors } from '@/constants/theme';

interface Props {
  leftSpeaker: string;
  rightSpeaker: string;
}

export function StoryIllustration({ leftSpeaker, rightSpeaker }: Props) {
  return (
    <View style={styles.container}>
      <Image
        source={require('@/assets/images/conversation1-image.png')}
        style={styles.image}
        resizeMode="cover"
      />

      {/* Dark gradient overlay so labels are always readable */}
      <View style={styles.gradientOverlay} />

      {/* Speaker name labels */}
      <View style={styles.labelLeft}>
        <Text style={styles.labelText}>{leftSpeaker.toUpperCase()}</Text>
      </View>
      <View style={styles.labelRight}>
        <Text style={styles.labelText}>{rightSpeaker.toUpperCase()}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0520',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  gradientOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: AppColors.background,
    opacity: 0.6,
  },
  labelLeft: {
    position: 'absolute',
    top: 14,
    left: 16,
    backgroundColor: AppColors.purple,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    shadowColor: AppColors.purple,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.6,
    shadowRadius: 6,
    elevation: 4,
  },
  labelRight: {
    position: 'absolute',
    top: 14,
    right: 16,
    backgroundColor: AppColors.primary,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    shadowColor: AppColors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.6,
    shadowRadius: 6,
    elevation: 4,
  },
  labelText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.9,
  },
});
