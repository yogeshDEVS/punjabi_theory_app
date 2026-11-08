import React, {useState} from 'react';
import {SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, View} from 'react-native';

import ActionIconButton from '../features/commissionDashboard/components/ActionIconButton';
import BottomTabBar from '../features/commissionDashboard/components/BottomTabBar';
import type {AppTab} from '../features/commissionDashboard/types';
import FilterChip from '../features/investors/components/FilterChip';
import InvestorCard from '../features/investors/components/InvestorCard';
import SearchInputShell from '../features/investors/components/SearchInputShell';
import {investorsData} from '../features/investors/investorsData';
import type {InvestorFilter} from '../features/investors/types';
import {colors, spacing} from '../theme/colors';
import {buildBottomTabs} from '../navigation/tabs';

interface InvestorsScreenProps {
  activeTab: AppTab;
  onTabPress: (tab: AppTab) => void;
  onInvestorPress: (investorId: string) => void;
}

function InvestorsScreen({
  activeTab,
  onTabPress,
  onInvestorPress,
}: InvestorsScreenProps): React.JSX.Element {
  const [selectedFilter, setSelectedFilter] = useState<InvestorFilter['id']>('all');

  const filters = investorsData.filters.map(filter => ({
    ...filter,
    active: filter.id === selectedFilter,
  }));

  const visibleInvestors = investorsData.investors.filter(investor => {
    if (selectedFilter === 'all') {
      return true;
    }

    if (selectedFilter === 'active') {
      return investor.status === 'Active' || investor.status === 'KYC Pending';
    }

    return investor.status === 'Dormant';
  });

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
              <Text style={styles.title}>{investorsData.title}</Text>
            </View>

            <View style={styles.headerDivider} />

            <SearchInputShell placeholder={investorsData.searchPlaceholder} />

            <View style={styles.filterRow}>
              {filters.map(filter => (
                <FilterChip
                  key={filter.id}
                  filter={filter}
                  onPress={setSelectedFilter}
                />
              ))}
            </View>

            <View>
              {visibleInvestors.map(investor => (
                <InvestorCard
                  key={investor.id}
                  investor={investor}
                  onPress={onInvestorPress}
                />
              ))}
            </View>
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
  title: {
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
  filterRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
    marginBottom: 12,
  },
});

export default InvestorsScreen;
