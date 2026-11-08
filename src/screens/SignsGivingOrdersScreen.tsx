import React, {useCallback, useEffect, useRef} from 'react';
import {
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import {MaterialIcons} from '@react-native-vector-icons/material-icons';

import {homeInsets, homePalette} from '../features/home/theme';
import {
  getRoadSignsProgress,
  saveRoadSignsProgress,
} from '../services/roadSignsProgress';

const rs1Image = require('../images/rs1.jpeg');
const rs2Image = require('../images/rs2.jpeg');
const TOPIC_ID = 'signs-giving-orders';

interface SignsGivingOrdersScreenProps {
  onBack: () => void;
}

function SignsGivingOrdersScreen({
  onBack,
}: SignsGivingOrdersScreenProps): React.JSX.Element {
  const {width: windowWidth} = useWindowDimensions();
  const maxProgressRef = useRef<number>(0);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Screen horizontal padding: 20 on each side (40 total)
  // Card internal padding: 14 on each side (28 total)
  // Extra safety margin of 4 to guarantee no edge cutting
  const availableImageWidth = Math.max(240, windowWidth - 40 - 28 - 4);

  // Calculate 1st image display height
  const assetSource1 = Image.resolveAssetSource(rs1Image);
  const nativeAspect1 =
    assetSource1 && assetSource1.width && assetSource1.height
      ? assetSource1.width / assetSource1.height
      : 0.65;
  const imageDisplayHeight1 = Math.round(availableImageWidth / nativeAspect1);

  // Calculate 2nd image display height
  const assetSource2 = Image.resolveAssetSource(rs2Image);
  const nativeAspect2 =
    assetSource2 && assetSource2.width && assetSource2.height
      ? assetSource2.width / assetSource2.height
      : 0.72;
  const imageDisplayHeight2 = Math.round(availableImageWidth / nativeAspect2);

  // Load existing highest progress on mount (but don't artificially inflate it)
  useEffect(() => {
    let isMounted = true;
    getRoadSignsProgress(TOPIC_ID).then(existingProgress => {
      if (isMounted) {
        maxProgressRef.current = existingProgress;
      }
    });

    return () => {
      isMounted = false;
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      // Final save on unmount
      if (maxProgressRef.current > 0) {
        saveRoadSignsProgress(TOPIC_ID, maxProgressRef.current);
      }
    };
  }, []);

  const queueSaveProgress = useCallback((percentage: number) => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    saveTimeoutRef.current = setTimeout(() => {
      saveRoadSignsProgress(TOPIC_ID, percentage);
    }, 300);
  }, []);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const {layoutMeasurement, contentOffset, contentSize} = event.nativeEvent;
    const visibleHeight = layoutMeasurement.height;
    const totalHeight = contentSize.height;
    const scrollY = contentOffset.y;

    // Maximum possible scroll offset
    const maxScrollY = totalHeight - visibleHeight;

    if (maxScrollY <= 0) {
      // Content fits in one screen — user has read everything
      if (maxProgressRef.current < 100) {
        maxProgressRef.current = 100;
        queueSaveProgress(100);
      }
      return;
    }

    // Accurate percentage: 0% at top, 100% at full scroll bottom
    const calculatedPercentage = Math.min(
      100,
      Math.max(0, Math.round((scrollY / maxScrollY) * 100)),
    );

    if (calculatedPercentage > maxProgressRef.current) {
      maxProgressRef.current = calculatedPercentage;
      queueSaveProgress(calculatedPercentage);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={homePalette.heroStart} />

      <View style={styles.screen}>
        {/* Header - now cleanly shows only "Road Signs" with a back icon */}
        <View style={styles.header}>
          <Pressable
            onPress={onBack}
            hitSlop={10}
            style={styles.backButton}
            accessibilityLabel="Back to Road Signs">
            <MaterialIcons name="arrow-back" size={24} color={homePalette.white} />
          </Pressable>

          <Text style={styles.headerTitle} numberOfLines={1}>
            Road Signs
          </Text>

          <View style={styles.headerSpacer} />
        </View>

        {/* Scrollable Content with onScroll progress tracker */}
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          onScroll={handleScroll}
          scrollEventThrottle={32}
          showsVerticalScrollIndicator={false}>
          {/* First Image: rs1.jpeg fully contained inside container */}
          <View style={styles.imageCard}>
            <Image
              source={rs1Image}
              style={{
                width: availableImageWidth,
                height: imageDisplayHeight1,
                maxWidth: '100%',
                borderRadius: 12,
              }}
              resizeMode="contain"
            />
          </View>

          {/* Signs Shown in this Guide content */}
          <Text style={styles.sectionTitle}>Signs Shown in this Guide</Text>

          {/* Sign 1: GO */}
          <View style={styles.signDetailCard}>
            <View style={[styles.signIconWrap, {backgroundColor: '#E8F5E9'}]}>
              <MaterialIcons name="check-circle" size={30} color="#2E7D32" />
            </View>
            <View style={styles.signDetailCopy}>
              <View style={styles.signDetailHeader}>
                <Text style={styles.signDetailTitle}>Manually Operated Temporary GO</Text>
                <View style={[styles.statusBadge, {backgroundColor: '#E8F5E9'}]}>
                  <Text style={[styles.statusBadgeText, {color: '#2E7D32'}]}>TEMPORARY</Text>
                </View>
              </View>
              <Text style={styles.signDetailDescription}>
                A green circular sign displaying "GO". Used by an authorised person, police officer, or road worker at roadworks or temporary traffic control.
              </Text>
              <View style={styles.ruleBox}>
                <Text style={styles.ruleBoxText}>
                  <Text style={styles.boldText}>Action Required: </Text>
                  Proceed with caution only when the GO sign is displayed and the road ahead is clear.
                </Text>
              </View>
            </View>
          </View>

          {/* Sign 2: No Entry */}
          <View style={styles.signDetailCard}>
            <View style={[styles.signIconWrap, {backgroundColor: '#FFEBEE'}]}>
              <MaterialIcons name="block" size={30} color="#C62828" />
            </View>
            <View style={styles.signDetailCopy}>
              <View style={styles.signDetailHeader}>
                <Text style={styles.signDetailTitle}>No Entry For Vehicular Traffic</Text>
                <View style={[styles.statusBadge, {backgroundColor: '#FFEBEE'}]}>
                  <Text style={[styles.statusBadgeText, {color: '#C62828'}]}>PROHIBITION</Text>
                </View>
              </View>
              <Text style={styles.signDetailDescription}>
                A red circular disc with a horizontal white bar across the centre. Indicates that no motor vehicle or motorcycle is permitted to enter from this direction.
              </Text>
              <View style={[styles.ruleBox, styles.ruleBoxDanger]}>
                <Text style={[styles.ruleBoxText, styles.ruleBoxDangerText]}>
                  <Text style={styles.boldText}>Action Required: </Text>
                  You must NOT enter under any circumstances. Disobeying this sign is illegal, dangerous, and carries penalty points.
                </Text>
              </View>
            </View>
          </View>

          {/* Second Image: rs2.jpeg - placed directly below first image explanation text */}
          <View style={[styles.imageCard, {marginTop: 10}]}>
            <Image
              source={rs2Image}
              style={{
                width: availableImageWidth,
                height: imageDisplayHeight2,
                maxWidth: '100%',
                borderRadius: 12,
              }}
              resizeMode="contain"
            />
          </View>

          {/* Sign 3: Entry to 20 mph Zone */}
          <View style={styles.signDetailCard}>
            <View style={[styles.signIconWrap, {backgroundColor: '#FFF3E0'}]}>
              <MaterialIcons name="speed" size={30} color="#E65100" />
            </View>
            <View style={styles.signDetailCopy}>
              <View style={styles.signDetailHeader}>
                <Text style={styles.signDetailTitle}>Entry to 20 mph Zone</Text>
                <View style={[styles.statusBadge, {backgroundColor: '#FFF3E0'}]}>
                  <Text style={[styles.statusBadgeText, {color: '#E65100'}]}>MANDATORY</Text>
                </View>
              </View>
              <Text style={styles.signDetailDescription}>
                Entry to a zone where a maximum speed limit of 20 mph applies. Often accompanied by traffic calming measures such as road humps and chicanes to enhance safety.
              </Text>
              <View style={[styles.ruleBox, styles.ruleBoxWarning]}>
                <Text style={[styles.ruleBoxText, styles.ruleBoxWarningText]}>
                  <Text style={styles.boldText}>Action Required: </Text>
                  Drive at or below 20 mph. Be especially watchful for pedestrians, children playing, and cyclists in the zone.
                </Text>
              </View>
            </View>
          </View>

          {/* Sign 4: End of 20 mph Zone */}
          <View style={styles.signDetailCard}>
            <View style={[styles.signIconWrap, {backgroundColor: '#E3F2FD'}]}>
              <MaterialIcons name="arrow-forward" size={30} color="#1565C0" />
            </View>
            <View style={styles.signDetailCopy}>
              <View style={styles.signDetailHeader}>
                <Text style={styles.signDetailTitle}>End of 20 mph Zone</Text>
                <View style={[styles.statusBadge, {backgroundColor: '#E3F2FD'}]}>
                  <Text style={[styles.statusBadgeText, {color: '#1565C0'}]}>ZONE ENDS</Text>
                </View>
              </View>
              <Text style={styles.signDetailDescription}>
                Marks the end of the 20 mph speed limit zone. The speed limit shown on signs ahead (e.g., 30 mph in built-up areas with street lights) will now apply.
              </Text>
              <View style={[styles.ruleBox, styles.ruleBoxInfo]}>
                <Text style={[styles.ruleBoxText, styles.ruleBoxInfoText]}>
                  <Text style={styles.boldText}>Action Required: </Text>
                  Check upcoming road signs for the new speed limit. Only increase your speed once you have completely passed this sign.
                </Text>
              </View>
            </View>
          </View>
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
    width: 40,
    height: 40,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  headerTitle: {
    color: homePalette.white,
    fontSize: 19,
    fontWeight: '800',
    letterSpacing: 0.5,
    textAlign: 'center',
    flex: 1,
  },
  headerSpacer: {
    width: 40,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 36 + homeInsets.bottomSafeInset,
  },
  imageCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E2ECF3',
    shadowColor: '#17344E',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#163047',
    marginBottom: 12,
    letterSpacing: 0.2,
  },
  signDetailCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E7EEF3',
    shadowColor: '#8CA0B3',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
    gap: 12,
  },
  signIconWrap: {
    width: 46,
    height: 46,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  signDetailCopy: {
    flex: 1,
  },
  signDetailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
    gap: 6,
  },
  signDetailTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#163047',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  statusBadgeText: {
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  signDetailDescription: {
    fontSize: 13,
    color: '#5C7184',
    lineHeight: 18,
    marginBottom: 8,
  },
  ruleBox: {
    backgroundColor: '#F4FAF5',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#2E7D32',
  },
  ruleBoxDanger: {
    backgroundColor: '#FDF3F3',
    borderLeftColor: '#C62828',
  },
  ruleBoxText: {
    fontSize: 12,
    color: '#1E4620',
    lineHeight: 16,
  },
  ruleBoxDangerText: {
    color: '#6B1212',
  },
  ruleBoxWarning: {
    backgroundColor: '#FFF8E1',
    borderLeftColor: '#E65100',
  },
  ruleBoxWarningText: {
    color: '#4E3600',
  },
  ruleBoxInfo: {
    backgroundColor: '#E8F0FE',
    borderLeftColor: '#1565C0',
  },
  ruleBoxInfoText: {
    color: '#0D3B66',
  },
  boldText: {
    fontWeight: '700',
  },
});

export default SignsGivingOrdersScreen;
