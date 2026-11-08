import React from 'react';
import {StyleSheet, View} from 'react-native';

import {colors} from '../../../theme/colors';

interface ProgressBarProps {
  progress: number;
}

function ProgressBar({progress}: ProgressBarProps): React.JSX.Element {
  const clampedProgress = Math.max(0, Math.min(progress, 1));

  return (
    <View style={styles.track}>
      <View style={[styles.fill, {width: `${clampedProgress * 100}%`}]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 8,
    borderRadius: 999,
    backgroundColor: colors.progressTrack,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: colors.progressFill,
  },
});

export default ProgressBar;
