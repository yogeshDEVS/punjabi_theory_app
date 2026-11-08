import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

import {colors} from '../../../theme/colors';

interface SearchInputShellProps {
  placeholder: string;
}

function SearchInputShell({placeholder}: SearchInputShellProps): React.JSX.Element {
  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        <View style={styles.iconRing} />
        <View style={styles.iconHandle} />
      </View>
      <Text style={styles.placeholder}>{placeholder}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 38,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.searchBorder,
    backgroundColor: colors.searchBackground,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
  },
  iconCircle: {
    width: 16,
    height: 16,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconRing: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
    borderWidth: 1.3,
    borderColor: '#6F717C',
  },
  iconHandle: {
    position: 'absolute',
    right: 1,
    bottom: 1,
    width: 5,
    height: 1.3,
    backgroundColor: '#6F717C',
    transform: [{rotate: '45deg'}],
  },
  placeholder: {
    color: '#6F717C',
    fontSize: 13,
  },
});

export default SearchInputShell;
