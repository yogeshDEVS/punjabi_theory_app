import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';

import {colors} from '../../../theme/colors';

interface InvestorActionButtonProps {
  label: string;
  icon: 'call' | 'message';
}

function InvestorActionGlyph({
  icon,
}: {
  icon: InvestorActionButtonProps['icon'];
}): React.JSX.Element {
  if (icon === 'call') {
    return (
      <View style={styles.callGlyph}>
        <View style={styles.callHandle} />
      </View>
    );
  }

  return (
    <View style={styles.messageGlyph}>
      <View style={styles.messageBubble} />
      <View style={styles.messageTail} />
    </View>
  );
}

function InvestorActionButton({
  label,
  icon,
}: InvestorActionButtonProps): React.JSX.Element {
  return (
    <Pressable style={styles.container}>
      <InvestorActionGlyph icon={icon} />
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 42,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.actionButtonBorder,
    backgroundColor: colors.actionButtonBackground,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    color: colors.goldText,
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 8,
  },
  callGlyph: {
    width: 12,
    height: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  callHandle: {
    width: 9,
    height: 5,
    borderWidth: 1.4,
    borderColor: colors.goldText,
    borderRadius: 3,
    transform: [{rotate: '35deg'}],
  },
  messageGlyph: {
    width: 12,
    height: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  messageBubble: {
    width: 9,
    height: 7,
    borderWidth: 1.3,
    borderColor: colors.goldText,
    borderRadius: 4,
  },
  messageTail: {
    position: 'absolute',
    left: 2,
    bottom: 1,
    width: 4,
    height: 1.3,
    backgroundColor: colors.goldText,
    transform: [{rotate: '-35deg'}],
  },
});

export default InvestorActionButton;
