import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {MaterialIcons} from '@react-native-vector-icons/material-icons';

import {tabs} from '../../features/home/data';
import type {HomeTab} from '../../features/home/data';
import {homeInsets, homePalette} from '../../features/home/theme';

interface BottomTabBarProps {
  activeTab: HomeTab;
  onTabPress: (tab: HomeTab) => void;
}

function BottomTabBar({activeTab, onTabPress}: BottomTabBarProps): React.JSX.Element {
  return (
    <View style={styles.bottomBar}>
      {tabs.map(tab => {
        const isActive = tab.id === activeTab;

        return (
          <Pressable
            key={tab.id}
            accessibilityRole="tab"
            accessibilityState={{selected: isActive}}
            onPress={() => onTabPress(tab.id)}
            style={styles.bottomItem}>
            <MaterialIcons
              name={tab.icon}
              size={22}
              color={isActive ? homePalette.ink : '#9DA7B0'}
              style={styles.bottomIcon}
            />
            <Text
              style={[
                styles.bottomLabel,
                isActive && styles.bottomLabelActive,
              ]}>
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bottomBar: {
    flexDirection: 'row',
    backgroundColor: homePalette.surface,
    borderWidth: 1,
    borderColor: '#E2D7C6',
    borderRadius: 28,
    marginHorizontal: 10,
    marginTop: 8,
    marginBottom: 0,
    paddingTop: 12,
    paddingBottom: 18 + homeInsets.bottomSafeInset,
    paddingHorizontal: 8,
  },
  bottomItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomIcon: {
    marginBottom: 4,
  },
  bottomLabel: {
    color: '#717D88',
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
  },
  bottomLabelActive: {
    color: homePalette.ink,
  },
});

export default BottomTabBar;
