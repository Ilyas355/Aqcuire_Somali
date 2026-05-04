import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

import { Card } from '@/components/ui/Card';
import { AppColors } from '@/constants/theme';

interface Props {
  percentage: number;
  totalSections: number;
}

function RingIndicator({ percentage }: { percentage: number }) {
  const size = 64;
  const strokeWidth = 5;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (Math.min(100, Math.max(0, percentage)) / 100) * circumference;

  return (
    <View style={styles.ringContainer}>
      <Svg width={size} height={size} style={StyleSheet.absoluteFill}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={AppColors.border}
          strokeWidth={strokeWidth}
          fill="none"
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={AppColors.primary}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          rotation="-90"
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>
      <Text style={styles.ringText}>{percentage}%</Text>
    </View>
  );
}

export function OverallProgressCard({ percentage, totalSections }: Props) {
  return (
    <Card>
      <View style={styles.row}>
        <RingIndicator percentage={percentage} />
        <View style={styles.textGroup}>
          <Text style={styles.label}>Overall progress</Text>
          <Text style={styles.sub}>
            {totalSections} {totalSections === 1 ? 'section' : 'sections'} total
          </Text>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  ringContainer: {
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringText: {
    color: AppColors.textPrimary,
    fontWeight: '700',
    fontSize: 15,
  },
  textGroup: {
    flex: 1,
    gap: 4,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: AppColors.textPrimary,
  },
  sub: {
    fontSize: 13,
    color: AppColors.textSecondary,
  },
});
