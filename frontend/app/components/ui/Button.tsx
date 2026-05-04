import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';

import { AppColors } from '@/constants/theme';

type Variant = 'primary' | 'secondary' | 'ghost' | 'destructive';
type Size = 'default' | 'sm';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
}

const containerVariant: Record<Variant, object> = {
  primary:     { backgroundColor: AppColors.primary },
  secondary:   { backgroundColor: AppColors.card, borderWidth: 1, borderColor: AppColors.border },
  ghost:       { backgroundColor: 'transparent' },
  destructive: { backgroundColor: AppColors.error },
};

const labelVariant: Record<Variant, object> = {
  primary:     { color: AppColors.background },
  secondary:   { color: AppColors.textPrimary },
  ghost:       { color: AppColors.primary },
  destructive: { color: '#FFFFFF' },
};

export function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'default',
  loading = false,
  disabled = false,
  fullWidth = false,
}: ButtonProps) {
  return (
    <Pressable
      style={[
        styles.base,
        containerVariant[variant],
        size === 'sm' && styles.sm,
        fullWidth && styles.fullWidth,
        (disabled || loading) && styles.disabled,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'primary' ? AppColors.background : AppColors.primary}
        />
      ) : (
        <Text style={[styles.label, labelVariant[variant], size === 'sm' && styles.labelSm]}>
          {label}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 10,
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sm: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  fullWidth: {
    alignSelf: 'stretch',
  },
  disabled: {
    opacity: 0.5,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
  },
  labelSm: {
    fontSize: 13,
  },
});
