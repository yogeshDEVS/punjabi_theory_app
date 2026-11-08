import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {MaterialIcons} from '@react-native-vector-icons/material-icons';

import {homePalette} from '../../features/home/theme';

function UnlockButton(): React.JSX.Element {
  return (
    <Pressable style={styles.unlockButton}>
      <View style={styles.unlockIconWrap}>
        <MaterialIcons name="lock-outline" size={24} color={homePalette.white} />
      </View>
      <Text style={styles.unlockText}>Unlock all questions</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  unlockButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: homePalette.navy,
    borderRadius: 28,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  unlockIconWrap: {
    marginRight: 10,
  },
  unlockText: {
    color: homePalette.white,
    fontSize: 16,
    fontWeight: '800',
  },
});

export default UnlockButton;
