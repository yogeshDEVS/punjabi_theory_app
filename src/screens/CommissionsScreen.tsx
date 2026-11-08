import React from 'react';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import ActionIconButton from '../features/commissionDashboard/components/ActionIconButton';
import BottomTabBar from '../features/commissionDashboard/components/BottomTabBar';
import DashboardCard from '../features/commissionDashboard/components/DashboardCard';
import MilestoneChip from '../features/commissionDashboard/components/MilestoneChip';
import ProgressBar from '../features/commissionDashboard/components/ProgressBar';
import type {AppTab} from '../features/commissionDashboard/types';
import {commissionsData} from '../features/commissions/commissionsData';
import {buildBottomTabs} from '../navigation/tabs';
import {colors, spacing} from '../theme/colors';

interface CommissionsScreenProps {
  activeTab: AppTab;
  onTabPress: (tab: AppTab) => void;
}

function CommissionsScreen({
  activeTab,
  onTabPress,
}: CommissionsScreenProps): React.JSX.Element {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={colors.appBackground} />

      <View style={styles.screenLayout}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          <View style={styles.screenShell}>
            <View style={styles.headerRow}>
              <ActionIconButton icon="back" onPress={() => onTabPress('home')} />
              <Text style={styles.headerTitle}>{commissionsData.title}</Text>
            </View>

            <View style={styles.headerDivider} />

            <DashboardCard style={styles.balanceCard}>
              <Text style={styles.cardEyebrow}>AVAILABLE BALANCE</Text>
              <Text style={styles.balanceValue}>{commissionsData.availableBalance}</Text>
              <Text style={styles.balanceSubValue}>
                {commissionsData.availableBalanceSubValue}
              </Text>

              <Pressable style={styles.withdrawButton}>
                <Text style={styles.withdrawButtonLabel}>Withdraw To Bank</Text>
              </Pressable>

              <Text style={styles.withdrawCaption}>Add to your Investor App</Text>
            </DashboardCard>

            <DashboardCard style={styles.dualMetricCard}>
              <View style={styles.dualMetricRow}>
                <View style={styles.dualMetricItem}>
                  <Text style={styles.metricLabel}>Total Earned (Lifetime)</Text>
                  <Text style={[styles.metricValue, styles.positiveValue]}>
                    {commissionsData.lifetimeEarned}
                  </Text>
                  <Text style={styles.metricSubValue}>
                    {commissionsData.lifetimeEarnedSubValue}
                  </Text>
                </View>

                <View style={[styles.dualMetricItem, styles.metricItemEnd]}>
                  <Text style={styles.metricLabel}>Withdrawn</Text>
                  <Text style={styles.metricValue}>{commissionsData.withdrawn}</Text>
                  <Text style={styles.metricSubValue}>{commissionsData.withdrawnSubValue}</Text>
                </View>
              </View>
            </DashboardCard>

            <Text style={styles.sectionLabel}>COMMISSION TIMELINE</Text>

            <DashboardCard style={styles.sectionCard}>
              {commissionsData.timeline.map((item, index) => (
                <View key={item.id} style={index === 0 ? null : styles.timelineItem}>
                  <View style={styles.timelineRow}>
                    <Text style={styles.timelineLabel}>{item.label}</Text>
                    <Text style={styles.timelineValue}>{item.value}</Text>
                  </View>
                </View>
              ))}
            </DashboardCard>

            <Text style={styles.sectionLabel}>BREAKDOWN</Text>

            <View style={styles.breakdownRow}>
              {commissionsData.breakdown.map(item => (
                <DashboardCard key={item.id} style={styles.breakdownCard}>
                  <Text style={styles.metricLabel}>{item.label}</Text>
                  <Text style={styles.breakdownValue}>{item.value}</Text>
                </DashboardCard>
              ))}
            </View>

            <Text style={styles.sectionLabel}>MONTHLY AVERAGE</Text>

            <DashboardCard style={styles.sectionCard}>
              <View style={styles.averageTopRow}>
                <View style={styles.averageTopCopy}>
                  <Text style={styles.metricLabel}>Avg Commission / Month</Text>
                  <Text style={[styles.metricValue, styles.warningValue]}>
                    {commissionsData.monthlyAverage.averageCommissionPerMonth}
                  </Text>
                </View>

                <View style={styles.metricItemEnd}>
                  <Text style={styles.metricLabel}>Based on</Text>
                  <Text style={styles.averageMonthsValue}>
                    {commissionsData.monthlyAverage.basedOnMonths}
                  </Text>
                </View>
              </View>

              <View style={styles.averageBottomRow}>
                <View style={styles.averageBottomItem}>
                  <Text style={styles.metricLabel}>Avg One-Time / mo</Text>
                  <Text style={styles.averageBottomValue}>
                    {commissionsData.monthlyAverage.averageOneTimePerMonth}
                  </Text>
                </View>

                <View style={styles.averageBottomItem}>
                  <Text style={styles.metricLabel}>Avg Recurring / mo</Text>
                  <Text style={styles.averageBottomValue}>
                    {commissionsData.monthlyAverage.averageRecurringPerMonth}
                  </Text>
                </View>
              </View>
            </DashboardCard>

            <Text style={styles.sectionLabel}>TARGET MILESTONES</Text>

            <DashboardCard style={styles.sectionCard}>
              <View style={styles.milestoneHeader}>
                <Text style={styles.milestoneTitle}>This Month&apos;s Commission</Text>
                <Text style={styles.milestoneAmount}>{commissionsData.targetCommission}</Text>
              </View>

              <ProgressBar progress={commissionsData.progress} />

              <View style={styles.progressLabels}>
                <Text style={styles.progressEdge}>{'\u20B9'}0</Text>
                <Text style={styles.progressCenter}>{commissionsData.progressLabel}</Text>
                <Text style={styles.progressEdge}>{'\u20B9'}2L</Text>
              </View>

              <View style={styles.pillRow}>
                {commissionsData.milestones.map(milestone => (
                  <MilestoneChip
                    key={milestone.id}
                    amount={milestone.amount}
                    active={milestone.active}
                  />
                ))}
              </View>
            </DashboardCard>

            <Pressable style={styles.historyButton}>
              <View style={styles.historyIcon}>
                <View style={styles.historySheet} />
                <View style={styles.historyLine} />
                <View style={[styles.historyLine, styles.historyLineOffset]} />
              </View>
              <Text style={styles.historyButtonLabel}>{commissionsData.ctaLabel}</Text>
            </Pressable>
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
    marginBottom: 14,
  },
  headerTitle: {
    color: colors.primaryText,
    fontSize: 18,
    fontWeight: '700',
    marginLeft: 10,
  },
  headerDivider: {
    height: 1,
    backgroundColor: '#1D1E22',
    marginBottom: 10,
  },
  balanceCard: {
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 12,
    marginBottom: 12,
  },
  cardEyebrow: {
    color: '#67676D',
    fontSize: 10,
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  balanceValue: {
    color: colors.goldText,
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 2,
  },
  balanceSubValue: {
    color: '#B6B1AB',
    fontSize: 16,
    marginBottom: 12,
  },
  withdrawButton: {
    width: '100%',
    height: 30,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: colors.actionButtonBorder,
    backgroundColor: colors.actionButtonBackground,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  withdrawButtonLabel: {
    color: '#A6A7AD',
    fontSize: 13,
    fontWeight: '500',
  },
  withdrawCaption: {
    color: '#6E7077',
    fontSize: 12,
  },
  dualMetricCard: {
    marginBottom: 12,
    paddingVertical: 12,
  },
  dualMetricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  dualMetricItem: {
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
    fontSize: 17,
    fontWeight: '700',
  },
  metricSubValue: {
    color: '#C4C6CC',
    fontSize: 11,
    marginTop: 2,
  },
  positiveValue: {
    color: colors.greenText,
  },
  warningValue: {
    color: colors.goldText,
  },
  sectionLabel: {
    color: '#A7A8AD',
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  sectionCard: {
    marginBottom: 12,
    paddingVertical: 14,
  },
  timelineItem: {
    marginTop: 14,
  },
  timelineRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timelineLabel: {
    color: colors.primaryText,
    fontSize: 15,
    fontWeight: '500',
  },
  timelineValue: {
    color: colors.greenText,
    fontSize: 15,
    fontWeight: '600',
  },
  breakdownRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  breakdownCard: {
    flex: 1,
    marginBottom: 0,
    paddingVertical: 14,
  },
  breakdownValue: {
    color: colors.primaryText,
    fontSize: 17,
    fontWeight: '600',
  },
  averageTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  averageTopCopy: {
    flex: 1,
    paddingRight: 10,
  },
  averageMonthsValue: {
    color: colors.primaryText,
    fontSize: 15,
    fontWeight: '500',
  },
  averageBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  averageBottomItem: {
    flex: 1,
  },
  averageBottomValue: {
    color: colors.primaryText,
    fontSize: 17,
    fontWeight: '600',
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
  historyButton: {
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.actionButtonBorder,
    backgroundColor: colors.actionButtonBackground,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  historyIcon: {
    width: 14,
    height: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  historySheet: {
    position: 'absolute',
    width: 10,
    height: 12,
    borderWidth: 1.2,
    borderColor: colors.goldText,
    borderRadius: 2,
  },
  historyLine: {
    width: 5,
    height: 1.2,
    backgroundColor: colors.goldText,
    marginTop: 2,
  },
  historyLineOffset: {
    marginTop: 1.6,
  },
  historyButtonLabel: {
    color: colors.goldText,
    fontSize: 13,
    fontWeight: '600',
  },
});

export default CommissionsScreen;
