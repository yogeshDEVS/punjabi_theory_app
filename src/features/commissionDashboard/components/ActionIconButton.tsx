import React from 'react';
import {Pressable, StyleSheet, View} from 'react-native';

import {colors} from '../../../theme/colors';

interface ActionIconButtonProps {
  icon: 'profile' | 'bell' | 'back';
  onPress?: () => void;
}

function ActionIconButton({icon, onPress}: ActionIconButtonProps): React.JSX.Element {
  return (
    <Pressable onPress={onPress} style={styles.button}>
      {icon === 'profile' ? (
        <View style={styles.profileIcon}>
          <View style={styles.profileHead} />
          <View style={styles.profileBody} />
        </View>
      ) : icon === 'back' ? (
        <View style={styles.backIcon}>
          <View style={styles.backShaft} />
          <View style={styles.backHeadTop} />
          <View style={styles.backHeadBottom} />
        </View>
      ) : (
        <View style={styles.bellIcon}>
          <View style={styles.bellTop} />
          <View style={styles.bellClapper} />
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: colors.buttonBorder,
    backgroundColor: colors.buttonBackground,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileIcon: {
    width: 16,
    height: 16,
    alignItems: 'center',
  },
  profileHead: {
    width: 6,
    height: 6,
    borderRadius: 3,
    borderWidth: 1.3,
    borderColor: colors.iconGold,
    marginBottom: 1,
  },
  profileBody: {
    width: 11,
    height: 6,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    borderWidth: 1.3,
    borderBottomWidth: 0,
    borderColor: colors.iconGold,
  },
  bellIcon: {
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bellTop: {
    width: 11,
    height: 10,
    borderWidth: 1.3,
    borderBottomWidth: 0,
    borderColor: colors.iconGold,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
  },
  bellClapper: {
    position: 'absolute',
    bottom: 2,
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: colors.iconGold,
  },
  backIcon: {
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backShaft: {
    width: 8,
    height: 1.4,
    backgroundColor: colors.iconGold,
  },
  backHeadTop: {
    position: 'absolute',
    left: 3,
    top: 5,
    width: 5,
    height: 1.4,
    backgroundColor: colors.iconGold,
    transform: [{rotate: '-45deg'}],
  },
  backHeadBottom: {
    position: 'absolute',
    left: 3,
    bottom: 5,
    width: 5,
    height: 1.4,
    backgroundColor: colors.iconGold,
    transform: [{rotate: '45deg'}],
  },
});

export default ActionIconButton;
