import React from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';

import {homeInsets, homePalette} from '../../features/home/theme';

const homeBanner = require('../../images/banner.png');

interface BrandHeroProps {
  onMenuPress?: () => void;
}

function BrandHero({onMenuPress}: BrandHeroProps): React.JSX.Element {
  return (
    <View style={styles.hero}>
      <View style={styles.heroTopRow}>
        <Pressable style={styles.menuButton} onPress={onMenuPress}>
          <View style={styles.menuLine} />
          <View style={styles.menuLine} />
          <View style={[styles.menuLine, styles.menuLineShort]} />
        </Pressable>

        <View style={styles.heroTopSpacer} />
      </View>

      <View style={styles.logoCluster}>
        <Image source={homeBanner} style={styles.bannerImage} resizeMode="contain" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    paddingHorizontal: 10,
    paddingTop: homeInsets.androidTopInset + 10,
    paddingBottom: 14,
    backgroundColor: homePalette.heroStart,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  menuButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuLine: {
    width: 20,
    height: 2.5,
    borderRadius: 2,
    backgroundColor: homePalette.white,
    marginBottom: 4,
  },
  menuLineShort: {
    width: 14,
    marginBottom: 0,
  },
  heroTopSpacer: {
    width: 38,
    height: 38,
  },
  logoCluster: {
    alignItems: 'center',
  },
  bannerImage: {
    width: '100%',
    height: 140,
  },
});

export default BrandHero;
