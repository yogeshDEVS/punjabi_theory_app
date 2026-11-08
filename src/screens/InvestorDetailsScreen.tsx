import React from 'react';
import {
  Alert,
  Linking,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import ActionIconButton from '../features/commissionDashboard/components/ActionIconButton';
import DashboardCard from '../features/commissionDashboard/components/DashboardCard';
import InvestorActionButton from '../features/investors/components/InvestorActionButton';
import InvestorHoldingCard from '../features/investors/components/InvestorHoldingCard';
import type {InvestorDetail} from '../features/investors/types';
import {colors, spacing} from '../theme/colors';

interface InvestorDetailsScreenProps {
  investor: InvestorDetail;
  onBack: () => void;
}

function InvestorDetailsScreen({
  investor,
  onBack,
}: InvestorDetailsScreenProps): React.JSX.Element {
  const isVerified = investor.verificationLabel.includes('Verified');

  const handleDownloadPortfolioSummary = async (): Promise<void> => {
    const viewerUrl = `https://docs.google.com/gview?embedded=1&url=${encodeURIComponent(
      investor.portfolioSummaryUrl,
    )}`;

    try {
      await Linking.openURL(investor.portfolioSummaryUrl);
    } catch {
      try {
        await Linking.openURL(viewerUrl);
      } catch {
        Alert.alert(
          'Unable to open PDF',
          'The portfolio summary could not be opened right now.',
        );
      }
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={colors.appBackground} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.screenShell}>
          <View style={styles.headerRow}>
            <ActionIconButton icon="back" onPress={onBack} />
            <Text style={styles.headerTitle}>{investor.title}</Text>
          </View>

          <View style={styles.headerDivider} />

          <View style={styles.identityRow}>
            <View style={styles.identityCopy}>
              <Text style={styles.name}>{investor.name}</Text>
              <Text style={styles.joinedOn}>{investor.joinedOn}</Text>
            </View>
            <View
              style={[
                styles.verificationPill,
                isVerified ? styles.verificationPillVerified : styles.verificationPillPending,
              ]}>
              <Text
                style={[
                  styles.verificationText,
                  isVerified ? styles.verificationTextVerified : styles.verificationTextPending,
                ]}>
                {investor.verificationLabel}
              </Text>
            </View>
          </View>

          <View style={styles.actionRow}>
            <InvestorActionButton label="Call Investor" icon="call" />
            <InvestorActionButton label="Message" icon="message" />
          </View>

          <DashboardCard style={styles.sectionCard}>
            <View style={styles.overviewTopRow}>
              <View style={styles.overviewTopMetric}>
                <Text style={styles.overviewPrimaryValue}>{investor.overview.totalInvested}</Text>
                <Text style={styles.overviewLabel}>TOTAL INVESTED</Text>
              </View>
              <View style={[styles.overviewTopMetric, styles.metricItemEnd]}>
                <Text style={[styles.overviewPrimaryValue, styles.positiveValue]}>
                  {investor.overview.currentValue}
                </Text>
                <Text style={styles.overviewLabel}>CURRENT VALUE</Text>
              </View>
            </View>

            <View style={styles.overviewDivider} />

            <View style={styles.returnsRow}>
              <Text style={styles.returnsLabel}>Total Returns</Text>
              <Text style={styles.returnsValue}>
                {investor.overview.totalReturns}
                <Text style={styles.returnsDelta}> {investor.overview.totalReturnsDelta}</Text>
              </Text>
            </View>

            <View style={styles.overviewBottomRow}>
              <View style={styles.overviewBottomMetric}>
                <Text style={styles.overviewLabel}>WALLET BALANCE</Text>
                <Text style={[styles.overviewSecondaryValue, styles.warningValue]}>
                  {investor.overview.walletBalance}
                </Text>
              </View>
              <View style={[styles.overviewBottomMetric, styles.metricItemEnd]}>
                <Text style={styles.overviewLabel}>ACTIVE INVESTMENTS</Text>
                <Text style={styles.overviewSecondaryValue}>
                  {investor.overview.activeInvestments}
                </Text>
              </View>
            </View>
          </DashboardCard>

          <DashboardCard style={styles.sectionCard}>
            <Text style={styles.commissionTitle}>Your Commission (This Investor)</Text>

            <View style={styles.commissionMetricsRow}>
              <View style={styles.commissionMetric}>
                <Text style={styles.overviewLabel}>Total Earned</Text>
                <Text style={styles.commissionValue}>{investor.commission.totalEarned}</Text>
              </View>
              <View style={styles.commissionMetric}>
                <Text style={styles.overviewLabel}>One-Time Earned</Text>
                <Text style={styles.commissionValue}>
                  {investor.commission.oneTimeEarned}
                </Text>
              </View>
            </View>

            <View style={styles.commissionMetricsRow}>
              <View style={styles.commissionMetric}>
                <Text style={styles.overviewLabel}>Recurring (Monthly)</Text>
                <Text style={styles.commissionValue}>
                  {investor.commission.recurringMonthly}
                </Text>
              </View>
              <View style={styles.commissionMetric}>
                <Text style={styles.overviewLabel}>Recurring Accrued</Text>
                <Text style={styles.commissionValue}>
                  {investor.commission.recurringAccrued}
                </Text>
              </View>
            </View>

            <View style={styles.projectionPanel}>
              <Text style={styles.projectionTitle}>PROJECTED REMAINING COMMISSION</Text>
              <View style={styles.projectionRow}>
                <View>
                  <Text style={styles.projectionLabel}>Remaining Term</Text>
                  <Text style={styles.projectionValue}>
                    {investor.commission.remainingTerm}
                  </Text>
                </View>
                <View style={styles.metricItemEnd}>
                  <Text style={styles.projectionLabel}>Projected Recurring</Text>
                  <Text style={[styles.projectionValue, styles.warningValue]}>
                    {investor.commission.projectedRecurring}
                  </Text>
                </View>
              </View>
            </View>
          </DashboardCard>

          <View style={styles.investmentsHeader}>
            <Text style={styles.investmentsLabel}>INVESTMENTS</Text>
            <Text style={styles.viewAll}>View All</Text>
          </View>

          {investor.holdings.map(holding => (
            <InvestorHoldingCard key={holding.id} holding={holding} />
          ))}

          <Pressable style={styles.downloadButton} onPress={handleDownloadPortfolioSummary}>
            <View style={styles.downloadIcon}>
              <View style={styles.downloadSheet} />
              <View style={styles.downloadLine} />
              <View style={[styles.downloadLine, styles.downloadLineOffset]} />
            </View>
            <Text style={styles.downloadLabel}>Download Portfolio Summary</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.appBackground,
     paddingTop:40
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
    marginBottom: 12,
  },
  identityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  identityCopy: {
    flex: 1,
    paddingRight: 10,
  },
  name: {
    color: colors.primaryText,
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 2,
  },
  joinedOn: {
    color: '#8B8D95',
    fontSize: 12,
  },
  verificationPill: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginTop: 2,
  },
  verificationPillVerified: {
    backgroundColor: colors.statusActiveBackground,
    borderColor: colors.statusActiveBorder,
  },
  verificationPillPending: {
    backgroundColor: colors.statusPendingBackground,
    borderColor: colors.statusPendingBorder,
  },
  verificationText: {
    fontSize: 11,
    fontWeight: '600',
  },
  verificationTextVerified: {
    color: colors.statusActiveText,
  },
  verificationTextPending: {
    color: colors.statusPendingText,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  sectionCard: {
    marginBottom: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  overviewTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  overviewTopMetric: {
    flex: 1,
  },
  metricItemEnd: {
    alignItems: 'flex-end',
  },
  overviewPrimaryValue: {
    color: colors.primaryText,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  overviewLabel: {
    color: '#8B8D95',
    fontSize: 10,
    letterSpacing: 0.5,
  },
  positiveValue: {
    color: colors.greenText,
  },
  warningValue: {
    color: colors.goldText,
  },
  overviewDivider: {
    height: 1,
    backgroundColor: '#24252B',
    marginVertical: 12,
  },
  returnsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  returnsLabel: {
    color: '#C8CACF',
    fontSize: 12,
  },
  returnsValue: {
    color: colors.greenText,
    fontSize: 13,
    fontWeight: '600',
  },
  returnsDelta: {
    color: colors.greenText,
  },
  overviewBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  overviewBottomMetric: {
    flex: 1,
  },
  overviewSecondaryValue: {
    color: colors.primaryText,
    fontSize: 28,
    fontWeight: '700',
    marginTop: 4,
  },
  commissionTitle: {
    color: colors.goldText,
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 14,
  },
  commissionMetricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    gap: 12,
  },
  commissionMetric: {
    flex: 1,
  },
  commissionValue: {
    color: colors.primaryText,
    fontSize: 18,
    fontWeight: '600',
    marginTop: 4,
  },
  projectionPanel: {
    borderWidth: 1,
    borderColor: colors.commissionPanelBorder,
    backgroundColor: colors.commissionPanelBackground,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginTop: 4,
  },
  projectionTitle: {
    color: colors.goldText,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  projectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  projectionLabel: {
    color: '#C1A96A',
    fontSize: 10,
    marginBottom: 4,
  },
  projectionValue: {
    color: colors.primaryText,
    fontSize: 16,
    fontWeight: '600',
  },
  investmentsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    marginTop: 4,
  },
  investmentsLabel: {
    color: '#A7A8AD',
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.8,
  },
  viewAll: {
    color: colors.goldText,
    fontSize: 11,
    fontWeight: '700',
  },
  downloadButton: {
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.actionButtonBorder,
    backgroundColor: colors.actionButtonBackground,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  downloadIcon: {
    width: 14,
    height: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  downloadSheet: {
    position: 'absolute',
    width: 10,
    height: 12,
    borderWidth: 1.2,
    borderColor: colors.goldText,
    borderRadius: 2,
  },
  downloadLine: {
    width: 5,
    height: 1.2,
    backgroundColor: colors.goldText,
    marginTop: 2,
  },
  downloadLineOffset: {
    marginTop: 1.6,
  },
  downloadLabel: {
    color: colors.goldText,
    fontSize: 13,
    fontWeight: '600',
  },
});

export default InvestorDetailsScreen;
