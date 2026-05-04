import { useRef, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';

import { useAuth } from '@/context/AuthContext';
import { AppColors } from '@/constants/theme';

interface FieldErrors {
  username?: string;
  email?: string;
  handle?: string;
  password?: string;
  confirmPassword?: string;
  general?: string;
}

export default function RegisterScreen() {
  const { register } = useAuth();
  const router = useRouter();

  const emailRef = useRef<TextInput>(null);
  const handleRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const confirmRef = useRef<TextInput>(null);

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [handle, setHandle] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<FieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  function validate(): boolean {
    const next: FieldErrors = {};
    if (!username.trim()) next.username = 'Username is required.';
    if (!email.trim()) next.email = 'Email is required.';
    if (!handle.trim()) next.handle = 'Handle is required.';
    if (!password) {
      next.password = 'Password is required.';
    } else if (password.length < 8) {
      next.password = 'Password must be at least 8 characters.';
    } else if (password !== confirmPassword) {
      next.password = 'Passwords do not match.';
      next.confirmPassword = 'mismatch';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleRegister() {
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      await register({
        username: username.trim(),
        email: email.trim(),
        handle: handle.trim(),
        password,
      });
    } catch (e: unknown) {
      const raw = e as Record<string, unknown>;
      const next: FieldErrors = {};
      if (Array.isArray(raw.username)) next.username = (raw.username as string[])[0];
      if (Array.isArray(raw.email)) next.email = (raw.email as string[])[0];
      if (Array.isArray(raw.handle)) next.handle = (raw.handle as string[])[0];
      if (Array.isArray(raw.password)) next.password = (raw.password as string[])[0];
      if (Object.keys(next).length === 0) {
        next.general =
          typeof raw.detail === 'string' ? raw.detail : 'Registration failed. Please try again.';
      }
      setErrors(next);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.appName}>Aquire</Text>
          <Text style={styles.tagline}>Learn Somali</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.title}>Create account</Text>

          {errors.general && <Text style={styles.generalError}>{errors.general}</Text>}

          <View>
            <TextInput
              style={[styles.input, errors.username && styles.inputError]}
              placeholder="Username"
              placeholderTextColor={AppColors.textSecondary}
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="next"
              onSubmitEditing={() => emailRef.current?.focus()}
            />
            {errors.username && <Text style={styles.fieldError}>{errors.username}</Text>}
          </View>

          <View>
            <TextInput
              ref={emailRef}
              style={[styles.input, errors.email && styles.inputError]}
              placeholder="Email"
              placeholderTextColor={AppColors.textSecondary}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              returnKeyType="next"
              onSubmitEditing={() => handleRef.current?.focus()}
            />
            {errors.email && <Text style={styles.fieldError}>{errors.email}</Text>}
          </View>

          <View>
            <TextInput
              ref={handleRef}
              style={[styles.input, errors.handle && styles.inputError]}
              placeholder="Handle (e.g. ilyas)"
              placeholderTextColor={AppColors.textSecondary}
              value={handle}
              onChangeText={setHandle}
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="next"
              onSubmitEditing={() => passwordRef.current?.focus()}
            />
            {errors.handle && <Text style={styles.fieldError}>{errors.handle}</Text>}
          </View>

          <View>
            <TextInput
              ref={passwordRef}
              style={[styles.input, errors.password && styles.inputError]}
              placeholder="Password"
              placeholderTextColor={AppColors.textSecondary}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              returnKeyType="next"
              onSubmitEditing={() => confirmRef.current?.focus()}
            />
            {errors.password && <Text style={styles.fieldError}>{errors.password}</Text>}
          </View>

          <View>
            <TextInput
              ref={confirmRef}
              style={[styles.input, errors.confirmPassword && styles.inputError]}
              placeholder="Confirm password"
              placeholderTextColor={AppColors.textSecondary}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              returnKeyType="done"
              onSubmitEditing={handleRegister}
            />
          </View>

          <Pressable
            style={[styles.button, isSubmitting && styles.buttonDisabled]}
            onPress={handleRegister}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color={AppColors.background} />
            ) : (
              <Text style={styles.buttonText}>Create account</Text>
            )}
          </Pressable>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <Pressable onPress={() => router.back()}>
            <Text style={styles.link}>Log in</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.background,
  },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
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
    marginBottom: 4,
  },
  generalError: {
    color: AppColors.error,
    fontSize: 14,
  },
  fieldError: {
    color: AppColors.error,
    fontSize: 12,
    marginTop: 4,
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
  inputError: {
    borderColor: AppColors.error,
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
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  footerText: {
    color: AppColors.textSecondary,
    fontSize: 14,
  },
  link: {
    color: AppColors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
});
