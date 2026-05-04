import { StyleSheet, View, ViewProps } from 'react-native';

import { AppColors } from '@/constants/theme';

interface CardProps extends ViewProps {
  padding?: number;
}

export function Card({ style, padding = 16, children, ...props }: CardProps) {
  return (
    <View style={[styles.card, { padding }, style]} {...props}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: AppColors.card,
    borderRadius: 16,
  },
});
