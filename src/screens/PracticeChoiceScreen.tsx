import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';

import PracticeHero from '../components/practice/PracticeHero';
import PracticeOptionCard from '../components/practice/PracticeOptionCard';
import {practiceOptions} from '../features/practice/data';
import {homeInsets, homePalette} from '../features/home/theme';

interface PracticeChoiceScreenProps {
  onBack: () => void;
  onTheoryPress?: () => void;
}

function PracticeChoiceScreen({
  onBack,
  onTheoryPress,
}: PracticeChoiceScreenProps): React.JSX.Element {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={homePalette.heroStart} />

      <View style={styles.screen}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}>
          <PracticeHero onBack={onBack} />

          <View style={styles.panel}>
            <View style={styles.glowOne} />
            <View style={styles.glowTwo} />

            {practiceOptions.map(option => (
              <View key={option.id} style={styles.cardWrap}>
                <PracticeOptionCard 
                  {...option} 
                  onPress={option.id === 'theory' ? onTheoryPress : undefined}
                />
              </View>
            ))}
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
    paddingTop: 40
  },
  screen: {
    flex: 1,
    backgroundColor: homePalette.background,
  },
  content: {
    paddingHorizontal: 10,
    paddingBottom: 28 + homeInsets.bottomSafeInset,
  },
  panel: {
    marginTop: -10,
    backgroundColor: homePalette.shell,
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    paddingHorizontal: 18,
    paddingTop: 26,
    paddingBottom: 28,
    overflow: 'hidden',
  },
  glowOne: {
    position: 'absolute',
    top: 40,
    right: -30,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#E8F5F2',
  },
  glowTwo: {
    position: 'absolute',
    bottom: 40,
    left: -24,
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#FFF0E6',
  },
  cardWrap: {
    marginBottom: 16,
  },
});

export default PracticeChoiceScreen;
