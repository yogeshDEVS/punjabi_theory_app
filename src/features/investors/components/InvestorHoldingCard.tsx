import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

import DashboardCard from '../../commissionDashboard/components/DashboardCard';
import type {InvestorHolding} from '../types';
import {colors} from '../../../theme/colors';

interface InvestorHoldingCardProps {
  holding: InvestorHolding;
}

function tagStyles(tag: InvestorHolding['tag']) {
  if (tag === 'SIP') {
    return {
      backgroundColor: '#1A3C73',
      borderColor: '#315AA1',
      textColor: '#9EC1FF',
    };
  }

  if (tag === 'PENDING') {
    return {
      backgroundColor: colors.statusDormantBackground,
      borderColor: colors.statusDormantBorder,
      textColor: colors.statusDormantText,
    };
  }

  return {
    backgroundColor: colors.statusPendingBackground,
    borderColor: colors.statusPendingBorder,
    textColor: colors.statusPendingText,
  };
}

function InvestorHoldingCard({
  holding,
}: InvestorHoldingCardProps): React.JSX.Element {
  const tagStyle = tagStyles(holding.tag);

  return (
    <DashboardCard style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.headerCopy}>
          <Text style={styles.title}>{holding.title}</Text>
          <Text style={styles.subtitle}>{holding.subtitle}</Text>
        </View>
        <View
          style={[
            styles.tag,
            {
              backgroundColor: tagStyle.backgroundColor,
              borderColor: tagStyle.borderColor,
            },
          ]}>
          <Text style={[styles.tagText, {color: tagStyle.textColor}]}>{holding.tag}</Text>
        </View>
      </View>

      <View style={styles.metricsRow}>
        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>{holding.primaryLabel}</Text>
          <Text style={styles.metricValue}>{holding.primaryValue}</Text>
        </View>
        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>{holding.secondaryLabel}</Text>
          <Text style={[styles.metricValue, styles.highlightValue]}>
            {holding.secondaryValue}
          </Text>
        </View>
        <View style={[styles.metricItem, styles.metricItemEnd]}>
          <Text style={styles.metricLabel}>{holding.tertiaryLabel}</Text>
          <Text style={styles.metricValue}>{holding.tertiaryValue}</Text>
        </View>
      </View>
    </DashboardCard>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 10,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  headerCopy: {
    flex: 1,
    paddingRight: 10,
  },
  title: {
    color: colors.primaryText,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  subtitle: {
    color: '#8B8D95',
    fontSize: 11,
  },
  tag: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
  tagText: {
    fontSize: 10,
    fontWeight: '600',
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metricItem: {
    flex: 1,
  },
  metricItemEnd: {
    alignItems: 'flex-end',
  },
  metricLabel: {
    color: '#8B8D95',
    fontSize: 10,
    marginBottom: 4,
  },
  metricValue: {
    color: colors.primaryText,
    fontSize: 15,
    fontWeight: '600',
  },
  highlightValue: {
    color: colors.greenText,
  },
});

export default InvestorHoldingCard;
