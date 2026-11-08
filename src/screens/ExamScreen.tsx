import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
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

import {
  mockExamDurationSeconds,
  mockExamQuestions,
} from '../features/theory/mockExamData';
import {homeInsets} from '../features/home/theme';

export interface ExamResult {
  answers: Record<number, string>;
  completedAt: number;
  timeRemaining: number;
}

interface ExamScreenProps {
  onExit: () => void;
  onComplete: (result: ExamResult) => void;
}

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

async function translateText(text: string, targetLanguage: 'pa' | 'hi' | 'gu' | 'bn' | 'ur' | 'ro' | 'ta' | 'it' | 'fr' | 'pl' | 'es' | 'pt' | 'ru'): Promise<string> {
  const response = await fetch(
    `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLanguage}&dt=t&q=${encodeURIComponent(text)}`,
  );
  const data = (await response.json()) as Array<Array<[string]>>;
  return data[0].map(part => part[0]).join('');
}

function ExamScreen({onExit, onComplete}: ExamScreenProps): React.JSX.Element {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showQuestionPalette, setShowQuestionPalette] = useState(false);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [timeRemaining, setTimeRemaining] = useState(mockExamDurationSeconds);
  const [showExitConfirmation, setShowExitConfirmation] = useState(false);
  const [language, setLanguage] = useState<'english' | 'punjabi' | 'hindi' | 'gujarati' | 'bengali' | 'urdu' | 'romanian' | 'tamil' | 'italian' | 'french' | 'polish' | 'spanish' | 'portuguese' | 'russian'>('english');
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [translatedText, setTranslatedText] = useState<{question: string; options: string[]} | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [isNarrating, setIsNarrating] = useState(false);
  const hasCompletedRef = useRef(false);
  const isNarratingRef = useRef(false);
  const narrationQueueRef = useRef<string[]>([]);
  const narrationIndexRef = useRef(0);
  const narrationTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const translationCacheRef = useRef<Record<string, {question: string; options: string[]}>>({});

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
    const finishSubscription = Tts.addEventListener('tts-finish', handleSpeechFinish) as unknown as {remove: () => void};
    const cancelSubscription = Tts.addEventListener('tts-cancel', handleSpeechError) as unknown as {remove: () => void};
    const errorSubscription = Tts.addEventListener('tts-error', handleSpeechError) as unknown as {remove: () => void};
    return () => {
      stopNarration();
      finishSubscription.remove();
      cancelSubscription.remove();
      errorSubscription.remove();
    };
  }, [handleSpeechFinish, stopNarration]);

  const completeExam = useCallback(() => {
    if (hasCompletedRef.current) {
      return;
    }

    hasCompletedRef.current = true;
    onComplete({answers, completedAt: Date.now(), timeRemaining});
  }, [answers, onComplete, timeRemaining]);

  useEffect(() => {
    if (timeRemaining === 0) {
      completeExam();
      return;
    }

    const timer = setInterval(() => {
      setTimeRemaining(seconds => Math.max(0, seconds - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [completeExam, timeRemaining]);

  const currentQuestion = mockExamQuestions[currentIndex];
  const answeredCount = Object.keys(answers).length;
  const isLastQuestion = currentIndex === mockExamQuestions.length - 1;
  const questionText = language !== 'english'
    ? translatedText?.question || (language === 'punjabi' ? currentQuestion.question.punjabi : '') || currentQuestion.question.english
    : currentQuestion.question.english;

  const optionText = (index: number) => language !== 'english'
    ? translatedText?.options[index] || (language === 'punjabi' ? currentQuestion.options[index].text.punjabi : '') || currentQuestion.options[index].text.english
    : currentQuestion.options[index].text.english;

  useEffect(() => {
    let isActive = true;
    if (language === 'english') {
      setTranslatedText(null);
      setIsTranslating(false);
      return () => { isActive = false; };
    }
    const cacheKey = `${language}-${currentQuestion.id}`;
    const cachedTranslation = translationCacheRef.current[cacheKey];
    if (cachedTranslation) {
      setTranslatedText(cachedTranslation);
      return () => { isActive = false; };
    }
    setTranslatedText(null);
    setIsTranslating(true);
    const targetLanguage = language === 'punjabi' ? 'pa' : language === 'hindi' ? 'hi' : language === 'gujarati' ? 'gu' : language === 'bengali' ? 'bn' : language === 'urdu' ? 'ur' : language === 'romanian' ? 'ro' : language === 'tamil' ? 'ta' : language === 'italian' ? 'it' : language === 'french' ? 'fr' : language === 'polish' ? 'pl' : language === 'spanish' ? 'es' : language === 'russian' ? 'ru' : 'pt';
    Promise.all([
      translateText(currentQuestion.question.english, targetLanguage),
      ...currentQuestion.options.map(option => translateText(option.text.english, targetLanguage)),
    ])
      .then(([question, ...options]) => {
        const translation = {question, options};
        translationCacheRef.current[cacheKey] = translation;
        if (isActive) setTranslatedText(translation);
      })
      .catch(() => {
        if (isActive) {
          setTranslatedText(null);
          Alert.alert(
            'Translation unavailable',
            'The language server is busy or unavailable. Please try again shortly or choose another language.',
            [{text: 'Use English', onPress: () => setLanguage('english')}],
          );
        }
      })
      .finally(() => {
        if (isActive) setIsTranslating(false);
      });
    return () => { isActive = false; };
  }, [currentQuestion, language]);

  const handleNarration = async () => {
    if (isNarrating) {
      stopNarration();
      return;
    }
    const voice = (voices: Voice[]) => {
      const british = voices.filter(item => item.language.toLowerCase() === 'en-gb' && !item.notInstalled);
      return british.find(item => /female|amy|emma|kate|serena|olivia|susan|hazel|libby/i.test(item.name)) ?? british[0];
    };
    const queue = currentQuestion.options.map((option, index) => index === 0
      ? `Question. ${questionText} The options are. Option ${option.label}. ${optionText(index)}`
      : `Option ${option.label}. ${optionText(index)}`);
    try {
      await Tts.getInitStatus();
      const locale = language === 'hindi' ? 'hi-IN' : language === 'punjabi' ? 'pa-IN' : language === 'gujarati' ? 'gu-IN' : language === 'bengali' ? 'bn-BD' : language === 'urdu' ? 'ur-PK' : language === 'romanian' ? 'ro-RO' : language === 'tamil' ? 'ta-IN' : language === 'italian' ? 'it-IT' : language === 'french' ? 'fr-FR' : language === 'polish' ? 'pl-PL' : language === 'spanish' ? 'es-ES' : language === 'portuguese' ? 'pt-PT' : language === 'russian' ? 'ru-RU' : 'en-GB';
      let matchingVoice: Voice | undefined;
      try {
        const voices = await Tts.voices();
        matchingVoice = language === 'english'
          ? voice(voices)
          : voices.find(item => item.language.toLowerCase().startsWith(`${locale.split('-')[0]}-`) && !item.notInstalled);
      } catch {
        // Continue with the device default voice.
      }
      try {
        await Tts.setDefaultLanguage(matchingVoice?.language ?? locale);
      } catch {
        if (language === 'punjabi') {
          try {
            await Tts.setDefaultLanguage('pa');
          } catch {
            // Continue with the device default voice as a last fallback.
          }
        }
      }
      try {
        if (matchingVoice) await Tts.setDefaultVoice(matchingVoice.id);
      } catch {
        // Voice selection is optional; the device default remains usable.
      }
      try {
        await Tts.setDefaultRate(0.46);
      } catch {
        // Keep the device default rate.
      }
      narrationQueueRef.current = queue;
      narrationIndexRef.current = 0;
      isNarratingRef.current = true;
      setIsNarrating(true);
      Tts.speak(queue[0]);
    } catch {
      stopNarration();
      Alert.alert('Narration unavailable', 'Text-to-speech could not start. Check your device volume and text-to-speech settings, then try again.');
    }
  };

  const submitExam = () => {
    const unanswered = mockExamQuestions.length - answeredCount;
    const message = unanswered
      ? `You still have ${unanswered} unanswered question${unanswered === 1 ? '' : 's'}. Submit anyway?`
      : 'All questions have been answered. Submit your exam?';

    Alert.alert('Submit exam', message, [
      {text: 'Keep working', style: 'cancel'},
      {text: 'Submit', style: 'destructive', onPress: completeExam},
    ]);
  };

  const handleQuestionJump = (questionIndex: number) => {
    stopNarration();
    setCurrentIndex(questionIndex);
    setShowQuestionPalette(false);
  };

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar barStyle="light-content" backgroundColor="#294D60" />
      <View style={styles.header}>
        <Pressable onPress={() => setShowExitConfirmation(true)} style={styles.exitButton}>
          <Text style={styles.exitText}>Exit</Text>
        </Pressable>
        <View>
          <Text style={styles.headerTitle}>UK LEARNER MOCK EXAM</Text>
          <Text style={styles.headerSubTitle}>{mockExamQuestions.length} questions · 57 minutes</Text>
        </View>
        <View style={styles.timer}>
          <MaterialIcons name="timer" size={19} color="#FFFFFF" />
          <Text style={styles.timerText}>{formatTime(timeRemaining)}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.progressRow}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Question ${currentIndex + 1} of ${mockExamQuestions.length}. Open question list.`}
            accessibilityState={{expanded: showQuestionPalette}}
            onPress={() => setShowQuestionPalette(value => !value)}
            style={styles.questionCountButton}>
            <Text style={styles.questionCount}>Question {currentIndex + 1} of {mockExamQuestions.length}</Text>
            <MaterialIcons
              name={showQuestionPalette ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
              size={20}
              color="#1662B3"
            />
          </Pressable>
          <Text style={styles.answeredCount}>{answeredCount}/{mockExamQuestions.length} answered</Text>
        </View>
        {showQuestionPalette ? (
          <View style={styles.questionPalette}>
            <Text style={styles.paletteTitle}>Go to question</Text>
            <ScrollView
              nestedScrollEnabled
              style={styles.paletteScroll}
              contentContainerStyle={styles.paletteGrid}
              showsVerticalScrollIndicator>
              {mockExamQuestions.map((question, index) => {
                const isCurrent = index === currentIndex;
                const isAnswered = answers[question.id] !== undefined;
                return (
                  <Pressable
                    key={question.id}
                    accessibilityRole="button"
                    accessibilityLabel={`Go to question ${index + 1}${isCurrent ? ', current question' : ''}${isAnswered ? ', answered' : ', unanswered'}`}
                    onPress={() => handleQuestionJump(index)}
                    style={[
                      styles.paletteNumber,
                      isAnswered && styles.paletteNumberAnswered,
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
              <Text style={styles.paletteLegendText}>Green: answered</Text>
              <Text style={styles.paletteLegendText}>Grey: unanswered</Text>
            </View>
          </View>
        ) : null}
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, {width: `${((currentIndex + 1) / mockExamQuestions.length) * 100}%`}]} />
        </View>

        <View style={styles.questionCard}>
          <View style={styles.questionTopRow}>
            <Text style={styles.section}>{currentQuestion.section.toUpperCase()}</Text>
            <Pressable onPress={() => setShowLanguageMenu(value => !value)} style={styles.languageButton}>
              <MaterialIcons name="translate" size={17} color="#1662B3" />
              <Text style={styles.languageButtonText}>{language === 'english' ? 'English' : language === 'punjabi' ? 'Punjabi' : language === 'hindi' ? 'Hindi' : language === 'gujarati' ? 'Gujarati' : language === 'bengali' ? 'Bengali' : language === 'urdu' ? 'Urdu' : language === 'romanian' ? 'Romanian' : language === 'tamil' ? 'Tamil' : language === 'italian' ? 'Italian' : language === 'french' ? 'French' : language === 'polish' ? 'Polish' : language === 'spanish' ? 'Spanish' : language === 'russian' ? 'Russian' : 'Portuguese'}</Text>
              <MaterialIcons name="arrow-drop-down" size={18} color="#1662B3" />
            </Pressable>
          </View>
          {showLanguageMenu ? (
            <View style={styles.languageMenu}>
              <Pressable onPress={() => { setLanguage('english'); setShowLanguageMenu(false); }} style={styles.languageOption}><Text style={styles.languageOptionText}>English</Text></Pressable>
              <Pressable onPress={() => { setLanguage('punjabi'); setShowLanguageMenu(false); }} style={styles.languageOption}><Text style={styles.languageOptionText}>Punjabi</Text></Pressable>
              <Pressable onPress={() => { setLanguage('hindi'); setShowLanguageMenu(false); }} style={styles.languageOption}><Text style={styles.languageOptionText}>Hindi</Text></Pressable>
              <Pressable onPress={() => { setLanguage('gujarati'); setShowLanguageMenu(false); }} style={styles.languageOption}><Text style={styles.languageOptionText}>Gujarati (ગુજરાતી)</Text></Pressable>
              <Pressable onPress={() => { setLanguage('bengali'); setShowLanguageMenu(false); }} style={styles.languageOption}><Text style={styles.languageOptionText}>Bengali (বাংলা)</Text></Pressable>
              <Pressable onPress={() => { setLanguage('urdu'); setShowLanguageMenu(false); }} style={styles.languageOption}><Text style={styles.languageOptionText}>Urdu (اردو)</Text></Pressable>
              <Pressable onPress={() => { setLanguage('romanian'); setShowLanguageMenu(false); }} style={styles.languageOption}><Text style={styles.languageOptionText}>Romanian</Text></Pressable>
              <Pressable onPress={() => { setLanguage('tamil'); setShowLanguageMenu(false); }} style={styles.languageOption}><Text style={styles.languageOptionText}>Tamil</Text></Pressable>
              <Pressable onPress={() => { setLanguage('italian'); setShowLanguageMenu(false); }} style={styles.languageOption}><Text style={styles.languageOptionText}>Italian</Text></Pressable>
              <Pressable onPress={() => { setLanguage('french'); setShowLanguageMenu(false); }} style={styles.languageOption}><Text style={styles.languageOptionText}>French</Text></Pressable>
              <Pressable onPress={() => { setLanguage('polish'); setShowLanguageMenu(false); }} style={styles.languageOption}><Text style={styles.languageOptionText}>Polish</Text></Pressable>
              <Pressable onPress={() => { setLanguage('spanish'); setShowLanguageMenu(false); }} style={styles.languageOption}><Text style={styles.languageOptionText}>Spanish</Text></Pressable>
              <Pressable onPress={() => { setLanguage('portuguese'); setShowLanguageMenu(false); }} style={styles.languageOption}><Text style={styles.languageOptionText}>Portuguese</Text></Pressable>
              <Pressable onPress={() => { setLanguage('russian'); setShowLanguageMenu(false); }} style={styles.languageOption}><Text style={styles.languageOptionText}>Russian</Text></Pressable>
            </View>
          ) : null}
          {language !== 'english' && isTranslating ? <View style={styles.translatingRow}><ActivityIndicator size="small" color="#1662B3" /><Text style={styles.translatingText}>Translating to {language === 'punjabi' ? 'Punjabi' : language === 'hindi' ? 'Hindi' : language === 'gujarati' ? 'Gujarati' : language === 'bengali' ? 'Bengali' : language === 'urdu' ? 'Urdu' : language === 'romanian' ? 'Romanian' : language === 'tamil' ? 'Tamil' : language === 'italian' ? 'Italian' : language === 'french' ? 'French' : language === 'polish' ? 'Polish' : language === 'spanish' ? 'Spanish' : language === 'russian' ? 'Russian' : 'Portuguese'}...</Text></View> : null}
          <Text style={[styles.question, language === 'urdu' && styles.rtlText]}>{questionText}</Text>
          <View style={styles.promptRow}>
            <Text style={styles.prompt}>MARK ONE ANSWER</Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={isNarrating ? 'Stop question narration' : 'Read question and options aloud'}
              onPress={handleNarration}
              style={styles.audioButton}>
              <MaterialIcons name={isNarrating ? 'stop' : 'volume-up'} size={23} color="#FFFFFF" />
            </Pressable>
          </View>
        </View>

        <View style={styles.optionsList}>
          {currentQuestion.options.map((option, index) => {
            const selected = answers[currentQuestion.id] === option.id;
            return (
              <Pressable
                key={option.id}
                accessibilityRole="radio"
                accessibilityState={{selected}}
                onPress={() => setAnswers(value => ({...value, [currentQuestion.id]: option.id}))}
                style={[styles.option, selected && styles.optionSelected]}>
                <View style={[styles.optionLabel, selected && styles.optionLabelSelected]}>
                  <Text style={[styles.optionLabelText, selected && styles.optionLabelTextSelected]}>{option.label}</Text>
                </View>
                <Text style={[styles.optionText, language === 'urdu' && styles.rtlText]}>{optionText(index)}</Text>
                {selected ? <MaterialIcons name="check-circle" size={22} color="#1662B3" /> : null}
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      <SafeAreaView style={styles.footerSafeArea}>
        <View style={styles.footer}>
          <Pressable
            disabled={currentIndex === 0}
            onPress={() => { stopNarration(); setCurrentIndex(index => index - 1); }}
            style={[styles.navigationButton, currentIndex === 0 && styles.disabledButton]}>
            <MaterialIcons name="arrow-back" size={22} color="#1662B3" />
            <Text style={styles.previousText}>Previous</Text>
          </Pressable>
          {!isLastQuestion ? (
            <Pressable onPress={() => { stopNarration(); setCurrentIndex(index => index + 1); }} style={styles.nextButton}>
              <Text style={styles.nextText}>Next</Text>
              <MaterialIcons name="arrow-forward" size={22} color="#FFFFFF" />
            </Pressable>
          ) : null}
          <Pressable onPress={submitExam} style={styles.submitButton}>
            <Text style={styles.submitText}>Submit test</Text>
          </Pressable>
        </View>
      </SafeAreaView>

      <Modal transparent animationType="fade" visible={showExitConfirmation} onRequestClose={() => setShowExitConfirmation(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.exitModal}>
            <View style={styles.modalIcon}><MaterialIcons name="exit-to-app" size={28} color="#B55B35" /></View>
            <Text style={styles.modalTitle}>Quit the test?</Text>
            <Text style={styles.modalText}>Are you sure you want to quit the test? Your answers and progress will not be saved.</Text>
            <View style={styles.modalActions}>
              <Pressable onPress={() => setShowExitConfirmation(false)} style={styles.modalNoButton}><Text style={styles.modalNoText}>No</Text></Pressable>
              <Pressable onPress={onExit} style={styles.modalYesButton}><Text style={styles.modalYesText}>Yes, quit</Text></Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {flex: 1, backgroundColor: '#EEF4FB'},
  header: {minHeight: 82, backgroundColor: '#294D60', paddingHorizontal: 16, paddingTop: homeInsets.androidTopInset + 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'},
  exitButton: {width: 52},
  exitText: {color: '#FFFFFF', fontSize: 16, fontWeight: '800'},
  headerTitle: {color: '#FFFFFF', textAlign: 'center', fontSize: 17, fontWeight: '800'},
  headerSubTitle: {color: '#CFE0EA', fontSize: 11, fontWeight: '600', marginTop: 3},
  timer: {minWidth: 72, borderRadius: 16, paddingVertical: 8, paddingHorizontal: 9, backgroundColor: '#406579', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5},
  timerText: {color: '#FFFFFF', fontSize: 15, fontWeight: '800'},
  content: {padding: 18, paddingBottom: 48},
  progressRow: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 9},
  questionCountButton: {flexDirection: 'row', alignItems: 'center', gap: 2},
  questionCount: {color: '#294D60', fontSize: 15, fontWeight: '800'},
  answeredCount: {color: '#527187', fontSize: 13, fontWeight: '600'},
  questionPalette: {backgroundColor: '#FFFFFF', borderRadius: 14, paddingHorizontal: 12, paddingTop: 10, paddingBottom: 8, marginBottom: 14, borderWidth: 1, borderColor: '#D7E3EF'},
  paletteTitle: {color: '#294D60', fontSize: 14, fontWeight: '800', marginBottom: 8},
  paletteScroll: {maxHeight: 210},
  paletteGrid: {flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start', gap: 8, paddingBottom: 4},
  paletteNumber: {width: '12%', minWidth: 38, aspectRatio: 1, borderRadius: 8, alignItems: 'center', justifyContent: 'center', backgroundColor: '#E9EEF4', borderWidth: 1, borderColor: '#D6E0E9'},
  paletteNumberAnswered: {backgroundColor: '#CFEFE4', borderColor: '#9ED7C2'},
  paletteNumberCurrent: {backgroundColor: '#1662B3', borderColor: '#1662B3'},
  paletteNumberText: {color: '#294D60', fontSize: 14, fontWeight: '700'},
  paletteNumberTextCurrent: {color: '#FFFFFF'},
  paletteLegend: {flexDirection: 'row', gap: 16, marginTop: 7},
  paletteLegendText: {color: '#60798E', fontSize: 11},
  progressTrack: {height: 7, backgroundColor: '#D0E0EE', borderRadius: 99, overflow: 'hidden', marginBottom: 20},
  progressFill: {height: '100%', backgroundColor: '#3182CE', borderRadius: 99},
  questionCard: {position: 'relative', backgroundColor: '#FFFFFF', borderRadius: 20, padding: 20, borderWidth: 1, borderColor: '#D7E3EF'},
  questionTopRow: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12},
  section: {color: '#47728B', fontSize: 11, fontWeight: '800', letterSpacing: 0.7},
  languageButton: {flexDirection: 'row', alignItems: 'center', backgroundColor: '#E7F1FB', borderRadius: 12, paddingVertical: 6, paddingLeft: 8, paddingRight: 4},
  languageButtonText: {color: '#1662B3', fontSize: 12, fontWeight: '800', marginLeft: 4},
  languageMenu: {position: 'absolute', top: 58, right: 20, width: 160, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#D7E3EF', borderRadius: 12, overflow: 'hidden', elevation: 8, zIndex: 20},
  languageOption: {paddingHorizontal: 14, paddingVertical: 11},
  languageOptionText: {color: '#294D60', fontSize: 14, fontWeight: '700'},
  translatingText: {color: '#47728B', fontSize: 12, fontWeight: '600', marginBottom: 8},
  translatingRow: {flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8},
  question: {color: '#284B65', fontSize: 20, lineHeight: 29, fontWeight: '600'},
  rtlText: {writingDirection: 'rtl', textAlign: 'right'},
  promptRow: {marginTop: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'},
  prompt: {color: '#1662B3', fontSize: 12, fontWeight: '800', letterSpacing: 0.8},
  audioButton: {width: 44, height: 44, borderRadius: 22, backgroundColor: '#294D60', alignItems: 'center', justifyContent: 'center'},
  optionsList: {marginTop: 14, gap: 10},
  option: {minHeight: 76, borderRadius: 16, padding: 14, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#D7E3EF', flexDirection: 'row', alignItems: 'center'},
  optionSelected: {backgroundColor: '#E3F0FC', borderColor: '#3182CE', borderWidth: 2},
  optionLabel: {width: 38, height: 38, borderRadius: 19, backgroundColor: '#EEF4F8', alignItems: 'center', justifyContent: 'center', marginRight: 12},
  optionLabelSelected: {backgroundColor: '#1662B3'},
  optionLabelText: {color: '#294D60', fontSize: 17, fontWeight: '800'},
  optionLabelTextSelected: {color: '#FFFFFF'},
  optionText: {flex: 1, color: '#294D60', fontSize: 15, lineHeight: 22, fontWeight: '600', paddingRight: 8},
  footerSafeArea: {backgroundColor: '#FFFFFF', paddingBottom: homeInsets.bottomSafeInset},
  footer: {paddingHorizontal: 14, paddingTop: 14, paddingBottom: 18, borderTopWidth: 1, borderColor: '#D7E3EF', flexDirection: 'row', gap: 12},
  navigationButton: {flex: 1, minHeight: 50, borderRadius: 14, backgroundColor: '#E5F0FA', alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 6},
  disabledButton: {opacity: 0.45},
  previousText: {color: '#1662B3', fontSize: 15, fontWeight: '800'},
  nextButton: {flex: 1, minHeight: 50, borderRadius: 14, backgroundColor: '#1662B3', alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 6},
  nextText: {color: '#FFFFFF', fontSize: 15, fontWeight: '800'},
  submitButton: {flex: 1, minHeight: 50, borderRadius: 14, backgroundColor: '#218568', alignItems: 'center', justifyContent: 'center'},
  submitText: {color: '#FFFFFF', fontSize: 15, fontWeight: '800'},
  modalBackdrop: {flex: 1, backgroundColor: 'rgba(11, 31, 45, 0.52)', alignItems: 'center', justifyContent: 'center', padding: 24},
  exitModal: {width: '100%', maxWidth: 360, backgroundColor: '#FFFFFF', borderRadius: 22, padding: 24, alignItems: 'center'},
  modalIcon: {width: 56, height: 56, borderRadius: 28, backgroundColor: '#FFF0E9', alignItems: 'center', justifyContent: 'center'},
  modalTitle: {color: '#294D60', fontSize: 21, fontWeight: '900', marginTop: 14},
  modalText: {color: '#607B8E', fontSize: 14, lineHeight: 21, textAlign: 'center', marginTop: 8},
  modalActions: {width: '100%', flexDirection: 'row', gap: 10, marginTop: 22},
  modalNoButton: {flex: 1, minHeight: 48, borderRadius: 13, borderWidth: 1, borderColor: '#1662B3', alignItems: 'center', justifyContent: 'center'},
  modalNoText: {color: '#1662B3', fontSize: 15, fontWeight: '800'},
  modalYesButton: {flex: 1, minHeight: 48, borderRadius: 13, backgroundColor: '#B55B35', alignItems: 'center', justifyContent: 'center'},
  modalYesText: {color: '#FFFFFF', fontSize: 15, fontWeight: '800'},
});

export default ExamScreen;
