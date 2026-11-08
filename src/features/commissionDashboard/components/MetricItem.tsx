import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from 'react-native';

import {colors} from '../../../theme/colors';

interface MetricItemProps {
  label: string;
  value: string;
  subValue: string;
  valueStyle?: StyleProp<TextStyle>;
  subValueStyle?: StyleProp<TextStyle>;
  containerStyle?: StyleProp<ViewStyle>;
}

function MetricItem({
  label,
  value,
  subValue,
  valueStyle,
  subValueStyle,
  containerStyle,
}: MetricItemProps): React.JSX.Element {
  return (
    <View style={containerStyle}>
      <Text style={styles.label}>{label}</Text>
      <Text style={[styles.value, valueStyle]}>{value}</Text>
      <Text style={[styles.subValue, subValueStyle]}>{subValue}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    color: colors.mutedText,
    fontSize: 10,
    letterSpacing: 0.7,
    marginBottom: 4,
  },
  value: {
    color: colors.greenText,
    fontSize: 31,
    fontWeight: '700',
    lineHeight: 34,
  },
  subValue: {
    color: colors.greenSubText,
    fontSize: 13,
    fontWeight: '600',
    marginTop: 1,
  },
});

export default MetricItem;
