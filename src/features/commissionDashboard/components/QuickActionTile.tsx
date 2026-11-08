import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

import type {QuickActionIcon} from '../types';
import {colors} from '../../../theme/colors';

interface QuickActionTileProps {
  title: string;
  subtitle: string;
  icon: QuickActionIcon;
}

function QuickActionGlyph({icon}: {icon: QuickActionIcon}): React.JSX.Element {
  switch (icon) {
    case 'withdraw':
      return (
        <View style={styles.homeGlyph}>
          <View style={styles.homeRoof} />
          <View style={styles.homeBody} />
        </View>
      );
    case 'share':
      return (
        <View style={styles.shareGlyph}>
          <View style={[styles.shareNode, styles.shareNodeTop]} />
          <View style={[styles.shareNode, styles.shareNodeLeft]} />
          <View style={[styles.shareNode, styles.shareNodeRight]} />
          <View style={[styles.shareLine, styles.shareLineLeft]} />
          <View style={[styles.shareLine, styles.shareLineRight]} />
        </View>
      );
    case 'transactions':
      return (
        <View style={styles.transactionsGlyph}>
          <View style={styles.transactionsSheet} />
          <View style={styles.transactionsLine} />
          <View style={[styles.transactionsLine, styles.transactionsLineOffset]} />
        </View>
      );
    case 'commissions':
      return (
        <View style={styles.chartGlyph}>
          <View style={[styles.chartBar, styles.chartBarOne]} />
          <View style={[styles.chartBar, styles.chartBarTwo]} />
          <View style={[styles.chartBar, styles.chartBarThree]} />
        </View>
      );
    case 'baskets':
      return (
        <View style={styles.basketGlyph}>
          <View style={styles.basketHandle} />
          <View style={styles.basketBody} />
        </View>
      );
    case 'calculator':
      return (
        <View style={styles.calculatorGlyph}>
          <View style={styles.calculatorScreen} />
          <View style={styles.calculatorGrid} />
        </View>
      );
  }
}

function QuickActionTile({
  title,
  subtitle,
  icon,
}: QuickActionTileProps): React.JSX.Element {
  return (
    <View style={styles.container}>
      <View style={styles.iconWrap}>
        <QuickActionGlyph icon={icon} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '31.8%',
    minHeight: 74,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.actionTileBorder,
    backgroundColor: colors.actionTileBackground,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  iconWrap: {
    width: 22,
    height: 22,
    borderRadius: 7,
    backgroundColor: colors.actionIconBackground,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  title: {
    color: colors.primaryText,
    fontSize: 10,
    fontWeight: '600',
    marginBottom: 2,
  },
  subtitle: {
    color: colors.actionSubtitle,
    fontSize: 7,
    textAlign: 'center',
  },
  homeGlyph: {
    width: 12,
    height: 12,
    alignItems: 'center',
  },
  homeRoof: {
    width: 7,
    height: 7,
    borderTopWidth: 1.2,
    borderLeftWidth: 1.2,
    borderColor: colors.iconGold,
    transform: [{rotate: '45deg'}],
    marginTop: 1,
  },
  homeBody: {
    position: 'absolute',
    bottom: 0,
    width: 9,
    height: 7,
    borderWidth: 1.2,
    borderTopWidth: 0,
    borderColor: colors.iconGold,
  },
  shareGlyph: {
    width: 14,
    height: 14,
  },
  shareNode: {
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.iconGold,
  },
  shareNodeTop: {
    top: 1,
    left: 5,
  },
  shareNodeLeft: {
    bottom: 1,
    left: 1,
  },
  shareNodeRight: {
    bottom: 1,
    right: 1,
  },
  shareLine: {
    position: 'absolute',
    width: 1.2,
    height: 8,
    backgroundColor: colors.iconGold,
    top: 3,
  },
  shareLineLeft: {
    left: 5,
    transform: [{rotate: '58deg'}],
  },
  shareLineRight: {
    right: 5,
    transform: [{rotate: '-58deg'}],
  },
  transactionsGlyph: {
    width: 12,
    height: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  transactionsSheet: {
    position: 'absolute',
    width: 10,
    height: 12,
    borderWidth: 1.2,
    borderColor: colors.iconGold,
    borderRadius: 2,
  },
  transactionsLine: {
    width: 5,
    height: 1.2,
    backgroundColor: colors.iconGold,
    marginTop: 2,
  },
  transactionsLineOffset: {
    marginTop: 1.6,
  },
  chartGlyph: {
    width: 13,
    height: 12,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  chartBar: {
    width: 2.2,
    backgroundColor: colors.iconGold,
    borderRadius: 1,
  },
  chartBarOne: {
    height: 5,
  },
  chartBarTwo: {
    height: 8,
  },
  chartBarThree: {
    height: 11,
  },
  basketGlyph: {
    width: 12,
    height: 12,
    alignItems: 'center',
  },
  basketHandle: {
    width: 7,
    height: 4,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    borderWidth: 1.2,
    borderBottomWidth: 0,
    borderColor: colors.iconGold,
  },
  basketBody: {
    width: 10,
    height: 7,
    borderWidth: 1.2,
    borderColor: colors.iconGold,
    borderRadius: 2,
    marginTop: 1,
  },
  calculatorGlyph: {
    width: 11,
    height: 13,
    borderWidth: 1.2,
    borderColor: colors.iconGold,
    borderRadius: 2,
    alignItems: 'center',
    paddingTop: 2,
  },
  calculatorScreen: {
    width: 6,
    height: 2,
    backgroundColor: colors.iconGold,
    borderRadius: 1,
    marginBottom: 2,
  },
  calculatorGrid: {
    width: 6,
    height: 5,
    borderWidth: 1,
    borderColor: colors.iconGold,
  },
});

export default QuickActionTile;
