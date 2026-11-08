import React, {useState} from 'react';
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

import {homeInsets} from '../features/home/theme';
import {theoryQuestions} from '../features/theory/data';
import {
  useAppDispatch,
  useAppSelector,
  selectFlaggedQuestionIds,
} from '../store';
import {toggleQuestionFlag, unflagQuestion} from '../store/practiceSlice';

interface FlaggedQuestionsScreenProps {
  onBack: () => void;
  flaggedQuestionIds?: number[];
  onToggleFlag?: (questionId: number) => void;
}

const HEADER_COLOR = '#1E4A78';

function FlaggedQuestionsScreen({
  onBack,
  flaggedQuestionIds: propFlaggedIds,
  onToggleFlag,
}: FlaggedQuestionsScreenProps): React.JSX.Element {
  const dispatch = useAppDispatch();
  const reduxFlaggedIds = useAppSelector(selectFlaggedQuestionIds);
  const activeFlaggedIds = propFlaggedIds ?? reduxFlaggedIds;

  const flaggedQuestions = theoryQuestions.filter(q =>
    activeFlaggedIds.includes(q.id),
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const safeIndex = Math.min(
    Math.max(0, currentIndex),
    Math.max(0, flaggedQuestions.length - 1),
  );

  const currentQuestion = flaggedQuestions[safeIndex];

  const handlePrevious = () => {
    if (safeIndex > 0) {
      setCurrentIndex(safeIndex - 1);
    }
  };

  const handleNext = () => {
    if (safeIndex < flaggedQuestions.length - 1) {
      setCurrentIndex(safeIndex + 1);
    }
  };

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="light-content" backgroundColor={HEADER_COLOR} />

      {/* Header */}
      <SafeAreaView style={styles.topSafeArea}>
        <View style={styles.header}>
          <Pressable onPress={onBack} hitSlop={8} style={styles.headerButton}>
            <MaterialIcons name="arrow-back" size={26} color="#FFFFFF" />
          </Pressable>

          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>Flagged Questions</Text>
            <Text style={styles.headerSubtitle}>ਬੁੱਕਮਾਰਕ ਕੀਤੇ ਸਵਾਲ</Text>
          </View>

          <View style={styles.headerCounterBadge}>
            <MaterialIcons name="flag" size={14} color="#FFFFFF" />
            <Text style={styles.headerCounterText}>
              {flaggedQuestions.length}
            </Text>
          </View>
        </View>
      </SafeAreaView>

      {flaggedQuestions.length === 0 ? (
        /* Empty State */
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconCircle}>
            <MaterialIcons name="outlined-flag" size={54} color="#1E4A78" />
          </View>
          <Text style={styles.emptyTitle}>No Flagged Questions</Text>
          <Text style={styles.emptySubtitlePunjabi}>ਕੋਈ ਬੁੱਕਮਾਰਕ ਕੀਤਾ ਸਵਾਲ ਨਹੀਂ</Text>
          <Text style={styles.emptyDescription}>
            While practicing questions in the test, tap the FLAG button at the bottom of any question to bookmark it here for quick review with its answer and explanation.
          </Text>

          <Pressable onPress={onBack} style={styles.emptyBackButton}>
            <MaterialIcons name="arrow-back" size={18} color="#FFFFFF" />
            <Text style={styles.emptyBackButtonText}>Back to Dashboard</Text>
          </Pressable>
        </View>
      ) : (
        /* Flagged Questions Content */
        <View style={styles.contentShell}>
          {/* Question Switcher Pills if more than 1 question */}
          {flaggedQuestions.length > 1 ? (
            <View style={styles.pillsContainer}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.pillsScroll}>
                {flaggedQuestions.map((q, idx) => (
                  <Pressable
                    key={q.id}
                    onPress={() => setCurrentIndex(idx)}
                    style={[
                      styles.pill,
                      idx === safeIndex && styles.pillActive,
                    ]}>
                    <MaterialIcons
                      name="flag"
                      size={12}
                      color={idx === safeIndex ? '#FFFFFF' : '#1E4A78'}
                    />
                    <Text
                      style={[
                        styles.pillText,
                        idx === safeIndex && styles.pillTextActive,
                      ]}>
                      Q{q.id}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>
          ) : null}

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}>
            {/* Question Info Bar */}
            <View style={styles.questionMetaRow}>
              <View style={styles.sectionBadge}>
                <Text style={styles.sectionBadgeText}>
                  Question #{currentQuestion.id} • {currentQuestion.section}
                </Text>
              </View>

              <Pressable
                onPress={() => {
                  dispatch(unflagQuestion(currentQuestion.id));
                  onToggleFlag?.(currentQuestion.id);
                }}
                style={styles.unflagButton}>
                <MaterialIcons name="flag" size={16} color="#E05345" />
                <Text style={styles.unflagButtonText}>Remove Flag</Text>
              </Pressable>
            </View>

            {/* Question Card */}
            <View style={styles.questionCard}>
              <Text style={styles.questionTextEnglish}>
                {currentQuestion.question.english}
              </Text>
              <Text style={styles.questionTextPunjabi}>
                {currentQuestion.question.punjabi}
              </Text>
            </View>

            {/* Answer Options Section */}
            <Text style={styles.sectionHeading}>Answer Options</Text>

            <View style={styles.optionsList}>
              {currentQuestion.options.map(option => (
                <View
                  key={option.id}
                  style={[
                    styles.optionCard,
                    option.correct && styles.optionCardCorrect,
                  ]}>
                  <View
                    style={[
                      styles.optionLabelCircle,
                      option.correct && styles.optionLabelCircleCorrect,
                    ]}>
                    <Text
                      style={[
                        styles.optionLabelText,
                        option.correct && styles.optionLabelTextCorrect,
                      ]}>
                      {option.label}
                    </Text>
                  </View>

                  <View style={styles.optionTextWrap}>
                    <Text
                      style={[
                        styles.optionEnglish,
                        option.correct && styles.optionEnglishCorrect,
                      ]}>
                      {option.text.english}
                    </Text>
                    <Text
                      style={[
                        styles.optionPunjabi,
                        option.correct && styles.optionPunjabiCorrect,
                      ]}>
                      {option.text.punjabi}
                    </Text>
                  </View>

                  {option.correct ? (
                    <View style={styles.correctBadgeWrap}>
                      <MaterialIcons
                        name="check-circle"
                        size={22}
                        color="#10B981"
                      />
                    </View>
                  ) : null}
                </View>
              ))}
            </View>

            {/* Explanation Section */}
            <View style={styles.explanationCard}>
              <View style={styles.explanationHeader}>
                <MaterialIcons
                  name="lightbulb"
                  size={20}
                  color="#D97706"
                />
                <Text style={styles.explanationTitle}>
                  Explanation / ਵਿਆਖਿਆ
                </Text>
              </View>

              <Text style={styles.explanationEnglish}>
                {currentQuestion.explanation.english}
              </Text>
              <Text style={styles.explanationPunjabi}>
                {currentQuestion.explanation.punjabi}
              </Text>
            </View>
          </ScrollView>

          {/* Bottom Navigation Bar */}
          <SafeAreaView style={styles.bottomSafeArea}>
            <View style={styles.footer}>
              <Pressable
                disabled={safeIndex === 0}
                onPress={handlePrevious}
                style={[
                  styles.footerButton,
                  styles.footerButtonPrev,
                  safeIndex === 0 && styles.footerButtonDisabled,
                ]}>
                <MaterialIcons
                  name="arrow-back"
                  size={20}
                  color={safeIndex === 0 ? '#94A3B8' : '#1E4A78'}
                />
                <Text
                  style={[
                    styles.footerButtonText,
                    safeIndex === 0 && styles.footerButtonTextDisabled,
                  ]}>
                  Previous
                </Text>
              </Pressable>

              <Text style={styles.footerCounterText}>
                {safeIndex + 1} of {flaggedQuestions.length}
              </Text>

              <Pressable
                disabled={safeIndex === flaggedQuestions.length - 1}
                onPress={handleNext}
                style={[
                  styles.footerButton,
                  styles.footerButtonNext,
                  safeIndex === flaggedQuestions.length - 1 &&
                    styles.footerButtonDisabled,
                ]}>
                <Text
                  style={[
                    styles.footerButtonText,
                    safeIndex === flaggedQuestions.length - 1
                      ? styles.footerButtonTextDisabled
                      : styles.footerButtonTextNext,
                  ]}>
                  Next
                </Text>
                <MaterialIcons
                  name="arrow-forward"
                  size={20}
                  color={
                    safeIndex === flaggedQuestions.length - 1
                      ? '#94A3B8'
                      : '#FFFFFF'
                  }
                />
              </Pressable>
            </View>
          </SafeAreaView>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    paddingTop: Platform.OS === 'android' ? 36 : 0,
  },
  topSafeArea: {
    backgroundColor: HEADER_COLOR,
  },
  header: {
    backgroundColor: HEADER_COLOR,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
  },
  headerSubtitle: {
    color: '#BAE6FD',
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },
  headerCounterBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#E05345',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
  },
  headerCounterText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  contentShell: {
    flex: 1,
  },
  pillsContainer: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  pillsScroll: {
    paddingHorizontal: 14,
    gap: 8,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#EDF4FC',
    borderWidth: 1,
    borderColor: '#D4E2F2',
  },
  pillActive: {
    backgroundColor: '#1E4A78',
    borderColor: '#1E4A78',
  },
  pillText: {
    color: '#1E4A78',
    fontSize: 12,
    fontWeight: '700',
  },
  pillTextActive: {
    color: '#FFFFFF',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 24,
  },
  questionMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionBadge: {
    backgroundColor: '#E0EEFB',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  sectionBadgeText: {
    color: '#1E4A78',
    fontSize: 12,
    fontWeight: '700',
  },
  unflagButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  unflagButtonText: {
    color: '#DC2626',
    fontSize: 12,
    fontWeight: '700',
  },
  questionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    shadowColor: '#64748B',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  questionTextEnglish: {
    color: '#0F2744',
    fontSize: 17,
    fontWeight: '700',
    lineHeight: 25,
    marginBottom: 10,
  },
  questionTextPunjabi: {
    color: '#334E68',
    fontSize: 15,
    fontWeight: '500',
    lineHeight: 23,
  },
  sectionHeading: {
    color: '#1E3A5A',
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 10,
  },
  optionsList: {
    gap: 10,
    marginBottom: 18,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    shadowColor: '#64748B',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  optionCardCorrect: {
    backgroundColor: '#ECFDF5',
    borderColor: '#10B981',
  },
  optionLabelCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  optionLabelCircleCorrect: {
    backgroundColor: '#10B981',
  },
  optionLabelText: {
    color: '#334E68',
    fontSize: 14,
    fontWeight: '800',
  },
  optionLabelTextCorrect: {
    color: '#FFFFFF',
  },
  optionTextWrap: {
    flex: 1,
    paddingRight: 8,
  },
  optionEnglish: {
    color: '#1E293B',
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
    marginBottom: 3,
  },
  optionEnglishCorrect: {
    color: '#065F46',
    fontWeight: '700',
  },
  optionPunjabi: {
    color: '#64748B',
    fontSize: 13,
    lineHeight: 18,
  },
  optionPunjabiCorrect: {
    color: '#047857',
  },
  correctBadgeWrap: {
    paddingLeft: 4,
  },
  explanationCard: {
    backgroundColor: '#FFFBEB',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#FDE68A',
    marginBottom: 12,
  },
  explanationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  explanationTitle: {
    color: '#92400E',
    fontSize: 14,
    fontWeight: '800',
  },
  explanationEnglish: {
    color: '#78350F',
    fontSize: 13.5,
    lineHeight: 20,
    marginBottom: 8,
  },
  explanationPunjabi: {
    color: '#92400E',
    fontSize: 13,
    lineHeight: 19,
  },
  bottomSafeArea: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingBottom: Platform.OS === 'android' ? homeInsets.bottomSafeInset : 0,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
  },
  footerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  footerButtonPrev: {
    backgroundColor: '#EDF4FC',
  },
  footerButtonNext: {
    backgroundColor: '#1E4A78',
  },
  footerButtonDisabled: {
    backgroundColor: '#F1F5F9',
    opacity: 0.5,
  },
  footerButtonText: {
    color: '#1E4A78',
    fontSize: 14,
    fontWeight: '700',
  },
  footerButtonTextNext: {
    color: '#FFFFFF',
  },
  footerButtonTextDisabled: {
    color: '#94A3B8',
  },
  footerCounterText: {
    color: '#64748B',
    fontSize: 13,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    backgroundColor: '#F8FAFC',
  },
  emptyIconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#E2EEFB',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    color: '#0F2744',
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 4,
    textAlign: 'center',
  },
  emptySubtitlePunjabi: {
    color: '#4B6B94',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 14,
    textAlign: 'center',
  },
  emptyDescription: {
    color: '#64748B',
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 28,
  },
  emptyBackButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#1E4A78',
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 24,
    shadowColor: '#1E4A78',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  emptyBackButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});

export default FlaggedQuestionsScreen;
