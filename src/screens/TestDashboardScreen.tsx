import React from 'react';
import {SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, View} from 'react-native';

import BottomTabBar from '../components/home/BottomTabBar';
import {mockExamPassMark, mockExamQuestions} from '../features/theory/mockExamData';
import type {ExamResult} from './ExamScreen';

interface TestDashboardScreenProps {
  attempts: ExamResult[];
  onHome: () => void;
  onPractice: () => void;
  onMock: () => void;
}

function score(result: ExamResult) {
  return mockExamQuestions.filter(question =>
    question.options.some(option => option.correct && result.answers[question.id] === option.id),
  ).length;
}

function TestDashboardScreen({attempts, onHome, onPractice, onMock}: TestDashboardScreenProps): React.JSX.Element {
  const scores = attempts.map(score);
  const average = scores.length ? Math.round(scores.reduce((sum, value) => sum + value, 0) / scores.length) : 0;
  const best = scores.length ? Math.max(...scores) : 0;

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar barStyle="light-content" backgroundColor="#294D60" />
      <View style={styles.header}><Text style={styles.title}>TEST DASHBOARD</Text><Text style={styles.subtitle}>Your learner theory-test progress</Text></View>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}><Text style={styles.heroLabel}>MOCK EXAMS COMPLETED</Text><Text style={styles.heroValue}>{attempts.length}</Text><Text style={styles.heroCopy}>Keep practising to build confidence.</Text></View>
        <View style={styles.stats}>
          <View style={styles.statCard}><Text style={styles.statValue}>{average}/50</Text><Text style={styles.statLabel}>AVERAGE SCORE</Text></View>
          <View style={styles.statCard}><Text style={styles.statValue}>{best}/50</Text><Text style={styles.statLabel}>BEST SCORE</Text></View>
          <View style={styles.statCard}><Text style={styles.statValue}>{scores.filter(value => value >= mockExamPassMark).length}</Text><Text style={styles.statLabel}>PASSES</Text></View>
        </View>
        <Text style={styles.sectionTitle}>Performance trend</Text>
        <View style={styles.chartCard}>
          {attempts.length ? <View style={styles.chart}>{attempts.slice(0, 8).reverse().map((attempt, index) => <View key={attempt.completedAt} style={styles.barGroup}><View style={styles.barTrack}><View style={[styles.bar, {height: `${Math.max(8, (score(attempt) / 50) * 100)}%`}]} /></View><Text style={styles.barLabel}>T{index + 1}</Text></View>)}</View> : <Text style={styles.empty}>Complete a mock exam to see your performance graph.</Text>}
          <Text style={styles.passLine}>Pass mark: {mockExamPassMark}/50</Text>
        </View>
        <Text style={styles.sectionTitle}>Test reports</Text>
        {attempts.length ? attempts.map((attempt, index) => { const result = score(attempt); const passed = result >= mockExamPassMark; return <View key={attempt.completedAt} style={styles.report}><View><Text style={styles.reportTitle}>Mock Exam {attempts.length - index}</Text><Text style={styles.reportDate}>{new Date(attempt.completedAt).toLocaleDateString()}</Text></View><View style={styles.reportScore}><Text style={[styles.reportValue, {color: passed ? '#218568' : '#C15A45'}]}>{result}/50</Text><Text style={styles.reportStatus}>{passed ? 'PASSED' : 'NOT PASSED'}</Text></View></View>; }) : <View style={styles.emptyReport}><Text style={styles.empty}>No test reports yet.</Text></View>}
      </ScrollView>
      <BottomTabBar activeTab="dashboard" onTabPress={tab => { if (tab === 'learn') onHome(); if (tab === 'practice') onPractice(); if (tab === 'mock') onMock(); }} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {flex: 1, paddingTop: 10,   backgroundColor: '#EEF4FB'}, header: {backgroundColor: '#294D60', padding: 22, alignItems: 'center'}, title: {color: '#FFF', fontSize: 20, fontWeight: '900'}, subtitle: {color: '#CFE0EA', marginTop: 5}, content: {padding: 16, paddingBottom: 26}, hero: {backgroundColor: '#DDF1EA', borderRadius: 20, padding: 20}, heroLabel: {color: '#39745F', fontSize: 11, fontWeight: '900'}, heroValue: {color: '#174C3A', fontSize: 42, fontWeight: '900', marginTop: 4}, heroCopy: {color: '#477264'}, stats: {flexDirection: 'row', gap: 8, marginTop: 12}, statCard: {flex: 1, paddingVertical: 14, alignItems: 'center', borderRadius: 14, backgroundColor: '#FFF'}, statValue: {color: '#294D60', fontSize: 18, fontWeight: '900'}, statLabel: {color: '#688398', fontSize: 9, fontWeight: '800', textAlign: 'center', marginTop: 4}, sectionTitle: {color: '#294D60', fontSize: 19, fontWeight: '900', marginTop: 24, marginBottom: 10}, chartCard: {backgroundColor: '#FFF', borderRadius: 16, padding: 16}, chart: {height: 150, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-around'}, barGroup: {height: '100%', alignItems: 'center', justifyContent: 'flex-end'}, barTrack: {height: 122, width: 20, justifyContent: 'flex-end', backgroundColor: '#E5EDF4', borderRadius: 10, overflow: 'hidden'}, bar: {width: '100%', backgroundColor: '#3182CE', borderRadius: 10}, barLabel: {color: '#668194', fontSize: 10, marginTop: 6}, passLine: {color: '#668194', fontSize: 12, textAlign: 'right', marginTop: 8}, empty: {color: '#668194', textAlign: 'center', paddingVertical: 30}, report: {backgroundColor: '#FFF', borderRadius: 15, padding: 15, flexDirection: 'row', justifyContent: 'space-between', marginBottom: 9}, reportTitle: {color: '#294D60', fontWeight: '800'}, reportDate: {color: '#668194', fontSize: 12, marginTop: 4}, reportScore: {alignItems: 'flex-end'}, reportValue: {fontSize: 18, fontWeight: '900'}, reportStatus: {color: '#668194', fontSize: 10, fontWeight: '800'}, emptyReport: {backgroundColor: '#FFF', borderRadius: 15},
});

export default TestDashboardScreen;
