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
import type { OwnPartnerProfile, UpdatePartnerProfileRequest } from '@/types/api';

interface Props {
  visible: boolean;
  current: OwnPartnerProfile | undefined;
  isSaving: boolean;
  onSave: (data: UpdatePartnerProfileRequest) => void;
  onClose: () => void;
}

export function PartnerProfileModal({ visible, current, isSaving, onSave, onClose }: Props) {
  const [bio, setBio] = useState('');
  const [availability, setAvailability] = useState('');
  const [preferredFormat, setPreferredFormat] = useState('');
  const [isHeritageSpeaker, setIsHeritageSpeaker] = useState(false);

  useEffect(() => {
    if (current) {
      setBio(current.bio);
      setAvailability(current.availability);
      setPreferredFormat(current.preferred_format);
      setIsHeritageSpeaker(current.is_heritage_speaker);
    }
  }, [current, visible]);

  const handleSave = () => {
    onSave({
      bio,
      availability,
      preferred_format: preferredFormat,
      is_heritage_speaker: isHeritageSpeaker,
    });
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.header}>
          <Pressable onPress={onClose} style={styles.closeBtn}>
            <Text style={styles.closeText}>Cancel</Text>
          </Pressable>
          <Text style={styles.title}>Partner Profile</Text>
          <Pressable onPress={handleSave} style={styles.saveBtn} disabled={isSaving}>
            {isSaving ? (
              <ActivityIndicator color={AppColors.primary} size="small" />
            ) : (
              <Text style={styles.saveText}>Save</Text>
            )}
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">
          <Text style={styles.groupLabel}>BIO</Text>
          <TextInput
            style={[styles.input, styles.bioInput]}
            value={bio}
            onChangeText={setBio}
            placeholder="Tell partners about yourself..."
            placeholderTextColor={AppColors.textSecondary}
            multiline
            maxLength={300}
          />

          <Text style={styles.groupLabel}>AVAILABILITY</Text>
          <TextInput
            style={styles.input}
            value={availability}
            onChangeText={setAvailability}
            placeholder="e.g. Weekends, Evenings"
            placeholderTextColor={AppColors.textSecondary}
          />

          <Text style={styles.groupLabel}>PREFERRED FORMAT</Text>
          <TextInput
            style={styles.input}
            value={preferredFormat}
            onChangeText={setPreferredFormat}
            placeholder="e.g. Video call, Text chat"
            placeholderTextColor={AppColors.textSecondary}
          />

          <View style={styles.toggleRow}>
            <View style={styles.toggleText}>
              <Text style={styles.toggleLabel}>Heritage Speaker</Text>
              <Text style={styles.toggleDesc}>You grew up speaking Somali at home</Text>
            </View>
            <Switch
              value={isHeritageSpeaker}
              onValueChange={setIsHeritageSpeaker}
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
  closeBtn: {
    minWidth: 60,
  },
  closeText: {
    fontSize: 15,
    color: AppColors.textSecondary,
  },
  saveBtn: {
    minWidth: 60,
    alignItems: 'flex-end',
  },
  saveText: {
    fontSize: 15,
    fontWeight: '600',
    color: AppColors.primary,
  },
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
  bioInput: {
    minHeight: 90,
    textAlignVertical: 'top',
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
  toggleText: {
    flex: 1,
    gap: 2,
  },
  toggleLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: AppColors.textPrimary,
  },
  toggleDesc: {
    fontSize: 12,
    color: AppColors.textSecondary,
  },
});
