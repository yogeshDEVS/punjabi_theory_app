import React, {useEffect, useState} from 'react';
import {
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {MaterialIcons} from '@react-native-vector-icons/material-icons';

import {homeInsets, homePalette} from '../features/home/theme';
import {subscribeRoadSignsProgress} from '../services/roadSignsProgress';

const TOPIC_ID = 'signs-giving-orders';

interface RoadSignsScreenProps {
  onBack: () => void;
  onSignsGivingOrdersPress: () => void;
}

function RoadSignsScreen({
  onBack,
  onSignsGivingOrdersPress,
}: RoadSignsScreenProps): React.JSX.Element {
  const [progress, setProgress] = useState<number>(0);

  // Subscribe to real-time progress updates from Firestore & local storage
  useEffect(() => {
    const unsubscribe = subscribeRoadSignsProgress(TOPIC_ID, currentProgress => {
      setProgress(currentProgress);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const isComplete = progress >= 100;
  const isStarted = progress > 0 && !isComplete;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={homePalette.heroStart} />

      <View style={styles.screen}>
        {/* Header with extra edge padding and Android status bar handling */}
        <View style={styles.header}>
          <Pressable onPress={onBack} hitSlop={10} style={styles.backButton}>
            <MaterialIcons name="arrow-back" size={24} color={homePalette.white} />
            <Text style={styles.backText}>Back</Text>
          </Pressable>

          <Text style={styles.headerTitle}>Road Signs</Text>

          <View style={styles.headerRightPlaceholder} />
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}>
          {/* Hero Banner with extra padding */}
          <View style={styles.heroCard}>
            <View style={styles.heroIconWrap}>
              <MaterialIcons name="traffic" size={32} color="#FFFFFF" />
            </View>
            <View style={styles.heroCopy}>
              <Text style={styles.heroTitle}>Road Signs</Text>
              <Text style={styles.heroSubtitle}>
                Learn UK road traffic signs and official Highway Code rules for your driving test.
              </Text>
            </View>
          </View>

          {/* Section Heading */}
          <Text style={styles.sectionHeading}>Categories</Text>

          {/* ONLY "Signs that gives order" card with Circular % Progress Tracker */}
          <Pressable
            style={({pressed}) => [styles.card, pressed && styles.cardPressed]}
            onPress={onSignsGivingOrdersPress}>
            <View style={styles.accentStrip} />

            <View style={styles.iconWrap}>
              <MaterialIcons name="do-not-disturb-on" size={30} color="#D32F2F" />
            </View>

            <View style={styles.cardBody}>
              <View style={styles.badgeRow}>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>CIRCULAR SIGNS</Text>
                </View>
                <Text style={styles.shapeText}>Mandatory & Prohibitions</Text>
              </View>

              <Text style={styles.cardTitle}>Signs that gives order</Text>
              <Text style={styles.cardSubtitle}>
                Red circles prohibit what you must NOT do; blue circles give positive mandatory instructions you MUST follow.
              </Text>
            </View>

            {/* Circular % progress tracker */}
            <View
              style={[
                styles.progressRing,
                isStarted && styles.progressRingActive,
                isComplete && styles.progressRingComplete,
              ]}>
              <Text
                style={[
                  styles.progressText,
                  isStarted && styles.progressTextActive,
                  isComplete && styles.progressTextComplete,
                ]}>
                {progress}%
              </Text>
            </View>
          </Pressable>
        </ScrollView>
      </View>
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
    backgroundColor: '#F5F8FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight ?? 0) + 8 : 12,
    paddingBottom: 14,
    backgroundColor: homePalette.heroStart,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  backText: {
    color: homePalette.white,
    fontSize: 16,
    fontWeight: '600',
  },
  headerTitle: {
    color: homePalette.white,
    fontSize: 19,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  headerRightPlaceholder: {
    width: 60,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 36 + homeInsets.bottomSafeInset,
  },
  heroCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E4363',
    borderRadius: 20,
    padding: 18,
    marginBottom: 20,
    shadowColor: '#17344E',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 3,
  },
  heroIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.14)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  heroCopy: {
    flex: 1,
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 4,
  },
  heroSubtitle: {
    color: '#C4D8EA',
    fontSize: 13,
    lineHeight: 18,
  },
  sectionHeading: {
    fontSize: 17,
    fontWeight: '800',
    color: '#163047',
    marginBottom: 12,
    letterSpacing: 0.3,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    paddingLeft: 18,
    borderWidth: 1.5,
    borderColor: '#F8B4B4',
    shadowColor: '#8CA0B3',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
  },
  cardPressed: {
    opacity: 0.9,
    transform: [{scale: 0.99}],
  },
  accentStrip: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 6,
    backgroundColor: '#D32F2F',
  },
  iconWrap: {
    width: 50,
    height: 50,
    borderRadius: 15,
    backgroundColor: '#FDEDED',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  cardBody: {
    flex: 1,
    paddingRight: 8,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  badge: {
    backgroundColor: '#FDEDED',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#D32F2F',
    letterSpacing: 0.2,
  },
  shapeText: {
    fontSize: 11.5,
    color: '#718698',
    fontWeight: '500',
  },
  cardTitle: {
    fontSize: 16.5,
    fontWeight: '800',
    color: '#163047',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 12.5,
    color: '#5C7184',
    lineHeight: 18,
  },
  progressRing: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2.5,
    borderColor: '#D2E0EB',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 6,
  },
  progressRingActive: {
    borderColor: '#D32F2F',
    backgroundColor: '#FDEDED',
  },
  progressRingComplete: {
    borderColor: '#2E7D32',
    backgroundColor: '#E8F5E9',
  },
  progressText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#7D9DB6',
  },
  progressTextActive: {
    color: '#D32F2F',
  },
  progressTextComplete: {
    color: '#2E7D32',
  },
});

export default RoadSignsScreen;
