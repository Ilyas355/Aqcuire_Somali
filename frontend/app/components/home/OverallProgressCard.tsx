import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

import { AppColors } from '@/constants/theme';

interface Props {
  percentage: number;
  totalSections: number;
  completedSections: number;
  subtopicsRemaining: number;
}

const RING = 80;
const SW = 6;
const R = (RING - SW) / 2;
const CIRC = 2 * Math.PI * R;

function SectionPips({ total, completed }: { total: number; completed: number }) {
  return (
    <View style={pip.row}>
      {Array.from({ length: total }).map((_, i) => (
        <View
          key={i}
          style={[
            pip.dot,
            i < completed ? pip.done : i === completed ? pip.active : pip.empty,
          ]}
        />
      ))}
    </View>
  );
}

const pip = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 5,
    flexWrap: 'wrap',
  },
  dot: {
    width: 10,
    height: 8,
    borderRadius: 4,
  },
  done: {
    backgroundColor: AppColors.primary,
  },
  active: {
    backgroundColor: AppColors.primaryMuted,
    borderWidth: 1,
    borderColor: AppColors.primary,
  },
  empty: {
    backgroundColor: AppColors.surface3,
  },
});

export function OverallProgressCard({ percentage, totalSections, completedSections, subtopicsRemaining }: Props) {
  const offset = CIRC * (1 - percentage / 100);
  const allDone = completedSections === totalSections && totalSections > 0;

  return (
    <LinearGradient
      colors={[AppColors.surface1, AppColors.surface0]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.card}
    >
      <View style={styles.ringWrap}>
        <Svg width={RING} height={RING}>
          <Circle
            cx={RING / 2}
            cy={RING / 2}
            r={R}
            stroke={AppColors.surface3}
            strokeWidth={SW}
            fill="none"
          />
          <Circle
            cx={RING / 2}
            cy={RING / 2}
            r={R}
            stroke={AppColors.primary}
            strokeWidth={SW}
            fill="none"
            strokeDasharray={`${CIRC} ${CIRC}`}
            strokeDashoffset={offset}
            strokeLinecap="round"
            transform={`rotate(-90 ${RING / 2} ${RING / 2})`}
          />
        </Svg>
        <View style={styles.ringCenter}>
          <Text style={styles.ringPct}>{percentage}%</Text>
          <Text style={styles.ringDone}>done</Text>
        </View>
      </View>

      <View style={styles.textWrap}>
        <Text style={styles.label}>COURSE PROGRESS</Text>
        <SectionPips total={totalSections} completed={completedSections} />
        <Text style={styles.sub}>
          {allDone
            ? `All ${totalSections} sections complete`
            : `Section ${completedSections + 1} of ${totalSections} · ${subtopicsRemaining} left`}
        </Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: AppColors.border,
    paddingHorizontal: 18,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,
  },
  ringWrap: {
    width: RING,
    height: RING,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringCenter: {
    position: 'absolute',
    alignItems: 'center',
  },
  ringPct: {
    fontSize: 14,
    fontWeight: '800',
    color: AppColors.textPrimary,
    letterSpacing: -0.3,
  },
  ringDone: {
    fontSize: 9,
    fontWeight: '600',
    color: AppColors.textTertiary,
    letterSpacing: 0.2,
  },
  textWrap: {
    flex: 1,
    gap: 8,
  },
  label: {
    fontSize: 9,
    fontWeight: '700',
    color: AppColors.textTertiary,
    letterSpacing: 1,
  },
  sub: {
    fontSize: 11,
    color: AppColors.textSecondary,
    lineHeight: 15,
  },
});
