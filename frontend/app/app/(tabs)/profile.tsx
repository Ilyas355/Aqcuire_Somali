import { StyleSheet, Text, View } from 'react-native';

import { AppColors } from '@/constants/theme';

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Profile</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: AppColors.textSecondary,
    fontSize: 16,
  },
});
