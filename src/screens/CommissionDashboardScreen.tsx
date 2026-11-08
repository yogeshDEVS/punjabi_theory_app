import React from 'react';
import {SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, View} from 'react-native';

import ActionIconButton from '../features/commissionDashboard/components/ActionIconButton';
import BottomTabBar from '../features/commissionDashboard/components/BottomTabBar';
import DashboardCard from '../features/commissionDashboard/components/DashboardCard';
import MetricItem from '../features/commissionDashboard/components/MetricItem';
import MilestoneChip from '../features/commissionDashboard/components/MilestoneChip';
import ProgressBar from '../features/commissionDashboard/components/ProgressBar';
import QuickActionTile from '../features/commissionDashboard/components/QuickActionTile';
import StatTile from '../features/commissionDashboard/components/StatTile';
import {dashboardData} from '../features/commissionDashboard/dashboardData';
import type {AppTab} from '../features/commissionDashboard/types';
import {buildBottomTabs} from '../navigation/tabs';
import {colors, spacing} from '../theme/colors';

interface CommissionDashboardScreenProps {
  activeTab: AppTab;
  onTabPress: (tab: AppTab) => void;
}

function CommissionDashboardScreen({
  activeTab,
  onTabPress,
}: CommissionDashboardScreenProps): React.JSX.Element {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={colors.appBackground} />

      <View style={styles.screenLayout}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          <View style={styles.screenShell}>
            <View style={styles.headerRow}>
              <ActionIconButton icon="profile" />

              <View style={styles.headerTextGroup}>
                <Text style={styles.greeting}>{dashboardData.greeting}</Text>
                <Text style={styles.handle}>{dashboardData.handle}</Text>
              </View>

              <ActionIconButton icon="bell" />
            </View>

            <DashboardCard highlight style={styles.heroCard}>
              <Text style={styles.cardTitle}>COMMISSION BALANCE</Text>
              <Text style={styles.heroAmount}>{dashboardData.commissionBalance}</Text>
              <Text style={styles.heroSubAmount}>
                {dashboardData.commissionBalanceSubValue}
              </Text>

              <View style={styles.summaryRow}>
                {dashboardData.summaryMetrics.map(metric => (
                  <MetricItem
                    key={metric.id}
                    label={metric.label}
                    value={metric.value}
                    subValue={metric.subValue}
                    containerStyle={styles.summaryItem}
                  />
                ))}
              </View>
            </DashboardCard>

            <DashboardCard style={styles.sectionCard}>
              <Text style={styles.cardTitle}>LIFETIME EARNINGS</Text>
              <Text style={styles.sectionAmount}>{dashboardData.lifetimeEarnings}</Text>
              <Text style={styles.heroSubAmount}>
                {dashboardData.lifetimeEarningsSubValue}
              </Text>

              <View style={styles.earningsRow}>
                {dashboardData.earningsMetrics.map(metric => (
                  <MetricItem
                    key={metric.id}
                    label={metric.label}
                    value={metric.value}
                    subValue={metric.subValue}
                    containerStyle={styles.earningsItem}
                    valueStyle={styles.earningsValue}
                  />
                ))}
              </View>
            </DashboardCard>

            <View style={styles.statsRow}>
              {dashboardData.stats.map(stat => (
                <StatTile
                  key={stat.id}
                  value={stat.value}
                  label={stat.label}
                  accent={stat.accent}
                />
              ))}
            </View>

            <Text style={styles.sectionLabel}>TARGET MILESTONES</Text>

            <DashboardCard style={styles.sectionCard}>
              <View style={styles.milestoneHeader}>
                <Text style={styles.milestoneTitle}>This Month&apos;s Commission</Text>
                <Text style={styles.milestoneAmount}>{dashboardData.commissionTarget}</Text>
              </View>

              <ProgressBar progress={dashboardData.progress} />

              <View style={styles.progressLabels}>
                <Text style={styles.progressEdge}>{'\u20B9'}0</Text>
                <Text style={styles.progressCenter}>{dashboardData.progressLabel}</Text>
                <Text style={styles.progressEdge}>{'\u20B9'}2L</Text>
              </View>

              <View style={styles.pillRow}>
                {dashboardData.milestones.map(milestone => (
                  <MilestoneChip
                    key={milestone.id}
                    amount={milestone.amount}
                    active={milestone.active}
                  />
                ))}
              </View>
            </DashboardCard>

            <Text style={styles.sectionLabel}>QUICK ACTIONS</Text>

            <DashboardCard style={styles.quickActionsCard}>
              <View style={styles.quickActionsGrid}>
                {dashboardData.quickActions.map(action => (
                  <QuickActionTile
                    key={action.id}
                    title={action.title}
                    subtitle={action.subtitle}
                    icon={action.icon}
                  />
                ))}
              </View>
            </DashboardCard>
          </View>
        </ScrollView>

        <BottomTabBar tabs={buildBottomTabs(activeTab)} onTabPress={onTabPress} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.appBackground,
  },
  screenLayout: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.screenHorizontal,
    paddingTop: spacing.screenTopInset,
    paddingBottom: spacing.screenBottomInset,
  },
  screenShell: {
    width: '100%',
    maxWidth: 398,
    alignSelf: 'center',
    backgroundColor: colors.screenShell,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: colors.shellBorder,
    paddingHorizontal: spacing.shellHorizontal,
    paddingTop: spacing.shellTop,
    paddingBottom: spacing.shellBottom,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  headerTextGroup: {
    flex: 1,
    marginHorizontal: 10,
  },
  greeting: {
    color: '#F8F5EE',
    fontSize: 23,
    fontWeight: '700',
    lineHeight: 28,
  },
  handle: {
    color: '#D9A22A',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 1,
  },
  heroCard: {
    marginBottom: spacing.sectionGap,
    paddingTop: 20,
    paddingBottom: 18,
  },
  sectionCard: {
    marginBottom: spacing.sectionGap,
  },
  quickActionsCard: {
    marginBottom: 0,
    paddingHorizontal: 8,
    paddingTop: 8,
    paddingBottom: 8,
  },
  cardTitle: {
    color: '#67676D',
    fontSize: 11,
    textAlign: 'center',
    letterSpacing: 1,
    marginBottom: 8,
  },
  heroAmount: {
    color: colors.goldText,
    textAlign: 'center',
    fontSize: 52,
    fontWeight: '700',
    lineHeight: 58,
  },
  sectionAmount: {
    color: colors.goldText,
    textAlign: 'center',
    fontSize: 43,
    fontWeight: '700',
    lineHeight: 48,
  },
  heroSubAmount: {
    color: '#B6B1AB',
    textAlign: 'center',
    fontSize: 17,
    marginTop: 3,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 18,
    gap: 10,
  },
  summaryItem: {
    flex: 1,
  },
  earningsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    gap: 10,
  },
  earningsItem: {
    flex: 1,
  },
  earningsValue: {
    color: colors.primaryText,
    fontSize: 21,
    fontWeight: '600',
    lineHeight: 26,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 14,
  },
  sectionLabel: {
    color: '#A7A8AD',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  milestoneHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  milestoneTitle: {
    color: '#F1EFEB',
    fontSize: 14,
    fontWeight: '600',
  },
  milestoneAmount: {
    color: colors.goldText,
    fontSize: 16,
    fontWeight: '700',
  },
  progressLabels: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
    marginBottom: 14,
  },
  progressEdge: {
    color: '#6A6B72',
    fontSize: 10,
  },
  progressCenter: {
    flex: 1,
    color: colors.secondaryMutedText,
    fontSize: 10,
    textAlign: 'center',
    marginHorizontal: 8,
  },
  pillRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 6,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 8,
  },
});

export default CommissionDashboardScreen;
