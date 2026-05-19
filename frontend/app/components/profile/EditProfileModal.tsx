import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';

import { AppColors } from '@/constants/theme';
import type { Profile, UpdateProfileRequest } from '@/types/api';

interface Props {
  visible: boolean;
  profile: Profile;
  isSaving: boolean;
  onSave: (data: UpdateProfileRequest) => void;
  onClose: () => void;
}

export function EditProfileModal({ visible, profile, isSaving, onSave, onClose }: Props) {
  const [handle, setHandle] = useState('');
  const [location, setLocation] = useState('');
  const [isDiaspora, setIsDiaspora] = useState(false);

  useEffect(() => {
    if (visible) {
      setHandle(profile.handle ?? '');
      setLocation(profile.location ?? '');
      setIsDiaspora(profile.is_diaspora ?? false);
    }
  }, [visible, profile]);

  const handleSave = () => {
    onSave({ handle, location, is_diaspora: isDiaspora });
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.header}>
          <Pressable onPress={onClose} style={styles.sideBtn}>
            <Text style={styles.cancelText}>Cancel</Text>
          </Pressable>
          <Text style={styles.title}>Edit Profile</Text>
          <Pressable onPress={handleSave} style={styles.sideBtn} disabled={isSaving}>
            {isSaving ? (
              <ActivityIndicator color={AppColors.primary} size="small" />
            ) : (
              <Text style={styles.saveText}>Save</Text>
            )}
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">
          <Text style={styles.groupLabel}>HANDLE</Text>
          <TextInput
            style={styles.input}
            value={handle}
            onChangeText={setHandle}
            placeholder="@yourhandle"
            placeholderTextColor={AppColors.textSecondary}
            autoCapitalize="none"
          />

          <Text style={styles.groupLabel}>LOCATION</Text>
          <TextInput
            style={styles.input}
            value={location}
            onChangeText={setLocation}
            placeholder="e.g. London, UK"
            placeholderTextColor={AppColors.textSecondary}
          />

          <View style={styles.toggleRow}>
            <View style={styles.toggleText}>
              <Text style={styles.toggleLabel}>Somali Diaspora</Text>
              <Text style={styles.toggleDesc}>You are part of the Somali diaspora</Text>
            </View>
            <Switch
              value={isDiaspora}
              onValueChange={setIsDiaspora}
              trackColor={{ false: AppColors.border, true: AppColors.primary }}
              thumbColor={AppColors.textPrimary}
              ios_backgroundColor={AppColors.border}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: AppColors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.border,
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    color: AppColors.textPrimary,
  },
  sideBtn: { minWidth: 60 },
  cancelText: { fontSize: 15, color: AppColors.textSecondary },
  saveText: { fontSize: 15, fontWeight: '600', color: AppColors.primary, textAlign: 'right' },
  body: {
    padding: 20,
    gap: 8,
  },
  groupLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: AppColors.textSecondary,
    letterSpacing: 0.8,
    marginTop: 12,
    marginBottom: 4,
  },
  input: {
    backgroundColor: AppColors.card,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: AppColors.border,
    paddingVertical: 12,
    paddingHorizontal: 14,
    fontSize: 14,
    color: AppColors.textPrimary,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppColors.card,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: AppColors.border,
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginTop: 12,
    gap: 12,
  },
  toggleText: { flex: 1, gap: 2 },
  toggleLabel: { fontSize: 14, fontWeight: '500', color: AppColors.textPrimary },
  toggleDesc: { fontSize: 12, color: AppColors.textSecondary },
});
