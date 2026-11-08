import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';

import type {AppTab, BottomTab, BottomTabIcon} from '../types';
import {colors, spacing} from '../../../theme/colors';

interface BottomTabBarProps {
  tabs: BottomTab[];
  onTabPress?: (tab: AppTab) => void;
}

function TabGlyph({
  icon,
  active,
}: {
  icon: BottomTabIcon;
  active: boolean;
}): React.JSX.Element {
  const tintStyle = active ? styles.activeTint : styles.inactiveTint;

  switch (icon) {
    case 'home':
      return (
        <View style={styles.homeIcon}>
          <View style={[styles.homeRoof, tintStyle]} />
          <View style={[styles.homeBase, tintStyle]} />
        </View>
      );
    case 'investors':
      return (
        <View style={styles.peopleIcon}>
          <View style={[styles.peopleHeadPrimary, tintStyle]} />
          <View style={[styles.peopleHeadSecondary, tintStyle]} />
          <View style={[styles.peopleBodyPrimary, tintStyle]} />
          <View style={[styles.peopleBodySecondary, tintStyle]} />
        </View>
      );
    case 'earnings':
      return (
        <View style={styles.walletIcon}>
          <View style={[styles.walletBody, tintStyle]} />
          <View style={[styles.walletFold, tintStyle]} />
          <View style={[styles.walletDot, styles.activeFillDot, active ? styles.activeFillDot : styles.inactiveFillDot]} />
        </View>
      );
    case 'profile':
      return (
        <View style={styles.profileIcon}>
          <View style={[styles.profileHead, tintStyle]} />
          <View style={[styles.profileBody, tintStyle]} />
        </View>
      );
  }
}

function BottomTabBar({tabs, onTabPress}: BottomTabBarProps): React.JSX.Element {
  return (
    <View style={styles.container}>
      <View style={styles.tabRow}>
        {tabs.map(tab => {
          const isActive = Boolean(tab.active);

          return (
            <Pressable
              key={tab.id}
              onPress={() => onTabPress?.(tab.id)}
              style={[styles.tabItem, isActive ? styles.activeTab : null]}>
              <TabGlyph icon={tab.icon} active={isActive} />
              <Text style={[styles.tabLabel, isActive ? styles.activeLabel : null]}>
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
      <View style={styles.homeIndicator} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.bottomBarBackground,
    borderTopWidth: 1,
    borderTopColor: colors.bottomBarBorder,
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: spacing.tabBarBottomInset,
  },
  tabRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 8,
  },
  tabItem: {
    flex: 1,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  activeTab: {
    backgroundColor: '#443719',
  },
  tabLabel: {
    marginTop: 4,
    fontSize: 10,
    color: '#8E90A0',
  },
  activeLabel: {
    color: colors.goldText,
    fontWeight: '700',
  },
  activeTint: {
    borderColor: colors.goldText,
  },
  inactiveTint: {
    borderColor: '#8E90A0',
  },
  activeFillDot: {
    backgroundColor: colors.goldText,
  },
  inactiveFillDot: {
    backgroundColor: '#8E90A0',
  },
  homeIcon: {
    width: 18,
    height: 18,
    alignItems: 'center',
  },
  homeRoof: {
    width: 10,
    height: 10,
    borderTopWidth: 1.5,
    borderLeftWidth: 1.5,
    transform: [{rotate: '45deg'}],
    marginTop: 1,
  },
  homeBase: {
    position: 'absolute',
    bottom: 1,
    width: 12,
    height: 9,
    borderWidth: 1.5,
    borderTopWidth: 0,
  },
  peopleIcon: {
    width: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  peopleHeadPrimary: {
    position: 'absolute',
    top: 2,
    left: 5,
    width: 5,
    height: 5,
    borderRadius: 2.5,
    borderWidth: 1.3,
  },
  peopleHeadSecondary: {
    position: 'absolute',
    top: 4,
    right: 2,
    width: 4,
    height: 4,
    borderRadius: 2,
    borderWidth: 1.3,
  },
  peopleBodyPrimary: {
    position: 'absolute',
    bottom: 1,
    left: 4,
    width: 8,
    height: 5,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    borderWidth: 1.3,
    borderBottomWidth: 0,
  },
  peopleBodySecondary: {
    position: 'absolute',
    bottom: 2,
    right: 1,
    width: 6,
    height: 4,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    borderWidth: 1.3,
    borderBottomWidth: 0,
  },
  walletIcon: {
    width: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  walletBody: {
    width: 15,
    height: 11,
    borderRadius: 2,
    borderWidth: 1.4,
  },
  walletFold: {
    position: 'absolute',
    top: 6,
    right: 2,
    width: 6,
    height: 4,
    borderWidth: 1.4,
    borderLeftWidth: 0,
    borderRadius: 1,
  },
  walletDot: {
    position: 'absolute',
    right: 4,
    top: 8,
    width: 2,
    height: 2,
    borderRadius: 1,
  },
  profileIcon: {
    width: 18,
    height: 18,
    alignItems: 'center',
  },
  profileHead: {
    width: 6,
    height: 6,
    borderRadius: 3,
    borderWidth: 1.3,
    marginBottom: 1,
  },
  profileBody: {
    width: 10,
    height: 6,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    borderWidth: 1.3,
    borderBottomWidth: 0,
  },
  homeIndicator: {
    alignSelf: 'center',
    width: 128,
    height: 5,
    borderRadius: 999,
    backgroundColor: '#F2F2F4',
  },
});

export default BottomTabBar;
