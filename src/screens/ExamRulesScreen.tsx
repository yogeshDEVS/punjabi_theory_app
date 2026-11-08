import React from 'react';
import {Pressable, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, View} from 'react-native';
import {MaterialIcons} from '@react-native-vector-icons/material-icons';

import {homeInsets} from '../features/home/theme';
import {
  mockExamDurationSeconds,
  mockExamPassMark,
  mockExamTargetQuestionCount,
} from '../features/theory/mockExamData';

interface ExamRulesScreenProps {
  onBack: () => void;
  onStart: () => void;
}

const guidelines = [
  {icon: 'timer', title: '57 minutes', copy: 'The countdown starts as soon as you begin the exam.'},
  {icon: 'format-list-numbered', title: '50 questions', copy: 'Each question is worth one mark. You can change an answer before submitting.'},
  {icon: 'navigate-next', title: 'Move freely', copy: 'Use Previous and Next to review questions in any order.'},
  {icon: 'assignment-turned-in', title: 'Submit on time', copy: 'The exam submits automatically when time runs out. You can also submit early.'},
] as const;

function ExamRulesScreen({onBack, onStart}: ExamRulesScreenProps): React.JSX.Element {
  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar barStyle="light-content" backgroundColor="#294D60" />
      <View style={styles.header}>
        <Pressable onPress={onBack} style={styles.backButton} accessibilityLabel="Back to home">
          <MaterialIcons name="arrow-back" size={24} color="#FFFFFF" />
        </Pressable>
        <Text style={styles.headerTitle}>UK LEARNER MOCK EXAM</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.heroIcon}><MaterialIcons name="assignment-turned-in" size={45} color="#1662B3" /></View>
        <Text style={styles.title}>Ready to start?</Text>
        <Text style={styles.intro}>Prepare for the UK learner driving theory test with a timed mock exam.</Text>

        <View style={styles.summaryRow}>
          <View style={styles.summaryItem}><Text style={styles.summaryValue}>{mockExamTargetQuestionCount}</Text><Text style={styles.summaryLabel}>QUESTIONS</Text></View>
          <View style={styles.divider} />
          <View style={styles.summaryItem}><Text style={styles.summaryValue}>{Math.floor(mockExamDurationSeconds / 60)} min</Text><Text style={styles.summaryLabel}>TIME LIMIT</Text></View>
        </View>

        <View style={styles.passMarkCard}>
          <View style={styles.passMarkIcon}><MaterialIcons name="emoji-events" size={23} color="#B06E12" /></View>
          <View>
            <Text style={styles.passMarkLabel}>PASSING MARK</Text>
            <Text style={styles.passMarkValue}>{mockExamPassMark}/{mockExamTargetQuestionCount}</Text>
          </View>
        </View>

        <Text style={styles.guidelinesTitle}>General guidelines</Text>
        <View style={styles.guidelinesCard}>
          {guidelines.map((guideline, index) => (
            <View key={guideline.title} style={[styles.guideline, index < guidelines.length - 1 && styles.guidelineBorder]}>
              <View style={styles.guidelineIcon}><MaterialIcons name={guideline.icon} size={22} color="#1662B3" /></View>
              <View style={styles.guidelineCopy}><Text style={styles.guidelineTitle}>{guideline.title}</Text><Text style={styles.guidelineText}>{guideline.copy}</Text></View>
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Pressable onPress={onStart} style={styles.startButton}>
          <Text style={styles.startText}>Start mock exam</Text>
          <MaterialIcons name="arrow-forward" size={22} color="#FFFFFF" />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {flex: 1, backgroundColor: '#EEF4FB'},
  header: {minHeight: 68, backgroundColor: '#294D60', paddingHorizontal: 16, paddingTop: homeInsets.androidTopInset + 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'},
  backButton: {width: 44, height: 44, alignItems: 'center', justifyContent: 'center'},
  headerTitle: {color: '#FFFFFF', fontSize: 18, fontWeight: '900', letterSpacing: 0.7},
  headerSpacer: {width: 44},
  content: {flexGrow: 1, paddingHorizontal: 20, paddingTop: 28, paddingBottom: 32},
  heroIcon: {alignSelf: 'center', width: 86, height: 86, borderRadius: 43, backgroundColor: '#D9ECFD', alignItems: 'center', justifyContent: 'center'},
  title: {color: '#294D60', fontSize: 27, fontWeight: '900', textAlign: 'center', marginTop: 16},
  intro: {color: '#607B8E', fontSize: 15, lineHeight: 22, textAlign: 'center', marginTop: 8},
  summaryRow: {backgroundColor: '#FFFFFF', borderRadius: 18, marginTop: 24, paddingVertical: 15, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', borderWidth: 1, borderColor: '#D7E3EF'},
  summaryItem: {flex: 1, alignItems: 'center'},
  summaryValue: {color: '#1662B3', fontSize: 19, fontWeight: '900'},
  summaryLabel: {color: '#668194', fontSize: 9, fontWeight: '800', marginTop: 4},
  divider: {width: 1, height: 34, backgroundColor: '#DCE7F0'},
  passMarkCard: {marginTop: 12, backgroundColor: '#FFF8E7', borderRadius: 16, padding: 14, borderWidth: 1, borderColor: '#F0D79A', flexDirection: 'row', alignItems: 'center', gap: 12},
  passMarkIcon: {width: 42, height: 42, borderRadius: 13, backgroundColor: '#FFEDB8', alignItems: 'center', justifyContent: 'center'},
  passMarkLabel: {color: '#8B681F', fontSize: 10, fontWeight: '900', letterSpacing: 0.8},
  passMarkValue: {color: '#76530F', fontSize: 19, fontWeight: '900', marginTop: 2},
  guidelinesTitle: {color: '#294D60', fontSize: 19, fontWeight: '900', marginTop: 25, marginBottom: 10},
  guidelinesCard: {backgroundColor: '#FFFFFF', borderRadius: 18, paddingHorizontal: 15, borderWidth: 1, borderColor: '#D7E3EF'},
  guideline: {paddingVertical: 14, flexDirection: 'row'},
  guidelineBorder: {borderBottomWidth: 1, borderBottomColor: '#E5EDF4'},
  guidelineIcon: {width: 42, height: 42, borderRadius: 13, backgroundColor: '#E8F2FC', alignItems: 'center', justifyContent: 'center', marginRight: 12},
  guidelineCopy: {flex: 1},
  guidelineTitle: {color: '#294D60', fontSize: 15, fontWeight: '800'},
  guidelineText: {color: '#668194', fontSize: 13, lineHeight: 18, marginTop: 3},
  footer: {paddingHorizontal: 16, paddingTop: 16, paddingBottom: 16 + homeInsets.bottomSafeInset, backgroundColor: '#FFFFFF', borderTopWidth: 1, borderColor: '#D7E3EF'},
  startButton: {minHeight: 53, borderRadius: 15, backgroundColor: '#1662B3', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8},
  startText: {color: '#FFFFFF', fontSize: 16, fontWeight: '900'},
});

export default ExamRulesScreen;
