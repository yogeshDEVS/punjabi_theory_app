import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';

import DashboardCard from '../../commissionDashboard/components/DashboardCard';
import type {InvestorItem} from '../types';
import {colors} from '../../../theme/colors';

interface InvestorCardProps {
  investor: InvestorItem;
  onPress?: (investorId: InvestorItem['id']) => void;
}

function InvestorStatusPill({status}: {status: InvestorItem['status']}): React.JSX.Element {
  const isActive = status === 'Active';
  const isDormant = status === 'Dormant';

  return (
    <View
      style={[
        styles.statusPill,
        isActive ? styles.statusPillActive : null,
        isDormant ? styles.statusPillDormant : null,
        status === 'KYC Pending' ? styles.statusPillPending : null,
      ]}>
      <Text
        style={[
          styles.statusText,
          isActive ? styles.statusTextActive : null,
          isDormant ? styles.statusTextDormant : null,
          status === 'KYC Pending' ? styles.statusTextPending : null,
        ]}>
        {status}
      </Text>
    </View>
  );
}

function InvestorCard({investor, onPress}: InvestorCardProps): React.JSX.Element {
  return (
    <Pressable onPress={() => onPress?.(investor.id)}>
      <DashboardCard style={styles.card}>
        <View style={styles.headerRow}>
          <View style={styles.headerCopy}>
            <Text style={styles.name}>{investor.name}</Text>
            <Text style={styles.joinedOn}>{investor.joinedOn}</Text>
          </View>
          <InvestorStatusPill status={investor.status} />
        </View>

        <View style={styles.metricsRow}>
          <View style={styles.metricItem}>
            <Text style={styles.metricLabel}>Invested</Text>
            <Text style={styles.metricValue}>{investor.invested}</Text>
          </View>
          <View style={styles.metricItem}>
            <Text style={styles.metricLabel}>Current</Text>
            <Text style={[styles.metricValue, styles.currentValue]}>{investor.current}</Text>
          </View>
          <View style={[styles.metricItem, styles.metricItemEnd]}>
            <Text style={styles.metricLabel}>Return</Text>
            <Text
              style={[
                styles.metricValue,
                investor.returnValue === '0%' ? styles.neutralValue : styles.currentValue,
              ]}>
              {investor.returnValue}
            </Text>
          </View>
        </View>
      </DashboardCard>
    </Pressable>
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
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  headerCopy: {
    flex: 1,
    paddingRight: 10,
  },
  name: {
    color: colors.primaryText,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  joinedOn: {
    color: '#8B8D95',
    fontSize: 12,
  },
  statusPill: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  statusPillActive: {
    backgroundColor: colors.statusActiveBackground,
    borderColor: colors.statusActiveBorder,
  },
  statusPillDormant: {
    backgroundColor: colors.statusDormantBackground,
    borderColor: colors.statusDormantBorder,
  },
  statusPillPending: {
    backgroundColor: colors.statusPendingBackground,
    borderColor: colors.statusPendingBorder,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  statusTextActive: {
    color: colors.statusActiveText,
  },
  statusTextDormant: {
    color: colors.statusDormantText,
  },
  statusTextPending: {
    color: colors.statusPendingText,
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
    fontSize: 11,
    marginBottom: 4,
  },
  metricValue: {
    color: colors.primaryText,
    fontSize: 14,
    fontWeight: '600',
  },
  currentValue: {
    color: colors.greenText,
  },
  neutralValue: {
    color: '#A6A7AD',
  },
});

export default InvestorCard;
