import { StyleSheet, Text, View } from 'react-native';

import { AppColors } from '@/constants/theme';

type BadgeVariant = 'primary' | 'purple' | 'gold' | 'outline';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
}

const containerVariant: Record<BadgeVariant, object> = {
  primary: { backgroundColor: AppColors.primaryMuted },
  purple:  { backgroundColor: AppColors.purpleMuted },
  gold:    { backgroundColor: AppColors.goldMuted },
  outline: { backgroundColor: 'transparent', borderWidth: 1, borderColor: AppColors.border },
};

const labelVariant: Record<BadgeVariant, object> = {
  primary: { color: AppColors.primary },
  purple:  { color: AppColors.purple },
  gold:    { color: AppColors.gold },
  outline: { color: AppColors.textSecondary },
};

export function Badge({ label, variant = 'outline', size = 'sm' }: BadgeProps) {
  return (
    <View style={[styles.container, containerVariant[variant], size === 'md' && styles.containerMd]}>
      <Text style={[styles.label, labelVariant[variant], size === 'md' && styles.labelMd]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'flex-start',
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
  },
  containerMd: {
    paddingVertical: 5,
    paddingHorizontal: 12,
  },
  labelMd: {
    fontSize: 14,
  },
});
