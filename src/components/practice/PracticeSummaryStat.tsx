import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {MaterialIcons} from '@react-native-vector-icons/material-icons';

interface PracticeSummaryStatProps {
  value: number;
  label: string;
  showArrow?: boolean;
  circleColor?: string;
  onPress?: () => void;
}

function PracticeSummaryStat({
  value,
  label,
  showArrow = false,
  circleColor = '#BFDFFA',
  onPress,
}: PracticeSummaryStatProps): React.JSX.Element {
  return (
    <Pressable
      disabled={!onPress}
      onPress={onPress}
      style={({pressed}) => [
        styles.item,
        pressed && styles.itemPressed,
      ]}>
      <View style={[styles.circle, {backgroundColor: circleColor}]}>
        <Text style={styles.value}>{value}</Text>
      </View>
      <View style={styles.labelRow}>
        <Text style={styles.label}>{label}</Text>
        {showArrow ? (
          <View style={styles.arrowBadge}>
            <MaterialIcons name="chevron-right" size={13} color="#FFFFFF" />
          </View>
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  item: {
    alignItems: 'center',
    width: 76,
  },
  itemPressed: {
    opacity: 0.7,
    transform: [{scale: 0.96}],
  },
  circle: {
    width: 62,
    height: 62,
    borderRadius: 31,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    shadowColor: '#8EAFCA',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  value: {
    color: '#0E365E',
    fontSize: 24,
    fontWeight: '800',
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  label: {
    color: '#164E7C',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.3,
    textAlign: 'center',
  },
  arrowBadge: {
    width: 15,
    height: 15,
    borderRadius: 7.5,
    backgroundColor: '#1E9BF5',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default PracticeSummaryStat;
