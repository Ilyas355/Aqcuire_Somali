import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AppColors } from '@/constants/theme';

type Language = 'somali' | 'english';

interface Props {
  selected: Language;
  onChange: (lang: Language) => void;
}

export function TranscriptToggle({ selected, onChange }: Props) {
  return (
    <View style={styles.container}>
      <Pressable
        style={[styles.btn, selected === 'somali' && styles.btnActive]}
        onPress={() => onChange('somali')}
      >
        <Text style={[styles.btnText, selected === 'somali' && styles.btnTextActive]}>
          as Somali
        </Text>
      </Pressable>
      <Pressable
        style={[styles.btn, selected === 'english' && styles.btnActive]}
        onPress={() => onChange('english')}
      >
        <Text style={[styles.btnText, selected === 'english' && styles.btnTextActive]}>
          as English
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: AppColors.card,
    borderRadius: 24,
    padding: 4,
    borderWidth: 1,
    borderColor: AppColors.border,
    alignSelf: 'center',
  },
  btn: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  btnActive: {
    backgroundColor: AppColors.primary,
  },
  btnText: {
    fontSize: 13,
    fontWeight: '600',
    color: AppColors.textSecondary,
  },
  btnTextActive: {
    color: AppColors.background,
  },
});
