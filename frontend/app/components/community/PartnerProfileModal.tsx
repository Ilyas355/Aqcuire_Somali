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

const CITY_OPTIONS = [
  'Atlanta',
  'Birmingham',
  'Bristol',
  'Calgary',
  'Columbus',
  'Copenhagen',
  'Dubai',
  'Leeds',
  'Leicester',
  'London',
  'Manchester',
  'Melbourne',
  'Minneapolis',
  'Mogadishu',
  'Nairobi',
  'New York',
  'Oslo',
  'Ottawa',
  'Seattle',
  'Sheffield',
  'Stockholm',
  'Sydney',
  'Toronto',
  'Washington DC',
] as const;

const AVAILABILITY_OPTIONS = [
  'Flexible',
  'Weekends',
  'Evenings',
  'Weekly',
  'Monthly',
] as const;

const BIO_OPTIONS = [
  'I\'m just starting out — I don\'t understand or speak Somali yet',
  'I can say a few words and phrases but don\'t understand much',
  'I can understand a little Somali but can\'t really speak it',
  'I can understand Somali but struggle to speak it',
  'I can speak some Somali but want to improve my fluency',
  'I grew up hearing Somali at home but never formally studied it',
  'I\'m comfortable speaking and understanding Somali',
  'I\'m a fluent speaker and want to help others learn',
] as const;

interface Props {
  visible: boolean;
  current: OwnPartnerProfile | undefined;
  isSaving: boolean;
  onSave: (data: UpdatePartnerProfileRequest) => void;
  onClose: () => void;
}

export function PartnerProfileModal({ visible, current, isSaving, onSave, onClose }: Props) {
  const [bio, setBio] = useState('');
  const [bioOpen, setBioOpen] = useState(false);
  const [availability, setAvailability] = useState('');
  const [availabilityOpen, setAvailabilityOpen] = useState(false);
  const [city, setCity] = useState('');
  const [cityOpen, setCityOpen] = useState(false);
  const [preferredFormat, setPreferredFormat] = useState('');
  const [isHeritageSpeaker, setIsHeritageSpeaker] = useState(false);

  useEffect(() => {
    if (current) {
      setBio(current.bio);
      setAvailability(current.availability);
      setCity(current.city);
      setPreferredFormat(current.preferred_format);
      setIsHeritageSpeaker(current.is_heritage_speaker);
    }
  }, [current, visible]);

  const handleSave = () => {
    onSave({
      bio,
      availability,
      city,
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
          <Text style={styles.groupLabel}>YOUR SOMALI LEVEL</Text>

          <Pressable
            style={[styles.dropdownTrigger, bioOpen && styles.dropdownTriggerOpen]}
            onPress={() => setBioOpen((o) => !o)}
          >
            <Text
              style={[styles.dropdownValue, !bio && styles.dropdownPlaceholder]}
              numberOfLines={2}
            >
              {bio || 'Select your Somali level...'}
            </Text>
            <Text style={styles.dropdownChevron}>{bioOpen ? '▴' : '▾'}</Text>
          </Pressable>

          {bioOpen && (
            <View style={styles.dropdownList}>
              {BIO_OPTIONS.map((option, i) => {
                const selected = bio === option;
                const isLast = i === BIO_OPTIONS.length - 1;
                return (
                  <Pressable
                    key={option}
                    style={[styles.dropdownRow, !isLast && styles.dropdownRowBorder]}
                    onPress={() => { setBio(option); setBioOpen(false); }}
                  >
                    <Text style={[styles.dropdownRowText, selected && styles.dropdownRowSelected]}>
                      {option}
                    </Text>
                    {selected && <Text style={styles.dropdownCheck}>✓</Text>}
                  </Pressable>
                );
              })}
            </View>
          )}

          <Text style={styles.groupLabel}>AVAILABILITY</Text>

          <Pressable
            style={[styles.dropdownTrigger, availabilityOpen && styles.dropdownTriggerOpen]}
            onPress={() => setAvailabilityOpen((o) => !o)}
          >
            <Text
              style={[styles.dropdownValue, !availability && styles.dropdownPlaceholder]}
              numberOfLines={1}
            >
              {availability || 'Select your availability...'}
            </Text>
            <Text style={styles.dropdownChevron}>{availabilityOpen ? '▴' : '▾'}</Text>
          </Pressable>

          {availabilityOpen && (
            <View style={styles.dropdownList}>
              {AVAILABILITY_OPTIONS.map((option, i) => {
                const selected = availability === option;
                const isLast = i === AVAILABILITY_OPTIONS.length - 1;
                return (
                  <Pressable
                    key={option}
                    style={[styles.dropdownRow, !isLast && styles.dropdownRowBorder]}
                    onPress={() => { setAvailability(option); setAvailabilityOpen(false); }}
                  >
                    <Text style={[styles.dropdownRowText, selected && styles.dropdownRowSelected]}>
                      {option}
                    </Text>
                    {selected && <Text style={styles.dropdownCheck}>✓</Text>}
                  </Pressable>
                );
              })}
            </View>
          )}

          <Text style={styles.groupLabel}>CITY</Text>

          <Pressable
            style={[styles.dropdownTrigger, cityOpen && styles.dropdownTriggerOpen]}
            onPress={() => setCityOpen((o) => !o)}
          >
            <Text
              style={[styles.dropdownValue, !city && styles.dropdownPlaceholder]}
              numberOfLines={1}
            >
              {city || 'Select your city...'}
            </Text>
            <Text style={styles.dropdownChevron}>{cityOpen ? '▴' : '▾'}</Text>
          </Pressable>

          {cityOpen && (
            <View style={styles.dropdownList}>
              {CITY_OPTIONS.map((option, i) => {
                const selected = city === option;
                const isLast = i === CITY_OPTIONS.length - 1;
                return (
                  <Pressable
                    key={option}
                    style={[styles.dropdownRow, !isLast && styles.dropdownRowBorder]}
                    onPress={() => { setCity(option); setCityOpen(false); }}
                  >
                    <Text style={[styles.dropdownRowText, selected && styles.dropdownRowSelected]}>
                      {option}
                    </Text>
                    {selected && <Text style={styles.dropdownCheck}>✓</Text>}
                  </Pressable>
                );
              })}
            </View>
          )}

          <Text style={styles.groupLabel}>DISCORD ACCOUNT</Text>
          <TextInput
            style={styles.input}
            value={preferredFormat}
            onChangeText={setPreferredFormat}
            placeholder="e.g. username or username#1234"
            placeholderTextColor={AppColors.textSecondary}
            autoCapitalize="none"
            autoCorrect={false}
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
    marginBottom: 2,
  },
  dropdownTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppColors.surface1,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: AppColors.border,
    paddingVertical: 14,
    paddingHorizontal: 14,
    gap: 10,
  },
  dropdownTriggerOpen: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderBottomColor: 'transparent',
  },
  dropdownValue: {
    flex: 1,
    fontSize: 14,
    color: AppColors.textPrimary,
    lineHeight: 20,
  },
  dropdownPlaceholder: {
    color: AppColors.textTertiary,
  },
  dropdownChevron: {
    fontSize: 12,
    color: AppColors.textSecondary,
  },
  dropdownList: {
    backgroundColor: AppColors.surface1,
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: AppColors.border,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    overflow: 'hidden',
  },
  dropdownRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 13,
    paddingHorizontal: 14,
    gap: 10,
  },
  dropdownRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: AppColors.border,
  },
  dropdownRowText: {
    flex: 1,
    fontSize: 14,
    color: AppColors.textSecondary,
    lineHeight: 20,
  },
  dropdownRowSelected: {
    color: AppColors.primary,
    fontWeight: '500',
  },
  dropdownCheck: {
    fontSize: 14,
    color: AppColors.primary,
    fontWeight: '700',
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
