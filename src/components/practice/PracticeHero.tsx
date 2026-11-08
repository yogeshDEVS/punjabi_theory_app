import React from 'react';
import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import {MaterialIcons} from '@react-native-vector-icons/material-icons';

import {brandLogo} from '../../features/home/data';
import {homePalette} from '../../features/home/theme';

interface PracticeHeroProps {
  onBack: () => void;
}

function PracticeHero({onBack}: PracticeHeroProps): React.JSX.Element {
  return (
    <View style={styles.hero}>
      <View style={styles.topRow}>
        <Pressable style={styles.backButton} onPress={onBack}>
          <MaterialIcons name="arrow-back" size={22} color={homePalette.white} />
        </Pressable>

        <View style={styles.brandPill}>
          <Text style={styles.brandPillText}>Punjabi Theory</Text>
        </View>
      </View>

      <Text style={styles.title}>Please choose test</Text>
      <Text style={styles.subtitle}>ਆਪਣਾ ਅਭਿਆਸ ਮੋਡ ਚੁਣੋ</Text>

      <Image source={brandLogo} style={styles.logo} resizeMode="contain" />
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 30,
    backgroundColor: homePalette.heroStart,
    borderBottomLeftRadius: 34,
    borderBottomRightRadius: 34,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 26,
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandPill: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  brandPillText: {
    color: homePalette.white,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  title: {
    color: homePalette.white,
    textAlign: 'center',
    fontSize: 32,
    lineHeight: 38,
    fontWeight: '900',
    marginBottom: 6,
  },
  subtitle: {
    color: '#D7E8EF',
    textAlign: 'center',
    fontSize: 15,
    lineHeight: 21,
    fontWeight: '600',
    marginBottom: 18,
  },
  logo: {
    alignSelf: 'center',
    width: 180,
    height: 96,
  },
});

export default PracticeHero;
