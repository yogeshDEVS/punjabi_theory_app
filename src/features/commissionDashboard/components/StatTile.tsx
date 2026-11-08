import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

import {colors} from '../../../theme/colors';

interface StatTileProps {
  value: string;
  label: string;
  accent?: boolean;
}

function StatTile({value, label, accent = false}: StatTileProps): React.JSX.Element {
  return (
    <View style={styles.container}>
      <Text style={[styles.value, accent ? styles.accentValue : null]}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1F1F24',
    backgroundColor: colors.cardBackground,
    paddingVertical: 11,
    paddingHorizontal: 6,
    alignItems: 'center',
  },
  value: {
    color: '#F7F1E5',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  accentValue: {
    color: colors.positiveText,
  },
  label: {
    color: '#66676D',
    fontSize: 9,
    letterSpacing: 0.8,
  },
});

export default StatTile;
