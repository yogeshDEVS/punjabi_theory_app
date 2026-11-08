import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
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
import Tts, {Voice} from 'react-native-tts';

import {homeInsets} from '../features/home/theme';
import {theoryQuestions} from '../features/theory/data';
import {
  useAppDispatch,
  useAppSelector,
  selectFlaggedQuestionIds,
  selectVisitedQuestionIds,
} from '../store';
import {
  markQuestionVisited,
  toggleQuestionFlag,
} from '../store/practiceSlice';

interface TheoryTestScreenProps {
  onBack: () => void;
  initialQuestionId?: number;
  visitedQuestionIds?: number[];
  flaggedQuestionIds?: number[];
  onQuestionVisit?: (questionId: number) => void;
  onToggleFlag?: (questionId: number) => void;
}

type AnswerState = 'pending' | 'correct' | 'incorrect';

const HEADER_COLOR = '#294D60';

type PracticeLanguage = 'english' | 'punjabi' | 'hindi' | 'urdu' | 'gujarati' | 'bengali' | 'romanian' | 'tamil' | 'italian' | 'french' | 'polish' | 'spanish' | 'portuguese' | 'russian';
type QuestionTranslation = {question: string; options: string[]; explanation: string};

const practiceLanguageNames: Record<PracticeLanguage, string> = {
  english: 'English',
  punjabi: 'Punjabi',
  hindi: 'Hindi',
  urdu: 'Urdu',
  gujarati: 'Gujarati',
  bengali: 'Bengali',
  romanian: 'Romanian',
  tamil: 'Tamil',
  italian: 'Italian',
  french: 'French',
  polish: 'Polish',
  spanish: 'Spanish',
  portuguese: 'Portuguese',
  russian: 'Russian',
};

async function translatePracticeText(text: string, target: 'pa' | 'hi' | 'ur' | 'gu' | 'bn' | 'ro' | 'ta' | 'it' | 'fr' | 'pl' | 'es' | 'pt' | 'ru'): Promise<string> {
  const response = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${target}&dt=t&q=${encodeURIComponent(text)}`);
  const data = (await response.json()) as Array<Array<[string]>>;
  return data[0].map(part => part[0]).join('');
}

function TheoryTestScreen({
  onBack,
  visitedQuestionIds,
  flaggedQuestionIds: propFlaggedIds,
  onQuestionVisit,
  onToggleFlag,
  initialQuestionId,
}: TheoryTestScreenProps): React.JSX.Element {
  const dispatch = useAppDispatch();
  const reduxFlaggedIds = useAppSelector(selectFlaggedQuestionIds);
  const reduxVisitedIds = useAppSelector(selectVisitedQuestionIds);
  const activeFlaggedIds = propFlaggedIds ?? reduxFlaggedIds;
  const activeVisitedIds = visitedQuestionIds ?? reduxVisitedIds;

  const initialIndex = initialQuestionId == null
    ? 0
    : Math.max(0, theoryQuestions.findIndex(question => question.id === initialQuestionId));
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [showQuestionPalette, setShowQuestionPalette] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [answerState, setAnswerState] = useState<AnswerState>('pending');
  const [showExplanation, setShowExplanation] = useState(false);
  const [language, setLanguage] = useState<PracticeLanguage>('english');
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [translatedQuestion, setTranslatedQuestion] = useState<QuestionTranslation | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const translationCacheRef = useRef<Record<string, QuestionTranslation>>({});
  const [isNarrating, setIsNarrating] = useState(false);
  const isNarratingRef = useRef(false);
  const narrationQueueRef = useRef<string[]>([]);
  const narrationIndexRef = useRef(0);
  const narrationTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const currentQuestion = theoryQuestions[currentIndex];
  const hasPunjabiContent = Boolean(
    currentQuestion?.question.punjabi
    && currentQuestion.explanation.punjabi
    && currentQuestion.options.every(option => option.text.punjabi),
  );

  useEffect(() => {
    let active = true;
    if (language === 'english' || !currentQuestion || (language === 'punjabi' && hasPunjabiContent)) {
      setTranslatedQuestion(null);
      setIsTranslating(false);
      return () => { active = false; };
    }
    const key = `${language}-${currentQuestion.id}`;
    const cached = translationCacheRef.current[key];
    if (cached) {
      setTranslatedQuestion(cached);
      setIsTranslating(false);
      return () => { active = false; };
    }
    setTranslatedQuestion(null);
    setIsTranslating(true);
    const target = language === 'punjabi' ? 'pa' : language === 'hindi' ? 'hi' : language === 'urdu' ? 'ur' : language === 'gujarati' ? 'gu' : language === 'bengali' ? 'bn' : language === 'romanian' ? 'ro' : language === 'tamil' ? 'ta' : language === 'italian' ? 'it' : language === 'french' ? 'fr' : language === 'polish' ? 'pl' : language === 'spanish' ? 'es' : language === 'russian' ? 'ru' : 'pt';
    Promise.all([
      translatePracticeText(currentQuestion.question.english, target),
      ...currentQuestion.options.map(option => translatePracticeText(option.text.english, target)),
      translatePracticeText(currentQuestion.explanation.english, target),
    ]).then(([question, ...parts]) => {
      const translatedParts = [...parts];
      const explanation = translatedParts.pop() ?? '';
      const translation = {question, options: translatedParts, explanation};
      translationCacheRef.current[key] = translation;
      if (active) setTranslatedQuestion(translation);
    }).catch(() => {
      if (active) {
        setTranslatedQuestion(null);
        Alert.alert(
          'Translation unavailable',
          `We could not translate this question to ${practiceLanguageNames[language]}. The language server may be busy or unavailable. Please try again shortly or choose another language.`,
          [{text: 'Use English', onPress: () => setLanguage('english')}],
        );
      }
    }).finally(() => {
      if (active) setIsTranslating(false);
    });
    return () => { active = false; };
  }, [currentQuestion, hasPunjabiContent, language]);

  React.useEffect(() => {
    if (currentQuestion) {
      dispatch(markQuestionVisited(currentQuestion.id));
      onQuestionVisit?.(currentQuestion.id);
    }
  }, [currentIndex, currentQuestion, dispatch, onQuestionVisit]);

  const stopNarration = useCallback(() => {
    if (narrationTimerRef.current) {
      clearTimeout(narrationTimerRef.current);
      narrationTimerRef.current = null;
    }

    isNarratingRef.current = false;
    narrationQueueRef.current = [];
    narrationIndexRef.current = 0;
    setIsNarrating(false);
    Tts.stop().catch(() => undefined);
  }, []);

  const handleSpeechFinish = useCallback(() => {
    if (!isNarratingRef.current) {
      return;
    }

    const nextIndex = narrationIndexRef.current + 1;
    if (nextIndex >= narrationQueueRef.current.length) {
      stopNarration();
      return;
    }

    narrationIndexRef.current = nextIndex;
    narrationTimerRef.current = setTimeout(() => {
      if (isNarratingRef.current) {
        Tts.speak(narrationQueueRef.current[nextIndex]);
      }
    }, 1000);
  }, [stopNarration]);

  useEffect(() => {
    const handleSpeechError = () => stopNarration();

    const finishSubscription = Tts.addEventListener(
      'tts-finish',
      handleSpeechFinish,
    ) as unknown as {remove: () => void};
    const cancelSubscription = Tts.addEventListener(
      'tts-cancel',
      handleSpeechError,
    ) as unknown as {remove: () => void};
    const errorSubscription = Tts.addEventListener(
      'tts-error',
      handleSpeechError,
    ) as unknown as {remove: () => void};

    return () => {
      stopNarration();
      finishSubscription.remove();
      cancelSubscription.remove();
      errorSubscription.remove();
    };
  }, [handleSpeechFinish, stopNarration]);

  const isFlagged = currentQuestion
    ? activeFlaggedIds.includes(currentQuestion.id)
    : false;

  const resetQuestionState = () => {
    setSelectedAnswer(null);
    setAnswerState('pending');
    setShowExplanation(false);
  };

  const handleAnswerSelect = (optionId: string) => {
    if (answerState !== 'pending') {
      return;
    }

    const isCorrect = currentQuestion.options.find(
      option => option.id === optionId,
    )?.correct;

    setSelectedAnswer(optionId);
    setAnswerState(isCorrect ? 'correct' : 'incorrect');
  };

  const handlePrevious = () => {
    if (currentIndex === 0) {
      return;
    }

    stopNarration();
    setCurrentIndex(index => index - 1);
    resetQuestionState();
  };

  const handleNext = () => {
    if (currentIndex === theoryQuestions.length - 1) {
      Alert.alert('Test Complete', 'You have completed all questions!');
      onBack();
      return;
    }

    stopNarration();
    setCurrentIndex(index => index + 1);
    resetQuestionState();
  };

  const handleQuestionJump = (questionIndex: number) => {
    if (questionIndex === currentIndex) {
      setShowQuestionPalette(false);
      return;
    }

    stopNarration();
    setCurrentIndex(questionIndex);
    resetQuestionState();
    setShowQuestionPalette(false);
  };

  const handleFlag = () => {
    if (currentQuestion) {
      dispatch(toggleQuestionFlag(currentQuestion.id));
      onToggleFlag?.(currentQuestion.id);
      Alert.alert(
        isFlagged ? 'Question Unflagged' : 'Question Flagged',
        isFlagged
          ? 'This question has been removed from flagged questions.'
          : 'This question has been flagged for review.',
      );
    }
  };

  const findBritishFemaleVoice = (voices: Voice[]) => {
    const britishVoices = voices.filter(
      voice => voice.language.toLowerCase() === 'en-gb' && !voice.notInstalled,
    );
    const femaleVoice = britishVoices.find(voice =>
      /female|amy|emma|kate|serena|olivia|susan|hazel|libby/i.test(voice.name),
    );

    return femaleVoice ?? britishVoices[0];
  };

  const getNarrationText = () => {
    if (language === 'english') {
      return {question: currentQuestion.question.english, options: currentQuestion.options.map(option => option.text.english), questionLabel: 'Question', optionsLabel: 'The options are', optionLabel: 'Option'};
    }
    if (language === 'punjabi') {
      return {
        question: (translatedQuestion?.question ?? currentQuestion.question.punjabi) || currentQuestion.question.english,
        options: currentQuestion.options.map((option, index) =>
          (translatedQuestion?.options[index] ?? option.text.punjabi) || option.text.english,
        ),
        questionLabel: 'Question',
        optionsLabel: 'The options are',
        optionLabel: 'Option',
      };
    }
    return {
      question: translatedQuestion?.question ?? currentQuestion.question.english,
      options: currentQuestion.options.map((option, index) => translatedQuestion?.options[index] ?? option.text.english),
      questionLabel: 'Question',
      optionsLabel: 'The options are',
      optionLabel: 'Option',
    };
  };

  const handleNarration = async () => {
    if (isNarrating) {
      stopNarration();
      return;
    }

    if (language !== 'english' && !translatedQuestion && (language !== 'punjabi' || !hasPunjabiContent)) {
      Alert.alert('Translation unavailable', 'Please wait for the question translation to load, then try narration again.');
      return;
    }

    const narrationText = getNarrationText();
    const narrationQueue = currentQuestion.options.map((option, index) =>
      index === 0
        ? `${narrationText.questionLabel}. ${narrationText.question} ${narrationText.optionsLabel}. ${narrationText.optionLabel} ${option.label}. ${narrationText.options[index]}`
        : `${narrationText.optionLabel} ${option.label}. ${narrationText.options[index]}`,
    );

    try {
      await Tts.getInitStatus();
      const locale = language === 'hindi' ? 'hi-IN' : language === 'urdu' ? 'ur-PK' : language === 'punjabi' ? 'pa-IN' : language === 'gujarati' ? 'gu-IN' : language === 'bengali' ? 'bn-IN' : language === 'romanian' ? 'ro-RO' : language === 'tamil' ? 'ta-IN' : language === 'italian' ? 'it-IT' : language === 'french' ? 'fr-FR' : language === 'polish' ? 'pl-PL' : language === 'spanish' ? 'es-ES' : language === 'portuguese' ? 'pt-PT' : language === 'russian' ? 'ru-RU' : 'en-GB';
      let matchingVoice: Voice | undefined;
      try {
        const voices = await Tts.voices();
        matchingVoice = language === 'english'
          ? findBritishFemaleVoice(voices)
          : voices.find(voice => voice.language.toLowerCase().startsWith(`${locale.split('-')[0]}-`) && !voice.notInstalled);
      } catch {
        // Continue with the device default voice.
      }
      // Punjabi voice locales vary by Android device. Prefer the locale reported
      // by an installed Punjabi voice instead of always forcing pa-IN.
      try {
        await Tts.setDefaultLanguage(matchingVoice?.language ?? locale);
      } catch {
        if (language === 'punjabi') {
          try {
            await Tts.setDefaultLanguage('pa');
          } catch {
            // Continue with the system default voice as a last fallback.
          }
        }
      }
      try {
        if (matchingVoice) await Tts.setDefaultVoice(matchingVoice.id);
      } catch {
        // Voice selection is optional; use the system default voice.
      }

      try {
        await Tts.setDefaultRate(0.46);
      } catch {
        // Keep the device's default speech rate when it can't be changed.
      }
      narrationQueueRef.current = narrationQueue;
      narrationIndexRef.current = 0;
      isNarratingRef.current = true;
      setIsNarrating(true);
      Tts.speak(narrationQueue[0]);
    } catch {
      stopNarration();
      Alert.alert(
        'Narration unavailable',
        'Text-to-speech could not start. Check your device volume and text-to-speech settings, then try again.',
      );
    }
  };

  const getOptionState = (optionId: string, isCorrect: boolean) => {
    if (answerState === 'pending') {
      return styles.optionRowDefault;
    }

    if (isCorrect) {
      return styles.optionRowCorrect;
    }

    if (selectedAnswer === optionId) {
      return styles.optionRowIncorrect;
    }

    return styles.optionRowDefault;
  };

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="light-content" backgroundColor={HEADER_COLOR} />

      <SafeAreaView style={styles.topSafeArea}>
        <View style={styles.header}>
          <Pressable onPress={onBack} style={styles.headerSide}>
            <Text style={styles.headerAction}>Exit</Text>
          </Pressable>

          <Text numberOfLines={1} style={styles.headerTitle}>
            {currentQuestion.section}
          </Text>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Question ${currentIndex + 1} of ${theoryQuestions.length}. Open question list.`}
            accessibilityState={{expanded: showQuestionPalette}}
            onPress={() => setShowQuestionPalette(value => !value)}
            style={[styles.headerSide, styles.headerSideEnd, styles.questionCounterButton]}>
            <Text style={styles.headerCounter}>
              {currentIndex + 1} of {theoryQuestions.length}
            </Text>
            <MaterialIcons
              name={showQuestionPalette ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
              size={20}
              color="#FFFFFF"
            />
          </Pressable>
        </View>
        {showQuestionPalette ? (
          <View style={styles.questionPalette}>
            <Text style={styles.paletteTitle}>Go to question</Text>
            <ScrollView
              style={styles.paletteScroll}
              contentContainerStyle={styles.paletteGrid}
              showsVerticalScrollIndicator>
              {theoryQuestions.map((question, index) => {
                const isCurrent = index === currentIndex;
                const isFlaggedQuestion = activeFlaggedIds.includes(question.id);
                const isVisited = activeVisitedIds.includes(question.id);
                return (
                  <Pressable
                    key={question.id}
                    accessibilityRole="button"
                    accessibilityLabel={`Go to question ${index + 1}${isCurrent ? ', current question' : ''}${isVisited ? ', visited' : ', not visited'}${isFlaggedQuestion ? ', flagged' : ''}`}
                    onPress={() => handleQuestionJump(index)}
                    style={[
                      styles.paletteNumber,
                      isVisited && styles.paletteNumberVisited,
                      isFlaggedQuestion && styles.paletteNumberFlagged,
                      isCurrent && styles.paletteNumberCurrent,
                    ]}>
                    <Text style={[styles.paletteNumberText, isCurrent && styles.paletteNumberTextCurrent]}>
                      {index + 1}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
            <View style={styles.paletteLegend}>
              <Text style={styles.paletteLegendText}>Blue: seen</Text>
              <Text style={styles.paletteLegendText}>Red: flagged</Text>
            </View>
          </View>
        ) : null}
      </SafeAreaView>

      <View style={styles.safeArea}>
        <ScrollView
          style={styles.body}
          contentContainerStyle={styles.bodyContent}
          showsVerticalScrollIndicator={false}>
          <View style={styles.questionPanel}>
            <View style={styles.languageRow}>
              <View style={styles.languageStatus}>
                {isTranslating ? <ActivityIndicator size="small" color="#1662B3" /> : null}
                <Text style={styles.languageHint}>{isTranslating ? `Translating to ${practiceLanguageNames[language]}...` : 'Question language'}</Text>
              </View>
              <Pressable onPress={() => setShowLanguageMenu(value => !value)} style={styles.languageButton} accessibilityRole="button">
                <MaterialIcons name="translate" size={17} color="#1662B3" />
                <Text style={styles.languageButtonText}>{practiceLanguageNames[language]}</Text>
                <MaterialIcons name="arrow-drop-down" size={20} color="#1662B3" />
              </Pressable>
            </View>
            {showLanguageMenu ? (
              <View style={styles.languageMenu}>
                <Pressable onPress={() => { stopNarration(); setLanguage('english'); setShowLanguageMenu(false); }} style={styles.languageOption}><Text style={styles.languageOptionText}>English</Text></Pressable>
                <Pressable onPress={() => { stopNarration(); setLanguage('punjabi'); setShowLanguageMenu(false); }} style={styles.languageOption}><Text style={styles.languageOptionText}>Punjabi</Text></Pressable>
                <Pressable onPress={() => { stopNarration(); setLanguage('hindi'); setShowLanguageMenu(false); }} style={styles.languageOption}><Text style={styles.languageOptionText}>Hindi (हिन्दी)</Text></Pressable>
                <Pressable onPress={() => { stopNarration(); setLanguage('urdu'); setShowLanguageMenu(false); }} style={styles.languageOption}><Text style={styles.languageOptionText}>Urdu (اردو)</Text></Pressable>
                <Pressable onPress={() => { stopNarration(); setLanguage('gujarati'); setShowLanguageMenu(false); }} style={styles.languageOption}><Text style={styles.languageOptionText}>Gujarati</Text></Pressable>
                <Pressable onPress={() => { stopNarration(); setLanguage('bengali'); setShowLanguageMenu(false); }} style={styles.languageOption}><Text style={styles.languageOptionText}>Bengali</Text></Pressable>
                <Pressable onPress={() => { stopNarration(); setLanguage('romanian'); setShowLanguageMenu(false); }} style={styles.languageOption}><Text style={styles.languageOptionText}>Romanian</Text></Pressable>
                <Pressable onPress={() => { stopNarration(); setLanguage('tamil'); setShowLanguageMenu(false); }} style={styles.languageOption}><Text style={styles.languageOptionText}>Tamil</Text></Pressable>
                <Pressable onPress={() => { stopNarration(); setLanguage('italian'); setShowLanguageMenu(false); }} style={styles.languageOption}><Text style={styles.languageOptionText}>Italian</Text></Pressable>
                <Pressable onPress={() => { stopNarration(); setLanguage('french'); setShowLanguageMenu(false); }} style={styles.languageOption}><Text style={styles.languageOptionText}>French</Text></Pressable>
                <Pressable onPress={() => { stopNarration(); setLanguage('polish'); setShowLanguageMenu(false); }} style={styles.languageOption}><Text style={styles.languageOptionText}>Polish</Text></Pressable>
                <Pressable onPress={() => { stopNarration(); setLanguage('spanish'); setShowLanguageMenu(false); }} style={styles.languageOption}><Text style={styles.languageOptionText}>Spanish</Text></Pressable>
                <Pressable onPress={() => { stopNarration(); setLanguage('portuguese'); setShowLanguageMenu(false); }} style={styles.languageOption}><Text style={styles.languageOptionText}>Portuguese</Text></Pressable>
                <Pressable onPress={() => { stopNarration(); setLanguage('russian'); setShowLanguageMenu(false); }} style={styles.languageOption}><Text style={styles.languageOptionText}>Russian</Text></Pressable>
              </View>
            ) : null}
            <View style={styles.questionTextBlock}>
              <Text style={[styles.questionText, language === 'urdu' && styles.rtlText]}>
                {language === 'english' ? currentQuestion.question.english : language === 'punjabi' ? (translatedQuestion?.question ?? currentQuestion.question.punjabi) || currentQuestion.question.english : translatedQuestion?.question ?? currentQuestion.question.english}
              </Text>
              {language === 'english' ? <Text style={styles.questionPunjabiText}>{currentQuestion.question.punjabi}</Text> : null}
            </View>

            <View style={styles.promptRow}>
              <Text style={styles.promptText}>MARK ONE ANSWER</Text>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={
                  isNarrating
                    ? 'Stop question narration'
                    : 'Read question and options aloud'
                }
                onPress={handleNarration}
                style={styles.audioButton}>
                <MaterialIcons
                  name={isNarrating ? 'stop' : 'volume-up'}
                  size={26}
                  color="#FFFFFF"
                />
              </Pressable>
            </View>

            {showExplanation ? (
              <View style={styles.explanationCard}>
                <Text style={[styles.explanationText, language === 'urdu' && styles.rtlText]}>
                  {language === 'english' ? currentQuestion.explanation.english : language === 'punjabi' ? (translatedQuestion?.explanation ?? currentQuestion.explanation.punjabi) || currentQuestion.explanation.english : translatedQuestion?.explanation ?? currentQuestion.explanation.english}
                </Text>
                {language === 'english' ? <Text style={styles.explanationPunjabiText}>{currentQuestion.explanation.punjabi}</Text> : null}
              </View>
            ) : null}
          </View>

          <View style={styles.optionsList}>
            {currentQuestion.options.map(option => (
              <Pressable
                key={option.id}
                disabled={answerState !== 'pending'}
                onPress={() => handleAnswerSelect(option.id)}
                style={[styles.optionRow, getOptionState(option.id, option.correct)]}>
                <View style={styles.optionLabelWrap}>
                  <Text style={styles.optionLabel}>{option.label}</Text>
                </View>
                <View style={styles.optionTextWrap}>
                  <Text style={[styles.optionText, language === 'urdu' && styles.rtlText]}>
                    {language === 'english' ? option.text.english : language === 'punjabi' ? (translatedQuestion?.options[currentQuestion.options.indexOf(option)] ?? option.text.punjabi) || option.text.english : translatedQuestion?.options[currentQuestion.options.indexOf(option)] ?? option.text.english}
                  </Text>
                  {language === 'english' ? <Text style={styles.optionPunjabiText}>{option.text.punjabi}</Text> : null}
                </View>
              </Pressable>
            ))}
          </View>
        </ScrollView>

        <SafeAreaView style={styles.bottomSafeArea}>
          <View style={styles.footer}>
            <Pressable
              disabled={currentIndex === 0}
              onPress={handlePrevious}
              style={[styles.footerEdgeButton, styles.footerPrevButton, currentIndex === 0 && styles.footerDisabled]}>
              <MaterialIcons name="arrow-back" size={28} color="#1662B3" />
            </Pressable>

            <Pressable onPress={handleFlag} style={styles.footerAction}>
              <MaterialIcons
                name={isFlagged ? 'flag' : 'outlined-flag'}
                size={22}
                color={isFlagged ? '#E05345' : '#1662B3'}
              />
              <Text
                style={[
                  styles.footerActionText,
                  isFlagged && {color: '#E05345'},
                ]}>
                {isFlagged ? 'FLAGGED' : 'FLAG'}
              </Text>
            </Pressable>

            <Pressable
              onPress={() => setShowExplanation(value => !value)}
              style={styles.footerAction}>
              <MaterialIcons name="help-outline" size={22} color="#1662B3" />
              <Text style={styles.footerActionText}>EXPLAIN</Text>
            </Pressable>

            <Pressable
              onPress={handleNext}
              style={[styles.footerEdgeButton, styles.footerNextButton]}>
              <MaterialIcons name="arrow-forward" size={28} color="#FFFFFF" />
            </Pressable>
          </View>
        </SafeAreaView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: HEADER_COLOR,
    paddingTop:40
  },
  topSafeArea: {
    backgroundColor: HEADER_COLOR,
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#EAF0F7',
  },
  header: {
    backgroundColor: HEADER_COLOR,
    paddingTop: 10,
    paddingBottom: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerSide: {
    width: 88,
    justifyContent: 'center',
  },
  headerSideEnd: {
    alignItems: 'flex-end',
  },
  questionCounterButton: {
    width: 100,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 2,
  },
  headerAction: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
  },
  headerTitle: {
    flex: 1,
    color: '#FFFFFF',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '700',
    paddingHorizontal: 8,
  },
  headerCounter: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
  },
  questionPalette: {
    marginHorizontal: 14,
    marginBottom: 12,
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
  },
  paletteTitle: {
    color: '#21445F',
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 8,
  },
  paletteScroll: {
    maxHeight: 210,
  },
  paletteGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    gap: 8,
    paddingBottom: 4,
  },
  paletteNumber: {
    width: '12%',
    minWidth: 38,
    aspectRatio: 1,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E9EEF4',
    borderWidth: 1,
    borderColor: '#D6E0E9',
  },
  paletteNumberVisited: {
    backgroundColor: '#BFDFFA',
    borderColor: '#9CC7E9',
  },
  paletteNumberFlagged: {
    backgroundColor: '#F7D0D7',
    borderColor: '#E9A6B2',
  },
  paletteNumberCurrent: {
    backgroundColor: '#1662B3',
    borderColor: '#1662B3',
  },
  paletteNumberText: {
    color: '#294D60',
    fontSize: 14,
    fontWeight: '700',
  },
  paletteNumberTextCurrent: {
    color: '#FFFFFF',
  },
  paletteLegend: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 7,
  },
  paletteLegendText: {
    color: '#60798E',
    fontSize: 11,
  },
  body: {
    flex: 1,
  },
  bodyContent: {
    paddingBottom: 12,
  },
  questionPanel: {
    position: 'relative',
    backgroundColor: '#EEF4FB',
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 18,
    justifyContent: 'space-between',
    minHeight: 300,
  },
  languageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  languageHint: {color: '#68829A', fontSize: 12, fontWeight: '600'},
  languageStatus: {flexDirection: 'row', alignItems: 'center', gap: 6},
  languageButton: {flexDirection: 'row', alignItems: 'center', backgroundColor: '#E1EDF8', borderRadius: 12, paddingVertical: 6, paddingHorizontal: 8},
  languageButtonText: {color: '#1662B3', fontSize: 13, fontWeight: '800', marginHorizontal: 4},
  languageMenu: {position: 'absolute', top: 58, right: 24, minWidth: 160, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#D7E3EF', borderRadius: 12, overflow: 'hidden', elevation: 8, zIndex: 20},
  languageOption: {paddingHorizontal: 14, paddingVertical: 11},
  languageOptionText: {color: '#294D60', fontSize: 14, fontWeight: '700'},
  rtlText: {textAlign: 'right', writingDirection: 'rtl'},
  questionTextBlock: {
    gap: 10,
  },
  questionText: {
    color: '#37506A',
    fontSize: 20,
    lineHeight: 30,
    textAlign: 'center',
    fontWeight: '500',
  },
  questionPunjabiText: {
    color: '#37506A',
    fontSize: 18,
    lineHeight: 28,
    textAlign: 'center',
    fontWeight: '400',
  },
  promptRow: {
    marginTop: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    minHeight: 56,
    paddingRight: 64,
  },
  promptText: {
    color: '#1B62B2',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  audioButton: {
    position: 'absolute',
    right: 4,
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#283E63',
    alignItems: 'center',
    justifyContent: 'center',
  },
  explanationCard: {
    marginTop: 18,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#D8E2EF',
  },
  explanationText: {
    color: '#45607A',
    fontSize: 14,
    lineHeight: 21,
  },
  explanationPunjabiText: {
    color: '#45607A',
    fontSize: 14,
    lineHeight: 21,
    marginTop: 8,
  },
  optionsList: {
    backgroundColor: '#FFFFFF',
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 18,
    minHeight: 88,
    borderTopWidth: 1,
    borderTopColor: '#D7E3EF',
  },
  optionRowDefault: {
    backgroundColor: '#FFFFFF',
  },
  optionRowCorrect: {
    backgroundColor: '#CFEFE4',
  },
  optionRowIncorrect: {
    backgroundColor: '#F7D0D7',
  },
  optionLabelWrap: {
    width: 52,
    marginRight: 14,
    alignItems: 'center',
  },
  optionLabel: {
    color: '#0E3050',
    fontSize: 26,
    fontWeight: '500',
  },
  optionTextWrap: {
    flex: 1,
  },
  optionText: {
    color: '#21445F',
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '500',
  },
  optionPunjabiText: {
    color: '#21445F',
    fontSize: 15,
    lineHeight: 23,
    marginTop: 4,
    fontWeight: '400',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'stretch',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#D7E3EF',
  },
  bottomSafeArea: {
    backgroundColor: '#FFFFFF',
    paddingBottom: Platform.OS === 'android' ? homeInsets.bottomSafeInset + 14 : 0,
  },
  footerEdgeButton: {
    width: 72,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 68,
  },
  footerPrevButton: {
    backgroundColor: '#D8E9FB',
  },
  footerNextButton: {
    backgroundColor: '#1662B3',
  },
  footerDisabled: {
    opacity: 0.4,
  },
  footerAction: {
    flex: 1,
    minHeight: 68,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  footerActionText: {
    color: '#21445F',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
});

export default TheoryTestScreen;
