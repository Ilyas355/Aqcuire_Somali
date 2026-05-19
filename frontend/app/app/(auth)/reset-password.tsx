import { useRef, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { resetPassword } from '@/api/api';
import { AppColors } from '@/constants/theme';

export default function ResetPasswordScreen() {
  const router = useRouter();
  const { email } = useLocalSearchParams<{ email: string }>();

  const newPasswordRef = useRef<TextInput>(null);
  const confirmPasswordRef = useRef<TextInput>(null);

  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit() {
    if (!code.trim() || !newPassword || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setError(null);
    setIsSubmitting(true);
    try {
      await resetPassword({ email: email ?? '', code: code.trim(), new_password: newPassword });
      router.replace('/login');
    } catch (e: unknown) {
      const err = e as Record<string, unknown>;
      if (typeof err?.detail === 'string') {
        setError(err.detail);
      } else if (Array.isArray(err?.detail)) {
        setError((err.detail as string[]).join(' '));
      } else {
        setError('Something went wrong. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.header}>
        <Text style={styles.appName}>Aquire Somali</Text>
        <Text style={styles.tagline}>Reset your password</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>Enter your code</Text>
        <Text style={styles.subtitle}>
          We sent a 6-digit code to{' '}
          <Text style={styles.emailHighlight}>{email}</Text>. Enter it below along with your new password.
        </Text>

        {error && <Text style={styles.error}>{error}</Text>}

        <TextInput
          style={[styles.input, styles.codeInput]}
          placeholder="6-digit code"
          placeholderTextColor={AppColors.textSecondary}
          value={code}
          onChangeText={setCode}
          keyboardType="number-pad"
          maxLength={6}
          returnKeyType="next"
          onSubmitEditing={() => newPasswordRef.current?.focus()}
        />

        <TextInput
          ref={newPasswordRef}
          style={styles.input}
          placeholder="New password"
          placeholderTextColor={AppColors.textSecondary}
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry
          returnKeyType="next"
          onSubmitEditing={() => confirmPasswordRef.current?.focus()}
        />

        <TextInput
          ref={confirmPasswordRef}
          style={styles.input}
          placeholder="Confirm new password"
          placeholderTextColor={AppColors.textSecondary}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          returnKeyType="done"
          onSubmitEditing={handleSubmit}
        />

        <Pressable
          style={[styles.button, isSubmitting && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color={AppColors.background} />
          ) : (
            <Text style={styles.buttonText}>Reset password</Text>
          )}
        </Pressable>
      </View>

      <View style={styles.footer}>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.link}>Resend code</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.background,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  appName: {
    fontSize: 40,
    fontWeight: '700',
    color: AppColors.primary,
    letterSpacing: -1,
  },
  tagline: {
    fontSize: 16,
    color: AppColors.textSecondary,
    marginTop: 4,
  },
  card: {
    backgroundColor: AppColors.card,
    borderRadius: 16,
    padding: 24,
    gap: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: AppColors.textPrimary,
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 14,
    color: AppColors.textSecondary,
    lineHeight: 20,
  },
  emailHighlight: {
    color: AppColors.textPrimary,
    fontWeight: '500',
  },
  error: {
    color: AppColors.error,
    fontSize: 14,
  },
  input: {
    backgroundColor: AppColors.background,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: AppColors.textPrimary,
    borderWidth: 1,
    borderColor: AppColors.border,
  },
  codeInput: {
    letterSpacing: 6,
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
  },
  button: {
    backgroundColor: AppColors.primary,
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 4,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: AppColors.background,
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
    marginTop: 24,
  },
  link: {
    color: AppColors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
});
