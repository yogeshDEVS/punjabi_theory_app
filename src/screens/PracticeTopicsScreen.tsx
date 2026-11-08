import React from 'react';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {MaterialIcons} from '@react-native-vector-icons/material-icons';

import PracticeSummaryStat from '../components/practice/PracticeSummaryStat';
import PracticeTopicCard from '../components/practice/PracticeTopicCard';
import {homeInsets} from '../features/home/theme';
import {theoryQuestions} from '../features/theory/data';
import {
  useAppSelector,
  selectFlaggedCount,
  selectVisitedQuestionIds,
} from '../store';

interface PracticeTopicsScreenProps {
  onBack: () => void;
  onRoadProceduresPress: () => void;
  onAlertnessPress?: () => void;
  onSafetyPress?: () => void;
  onHazardAwarenessPress?: () => void;
  onTrafficSignsPress?: () => void;
  onMotorwayRulesPress?: () => void;
  onVulnerableRoadUsersPress?: () => void;
  onAttitudePress?: () => void;
  onFlaggedPress?: () => void;
  seenCount?: number;
  flaggedCount?: number;
  totalQuestions?: number;
}

function PracticeTopicsScreen({
  onBack,
  onRoadProceduresPress,
  onAlertnessPress,
  onSafetyPress,
  onHazardAwarenessPress,
  onTrafficSignsPress,
  onMotorwayRulesPress,
  onVulnerableRoadUsersPress,
  onAttitudePress,
  onFlaggedPress,
  seenCount: propSeenCount,
  flaggedCount: propFlaggedCount,
  totalQuestions: propTotalQuestions,
}: PracticeTopicsScreenProps): React.JSX.Element {
  const reduxFlaggedCount = useAppSelector(selectFlaggedCount);
  const visitedQuestionIds = useAppSelector(selectVisitedQuestionIds);
  const roadProcedureQuestionIds = new Set(
    theoryQuestions
      .filter(question => question.section !== 'Alertness' && question.section !== 'Safety' && question.section !== 'Hazard awareness' && question.section !== 'Traffic signs' && question.section !== 'Motorway rules' && question.section !== 'Vulnerable Road Users' && question.section !== 'Attitude')
      .map(question => question.id),
  );
  const roadSeenCount = visitedQuestionIds.filter(id => roadProcedureQuestionIds.has(id)).length;
  const alertnessQuestionIds = new Set(
    theoryQuestions
      .filter(question => question.section === 'Alertness')
      .map(question => question.id),
  );
  const safetyQuestionIds = new Set(
    theoryQuestions.filter(question => question.section === 'Safety').map(question => question.id),
  );
  const hazardQuestionIds = new Set(
    theoryQuestions.filter(question => question.section === 'Hazard awareness').map(question => question.id),
  );
  const trafficSignsQuestionIds = new Set(
    theoryQuestions.filter(question => question.section === 'Traffic signs').map(question => question.id),
  );
  const motorwayRulesQuestionIds = new Set(
    theoryQuestions.filter(question => question.section === 'Motorway rules').map(question => question.id),
  );
  const vulnerableRoadUsersQuestionIds = new Set(
    theoryQuestions.filter(question => question.section === 'Vulnerable Road Users').map(question => question.id),
  );
  const attitudeQuestionIds = new Set(
    theoryQuestions.filter(question => question.section === 'Attitude').map(question => question.id),
  );
  const alertnessSeenCount = visitedQuestionIds.filter(id => alertnessQuestionIds.has(id)).length;
  const safetySeenCount = visitedQuestionIds.filter(id => safetyQuestionIds.has(id)).length;
  const hazardSeenCount = visitedQuestionIds.filter(id => hazardQuestionIds.has(id)).length;
  const trafficSignsSeenCount = visitedQuestionIds.filter(id => trafficSignsQuestionIds.has(id)).length;
  const motorwayRulesSeenCount = visitedQuestionIds.filter(id => motorwayRulesQuestionIds.has(id)).length;
  const vulnerableRoadUsersSeenCount = visitedQuestionIds.filter(id => vulnerableRoadUsersQuestionIds.has(id)).length;
  const attitudeSeenCount = visitedQuestionIds.filter(id => attitudeQuestionIds.has(id)).length;

  const seenCount = propSeenCount ?? visitedQuestionIds.length;
  const flaggedCount = propFlaggedCount ?? reduxFlaggedCount;
  const roadProcedureTotal = roadProcedureQuestionIds.size;
  const alertnessTotal = alertnessQuestionIds.size;
  const safetyTotal = safetyQuestionIds.size;
  const hazardTotal = hazardQuestionIds.size;
  const trafficSignsTotal = trafficSignsQuestionIds.size;
  const motorwayRulesTotal = motorwayRulesQuestionIds.size;
  const vulnerableRoadUsersTotal = vulnerableRoadUsersQuestionIds.size;
  const attitudeTotal = attitudeQuestionIds.size;
  const totalQuestions = propTotalQuestions ?? theoryQuestions.length;
  const notSeenCount = Math.max(0, totalQuestions - seenCount);
  const roadProceduresProgress = roadProcedureTotal > 0
    ? Math.round((roadSeenCount / roadProcedureTotal) * 100)
    : 0;
  const alertnessProgress = Math.round((alertnessSeenCount / alertnessTotal) * 100);

  const stats = [
    {
      id: 'all',
      value: totalQuestions,
      label: 'ALL QUESTIONS',
      showArrow: false,
      circleColor: '#BFDFFA',
    },
    {
      id: 'seen',
      value: seenCount,
      label: 'SEEN',
      showArrow: false,
      circleColor: '#BFDFFA',
    },
    {
      id: 'unseen',
      value: notSeenCount,
      label: 'NOT SEEN',
      showArrow: false,
      circleColor: '#BFDFFA',
    },
    {
      id: 'flagged',
      value: flaggedCount,
      label: 'FLAGGED',
      showArrow: true,
      circleColor: '#FFFFFF',
      onPress: onFlaggedPress,
    },
  ];

  const topics = [
    {
      id: 'road-procedures',
      title: 'Road procedure',
      subtitle: `${roadSeenCount}/${roadProcedureTotal} Questions`,
      icon: 'crossroad',
      locked: false,
      progress: roadProceduresProgress,
    },
    {
      id: 'alertness',
      title: 'Alertness',
      subtitle: `${alertnessSeenCount}/${alertnessTotal} Questions`,
      icon: 'visibility',
      iconColor: '#7C5CDB',
      locked: false,
      progress: alertnessProgress,
    },
    {
      id: 'safety',
      title: 'Safety',
      subtitle: `${safetySeenCount}/${safetyTotal} Questions`,
      icon: 'health-and-safety',
      iconColor: '#2E9D76',
      locked: false,
      progress: Math.round((safetySeenCount / safetyTotal) * 100),
    },
    {
      id: 'hazard-awareness',
      title: 'Hazard awareness',
      subtitle: `${hazardSeenCount}/${hazardTotal} Questions`,
      icon: 'warning-amber',
      iconColor: '#E29A2D',
      locked: false,
      progress: Math.round((hazardSeenCount / hazardTotal) * 100),
    },
      {
        id: 'traffic-signs',
        title: 'Traffic signs and signals',
        subtitle: `${trafficSignsSeenCount}/${trafficSignsTotal} Questions`,
        icon: 'stop-sign',
        iconColor: '#E05345',
        locked: false,
        progress: Math.round((trafficSignsSeenCount / trafficSignsTotal) * 100),
      },
      {
        id: 'motorway-rules',
        title: 'Motorway rules',
        subtitle: `${motorwayRulesSeenCount}/${motorwayRulesTotal} Questions`,
        icon: 'directions-car',
        locked: false,
        progress: Math.round((motorwayRulesSeenCount / motorwayRulesTotal) * 100),
      },
      {
        id: 'vulnerable-road-users',
        title: 'Vulnerable Road Users',
        subtitle: `${vulnerableRoadUsersSeenCount}/${vulnerableRoadUsersTotal} Questions`,
        icon: 'accessibility',
        iconColor: '#C05A9E',
        locked: false,
        progress: Math.round((vulnerableRoadUsersSeenCount / vulnerableRoadUsersTotal) * 100),
      },
      {
        id: 'attitude',
        title: 'Attitude',
        subtitle: `${attitudeSeenCount}/${attitudeTotal} Questions`,
        icon: 'sentiment-satisfied-alt',
        iconColor: '#6B76C8',
        locked: false,
        progress: attitudeTotal > 0 ? Math.round((attitudeSeenCount / attitudeTotal) * 100) : 0,
      },
  ];

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="dark-content" backgroundColor="#D7ECFB" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {/* Top curved blue section */}
        <View style={styles.topBlueSection}>
          <SafeAreaView>
            <View style={styles.header}>
              <Pressable
                onPress={onBack}
                hitSlop={8}
                style={styles.headerButton}>
                <MaterialIcons name="arrow-back" size={26} color="#113E67" />
              </Pressable>
              <Text style={styles.headerTitle}>PRACTISE</Text>
              <Pressable hitSlop={8} style={styles.headerButton}>
                <MaterialIcons name="insights" size={26} color="#113E67" />
              </Pressable>
            </View>

            <Text style={styles.summaryTitle}>Practice Questions Summary</Text>

            <View style={styles.statsRow}>
              {stats.map(stat => (
                <PracticeSummaryStat
                  key={stat.id}
                  value={stat.value}
                  label={stat.label}
                  showArrow={stat.showArrow}
                  circleColor={stat.circleColor}
                  onPress={stat.onPress}
                />
              ))}
            </View>
          </SafeAreaView>
        </View>

        {/* Content area below top blue section */}
        <View style={styles.mainContent}>
          <Text style={styles.topicsTitle}>Practice topics</Text>

          {topics.map(topic => (
            <View key={topic.id} style={styles.topicWrap}>
              <PracticeTopicCard
                {...topic}
                onPress={
                  topic.id === 'road-procedures'
                    ? onRoadProceduresPress
                    : topic.id === 'alertness'
                      ? onAlertnessPress
                      : topic.id === 'safety'
                        ? onSafetyPress
                        : topic.id === 'hazard-awareness'
                          ? onHazardAwarenessPress
                          : topic.id === 'traffic-signs'
                            ? onTrafficSignsPress
                            : topic.id === 'motorway-rules'
                              ? onMotorwayRulesPress
                              : topic.id === 'vulnerable-road-users'
                                ? onVulnerableRoadUsersPress
                                : topic.id === 'attitude'
                                  ? onAttitudePress
                                  : undefined
                }
              />
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F7FAFD',
  },
  scrollContent: {
    paddingBottom: 36 + homeInsets.bottomSafeInset,
  },
  topBlueSection: {
    backgroundColor: '#D7ECFB',
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
    paddingTop: 36,
    paddingBottom: 28,
    shadowColor: '#8DB8DC',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 3,
  },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    color: '#113E67',
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  summaryTitle: {
    color: '#4B7395',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  mainContent: {
    paddingHorizontal: 16,
    paddingTop: 22,
  },
  topicsTitle: {
    color: '#103960',
    fontSize: 18,
    fontWeight: '700',
    marginTop: 18,
    marginBottom: 14,
  },
  topicWrap: {
    marginBottom: 12,
  },
});

export default PracticeTopicsScreen;
