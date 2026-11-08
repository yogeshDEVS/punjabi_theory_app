import React from 'react';
import {Pressable, StyleSheet, Text} from 'react-native';

import {colors} from '../../../theme/colors';
import type {InvestorFilter} from '../types';

interface FilterChipProps {
  filter: InvestorFilter;
  onPress?: (id: InvestorFilter['id']) => void;
}

function FilterChip({filter, onPress}: FilterChipProps): React.JSX.Element {
  return (
    <Pressable
      onPress={() => onPress?.(filter.id)}
      style={[styles.container, filter.active ? styles.activeContainer : null]}>
      <Text style={[styles.label, filter.active ? styles.activeLabel : null]}>
        {filter.label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: '#313239',
    backgroundColor: '#18191D',
  },
  activeContainer: {
    borderColor: '#8D6B23',
    backgroundColor: '#393015',
  },
  label: {
    color: '#A6A7AD',
    fontSize: 12,
    fontWeight: '500',
  },
  activeLabel: {
    color: colors.primaryText,
  },
});

export default FilterChip;
