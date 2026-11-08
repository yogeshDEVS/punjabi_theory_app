import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

import {colors} from '../../../theme/colors';

interface MilestoneChipProps {
  amount: string;
  active?: boolean;
}

function MilestoneChip({
  amount,
  active = false,
}: MilestoneChipProps): React.JSX.Element {
  return (
    <View style={[styles.container, active ? styles.activeContainer : null]}>
      <View style={[styles.dot, active ? styles.activeDot : null]} />
      <Text style={[styles.text, active ? styles.activeText : null]}>{amount}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minWidth: 0,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: colors.pillBorder,
    backgroundColor: '#17171A',
    paddingVertical: 7,
    paddingHorizontal: 4,
    alignItems: 'center',
  },
  activeContainer: {
    borderColor: colors.pillActiveBorder,
    backgroundColor: colors.pillActiveBackground,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#70727A',
    marginBottom: 4,
  },
  activeDot: {
    backgroundColor: colors.progressFill,
  },
  text: {
    color: '#A6A7AD',
    fontSize: 11,
    fontWeight: '600',
  },
  activeText: {
    color: '#F6E2A6',
  },
});

export default MilestoneChip;
