import React, { useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { MaterialIcons } from '@react-native-vector-icons/material-icons';

import BottomTabBar from '../components/home/BottomTabBar';
import BrandHero from '../components/home/BrandHero';
import MenuCardList from '../components/home/MenuCardList';
import VehicleSelector from '../components/home/VehicleSelector';
import { drawerItems } from '../features/home/data';
import type { Vehicle } from '../features/home/data';
import { homePalette } from '../features/home/theme';

interface HomeScreenProps {
  onPracticePress: () => void;
  onHighwayCodePress: () => void;
  onMockExamPress: () => void;
  onRoadSignsPress: () => void;
  onDashboardPress: () => void;
  onProfilePress: () => void;
  onLeaderboardPress: () => void;
  onHelpPress: () => void;
  onLogout: () => void;
}

function HomeScreen({
  onPracticePress,
  onHighwayCodePress,
  onMockExamPress,
  onRoadSignsPress,
  onDashboardPress,
  onProfilePress,
  onLeaderboardPress,
  onHelpPress,
  onLogout,
}: HomeScreenProps): React.JSX.Element {
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle>('adi');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleDrawerItemPress = (itemId: string) => {
    setIsDrawerOpen(false);

    if (itemId === 'home') {
      return;
    }

    if (itemId === 'practice') {
      onPracticePress();
      return;
    }

    if (itemId === 'highwayCode') {
      onHighwayCodePress();
      return;
    }

    if (itemId === 'mockExam') {
      onMockExamPress();
      return;
    }

    if (itemId === 'roadSigns') {
      onRoadSignsPress();
      return;
    }

    if (itemId === 'profile') {
      onProfilePress();
      return;
    }

    if (itemId === 'leaderboard') {
      onLeaderboardPress();
      return;
    }

    Alert.alert('Coming Soon', 'This section is not available yet.');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={homePalette.heroStart} />

      <View style={styles.screen}>
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}>
          <BrandHero onMenuPress={() => setIsDrawerOpen(true)} />

          <View style={styles.mainShell}>
            <View style={styles.patternBubbleOne} />
            <View style={styles.patternBubbleTwo} />

            <VehicleSelector
              selectedVehicle={selectedVehicle}
              onSelect={setSelectedVehicle}
            />
            <MenuCardList
              onCardPress={cardId => {
                if (cardId === 'practise') {
                  onPracticePress();
                }

                if (cardId === 'mock') {
                  onMockExamPress();
                }

                if (cardId === 'roadSigns') {
                  onRoadSignsPress();
                }

                if (cardId === 'code') {
                  onHighwayCodePress();
                }
              }}
            />
          </View>
        </ScrollView>

        <BottomTabBar
          activeTab="learn"
          onTabPress={tab => {
            if (tab === 'practice') {
              onPracticePress();
            }

            if (tab === 'mock') {
              onMockExamPress();
            }

            if (tab === 'dashboard') {
              onDashboardPress();
            }

            if (tab === 'help') {
              onHelpPress();
            }
          }}
        />
      </View>

      {isDrawerOpen ? (
        <View style={styles.drawerOverlay}>
          <Pressable
            style={styles.drawerBackdrop}
            onPress={() => setIsDrawerOpen(false)}
          />

          <View style={styles.drawerPanel}>
            <View style={styles.drawerHeader}>
              <View>
                <Text style={styles.drawerTitle}>Punjabi Theory</Text>
                <Text style={styles.drawerSubtitle}>Quick navigation</Text>
              </View>

              <Pressable
                onPress={() => setIsDrawerOpen(false)}
                style={styles.drawerCloseButton}>
                <MaterialIcons
                  name="close"
                  size={22}
                  color={homePalette.ink}
                />
              </Pressable>
            </View>

            {drawerItems.map(item => (
              <Pressable
                key={item.id}
                onPress={() => handleDrawerItemPress(item.id)}
                style={styles.drawerItem}>
                <View style={styles.drawerItemIconWrap}>
                  <MaterialIcons
                    name={item.icon}
                    size={22}
                    color={homePalette.navy}
                  />
                </View>

                <Text style={styles.drawerItemText}>{item.label}</Text>
              </Pressable>
            ))}

            <View style={styles.drawerSpacer} />
            <Pressable
              onPress={() => {
                setIsDrawerOpen(false);
                onLogout();
              }}
              style={[styles.drawerItem, styles.logoutItem]}>
              <View style={[styles.drawerItemIconWrap, styles.logoutIconWrap]}>
                <MaterialIcons name="logout" size={22} color="#B54735" />
              </View>
              <Text style={[styles.drawerItemText, styles.logoutText]}>Log out</Text>
            </Pressable>
          </View>
        </View>
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: homePalette.heroStart,
  },
  screen: {
    flex: 1,
    backgroundColor: homePalette.background,
    paddingBottom: 5,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 10,
    paddingBottom: 5,
  },
  mainShell: {
    marginTop: -6,
    backgroundColor: homePalette.shell,
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 18,
    overflow: 'hidden',
  },
  patternBubbleOne: {
    position: 'absolute',
    top: 100,
    right: -38,
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#F4ECE0',
    opacity: 0.8,
  },
  patternBubbleTwo: {
    position: 'absolute',
    top: 260,
    left: -28,
    width: 86,
    height: 86,
    borderRadius: 43,
    backgroundColor: '#EEF6F7',
  },
  drawerOverlay: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
  },
  drawerBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(9, 22, 34, 0.42)',
  },
  drawerPanel: {
    width: '78%',
    maxWidth: 312,
    backgroundColor: homePalette.shell,
    paddingTop: (StatusBar.currentHeight ?? 0) + 24,
    paddingHorizontal: 18,
    paddingBottom: 28,
    borderTopRightRadius: 26,
    borderBottomRightRadius: 26,
    borderRightWidth: 1,
    borderColor: '#E2D7C6',
    shadowColor: '#000',
    shadowOffset: { width: 10, height: 0 },
    shadowOpacity: 0.18,
    shadowRadius: 20,
    elevation: 8,
  },
  drawerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 18,
  },
  drawerTitle: {
    color: homePalette.ink,
    fontSize: 24,
    lineHeight: 28,
    fontWeight: '900',
  },
  drawerSubtitle: {
    color: homePalette.muted,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '600',
    marginTop: 4,
  },
  drawerCloseButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#F3EEE6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: homePalette.white,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E5DACA',
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 10,
  },
  drawerItemIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#EDF4FC',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  drawerItemText: {
    color: homePalette.ink,
    fontSize: 16,
    fontWeight: '800',
  },
  drawerSpacer: {
    flex: 1,
    minHeight: 16,
  },
  logoutItem: {
    borderColor: '#F0D4CC',
    marginBottom: 0,
  },
  logoutIconWrap: {
    backgroundColor: '#FFF1ED',
  },
  logoutText: {
    color: '#B54735',
  },
});

export default HomeScreen;
