import React from 'react';
import {SafeAreaView, StatusBar, StyleSheet, Text, View} from 'react-native';

import BottomTabBar from '../features/commissionDashboard/components/BottomTabBar';
import type {AppTab} from '../features/commissionDashboard/types';
import {buildBottomTabs} from '../navigation/tabs';
import {colors, spacing} from '../theme/colors';

interface PlaceholderScreenProps {
  activeTab: AppTab;
  onTabPress: (tab: AppTab) => void;
  title: string;
}

function PlaceholderScreen({
  activeTab,
  onTabPress,
  title,
}: PlaceholderScreenProps): React.JSX.Element {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={colors.appBackground} />

      <View style={styles.screenLayout}>
        <View style={styles.contentArea}>
          <View style={styles.screenShell}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.copy}>Screen not implemented yet.</Text>
          </View>
        </View>

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
  contentArea: {
    flex: 1,
    paddingHorizontal: spacing.screenHorizontal,
    paddingTop: spacing.screenTopInset,
    paddingBottom: spacing.screenBottomInset,
  },
  screenShell: {
    flex: 1,
    maxWidth: 398,
    width: '100%',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.screenShell,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: colors.shellBorder,
    paddingHorizontal: spacing.shellHorizontal,
  },
  title: {
    color: colors.primaryText,
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
  },
  copy: {
    color: '#8B8D95',
    fontSize: 14,
  },
});

export default PlaceholderScreen;
