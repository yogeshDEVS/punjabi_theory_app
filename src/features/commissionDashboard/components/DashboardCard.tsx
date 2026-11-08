import React from 'react';
import {
  StyleSheet,
  View,
  type StyleProp,
  type ViewProps,
  type ViewStyle,
} from 'react-native';

import {colors} from '../../../theme/colors';

interface DashboardCardProps extends ViewProps {
  children: React.ReactNode;
  highlight?: boolean;
  style?: StyleProp<ViewStyle>;
}

function DashboardCard({
  children,
  highlight = false,
  style,
  ...viewProps
}: DashboardCardProps): React.JSX.Element {
  return (
    <View
      style={[
        styles.card,
        highlight ? styles.highlightCard : styles.defaultCard,
        style,
      ]}
      {...viewProps}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    borderWidth: 1,
    paddingHorizontal: 18,
    paddingVertical: 16,
  },
  defaultCard: {
    backgroundColor: colors.cardBackground,
    borderColor: colors.neutralBorder,
  },
  highlightCard: {
    backgroundColor: colors.cardBackgroundSoft,
    borderColor: colors.goldBorder,
    borderRadius: 22,
    shadowColor: '#000000',
    shadowOpacity: 0.28,
    shadowRadius: 18,
    shadowOffset: {width: 0, height: 8},
    elevation: 6,
  },
});

export default DashboardCard;
