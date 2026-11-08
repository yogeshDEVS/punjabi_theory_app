import React, {useState} from 'react';
import {Alert, Platform, Pressable, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, View} from 'react-native';
import {MaterialIcons} from '@react-native-vector-icons/material-icons';
import {generatePDF} from 'react-native-html-to-pdf';
import ReactNativeBlobUtil from 'react-native-blob-util';
import Share from 'react-native-share';

import {homeInsets} from '../features/home/theme';
import {
  mockExamDurationSeconds,
  mockExamPassMark,
  mockExamQuestions,
} from '../features/theory/mockExamData';
import type {ExamResult} from './ExamScreen';

interface ExamResultScreenProps {
  result: ExamResult;
  onDone: () => void;
  onTryAgain: () => void;
}

function formatDuration(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}m ${remainingSeconds}s`;
}

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, character => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;',
  })[character] ?? character);
}

function ExamResultScreen({result, onDone, onTryAgain}: ExamResultScreenProps): React.JSX.Element {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadedPdfPath, setDownloadedPdfPath] = useState<string | null>(null);
  const isSharing = false;
  const correctAnswers = mockExamQuestions.filter(question =>
    question.options.some(option => option.correct && result.answers[question.id] === option.id),
  ).length;
  const unanswered = mockExamQuestions.length - Object.keys(result.answers).length;
  const incorrect = mockExamQuestions.length - correctAnswers - unanswered;
  const passed = correctAnswers >= mockExamPassMark;
  const timeUsed = mockExamDurationSeconds - result.timeRemaining;

  const downloadResultPdf = async () => {
    if (isDownloading) {
      return;
    }

    setIsDownloading(true);
    try {
      const questionRows = mockExamQuestions.map((question, index) => {
        const selectedAnswer = result.answers[question.id];
        const selectedOption = question.options.find(option => option.id === selectedAnswer);
        const correctOption = question.options.find(option => option.correct)!;
        const isCorrect = selectedAnswer === correctOption.id;
        const status = isCorrect ? 'Correct' : selectedAnswer ? 'Incorrect' : 'Skipped';
        const statusClass = isCorrect ? 'correct' : 'incorrect';

        return `<section class="question-card">
          <div class="question-header"><span>QUESTION ${index + 1}</span><span class="status ${statusClass}">${status}</span></div>
          <p class="question">${escapeHtml(question.question.english)}</p>
          ${selectedOption && !isCorrect ? `<p class="your-answer">Your answer: ${escapeHtml(selectedOption.label)}. ${escapeHtml(selectedOption.text.english)}</p>` : ''}
          <p class="correct-answer">Correct answer: ${escapeHtml(correctOption.label)}. ${escapeHtml(correctOption.text.english)}</p>
        </section>`;
      }).join('');

      const html = `<!DOCTYPE html><html><head><meta charset="utf-8" />
        <style>
          * { box-sizing: border-box; } body { font-family: Arial, sans-serif; color: #294D60; margin: 0; padding: 24px; font-size: 12px; }
          h1 { margin: 0; color: #294D60; font-size: 25px; } .subtitle { margin: 6px 0 22px; color: #607B8E; }
          .summary { background: ${passed ? '#E3F5ED' : '#FFF1EA'}; border-radius: 14px; padding: 18px; text-align: center; }
          .summary h2 { margin: 0; font-size: 19px; } .score { font-size: 38px; font-weight: bold; margin: 12px 0 3px; } .score span { font-size: 21px; color: #688398; }
          .score-label, .question-header { color: #47728B; font-weight: bold; letter-spacing: .5px; font-size: 10px; }
          .stats { display: table; width: 100%; border-spacing: 8px; margin: 14px -8px; } .stat { display: table-cell; width: 25%; background: #F4F8FC; padding: 12px 6px; border-radius: 10px; text-align: center; }
          .stat strong { display: block; font-size: 20px; } .stat small { color: #607B8E; font-size: 9px; font-weight: bold; } .time { text-align: center; color: #527187; margin: 4px 0 24px; }
          h3 { font-size: 18px; margin: 0 0 5px; } .intro { color: #607B8E; margin: 0 0 14px; }
          .question-card { border: 1px solid #D7E3EF; border-radius: 10px; padding: 12px; margin: 0 0 10px; page-break-inside: avoid; }
          .question-header { display: flex; justify-content: space-between; } .status { padding: 3px 7px; border-radius: 9px; } .correct { color: #1B7A60; background: #E1F4ED; } .incorrect { color: #B64A4A; background: #FBE8E8; }
          .question { margin: 9px 0; font-weight: bold; line-height: 1.45; } .your-answer { color: #B64A4A; margin: 6px 0; line-height: 1.4; } .correct-answer { color: #1B7A60; margin: 6px 0 0; line-height: 1.4; }
        </style></head><body>
        <h1>Mock Exam Result</h1><p class="subtitle">Completed ${escapeHtml(new Date(result.completedAt).toLocaleString())}</p>
        <div class="summary"><h2>${passed ? 'Great work - you passed!' : 'Keep practising'}</h2><div class="score">${correctAnswers}<span>/${mockExamQuestions.length}</span></div><div class="score-label">CORRECT ANSWERS</div></div>
        <div class="stats"><div class="stat"><strong style="color:#218568">${correctAnswers}</strong><small>CORRECT</small></div><div class="stat"><strong style="color:#D65B5B">${incorrect}</strong><small>INCORRECT</small></div><div class="stat"><strong style="color:#8A6A16">${unanswered}</strong><small>SKIPPED</small></div><div class="stat"><strong>${formatDuration(timeUsed)}</strong><small>TIME USED</small></div></div>
        <p class="time">Pass mark: ${mockExamPassMark}/${mockExamQuestions.length}</p><h3>Question analysis</h3><p class="intro">Review every answer to see where to focus your revision.</p>${questionRows}
        </body></html>`;
      const file = await generatePDF({
        html,
        fileName: `mock-exam-result-${result.completedAt}`,
        directory: 'Documents',
      });

      if (Platform.OS === 'android') {
        await ReactNativeBlobUtil.MediaCollection.copyToMediaStore(
          {
            name: `mock-exam-result-${result.completedAt}.pdf`,
            parentFolder: 'Grade Capital',
            mimeType: 'application/pdf',
          },
          'Download',
          file.filePath,
        );
      }

      setDownloadedPdfPath(file.filePath);
      Alert.alert(
        'PDF downloaded',
        Platform.OS === 'android'
          ? 'Your report is saved in Downloads/Grade Capital. You can now share it.'
          : 'Your report is ready. You can now share it.',
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Please try again.';
      Alert.alert('Could not download PDF', message);
    } finally {
      setIsDownloading(false);
    }
  };

  const shareDownloadedPdf = async () => {
    if (!downloadedPdfPath) {
      Alert.alert('Download the PDF first', 'Create the PDF before sharing it.');
      return;
    }

    try {
      await Share.open({
        title: 'Mock exam result',
        subject: 'My mock exam result',
        message: `My mock exam result: ${correctAnswers}/${mockExamQuestions.length}.`,
        url: `file://${downloadedPdfPath}`,
        type: 'application/pdf',
        failOnCancel: false,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Please try again.';
      Alert.alert('Could not share PDF', message);
    }
  };

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar barStyle="light-content" backgroundColor="#294D60" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>EXAM RESULT</Text>
        <Text style={styles.headerSubTitle}>Your mock exam analysis</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[styles.resultCard, passed ? styles.passedCard : styles.failedCard]}>
          <View style={[styles.resultIcon, passed ? styles.passedIcon : styles.failedIcon]}>
            <MaterialIcons name={passed ? 'check' : 'priority-high'} size={42} color="#FFFFFF" />
          </View>
          <Text style={styles.resultTitle}>{passed ? 'Great work — you passed!' : 'Keep practising'}</Text>
          <Text style={styles.resultCopy}>
            {passed ? `You reached the ${mockExamPassMark} out of 50 pass mark.` : `You need ${mockExamPassMark} correct answers to pass this mock exam.`}
          </Text>
          <Text style={styles.score}>{correctAnswers}<Text style={styles.scoreTotal}>/{mockExamQuestions.length}</Text></Text>
          <Text style={styles.scoreLabel}>CORRECT ANSWERS</Text>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}><Text style={[styles.statValue, {color: '#218568'}]}>{correctAnswers}</Text><Text style={styles.statLabel}>CORRECT</Text></View>
          <View style={styles.statCard}><Text style={[styles.statValue, {color: '#D65B5B'}]}>{incorrect}</Text><Text style={styles.statLabel}>INCORRECT</Text></View>
          <View style={styles.statCard}><Text style={[styles.statValue, {color: '#8A6A16'}]}>{unanswered}</Text><Text style={styles.statLabel}>SKIPPED</Text></View>
        </View>

        <View style={styles.timeCard}>
          <MaterialIcons name="timer" size={23} color="#47728B" />
          <View><Text style={styles.timeLabel}>TIME USED</Text><Text style={styles.timeValue}>{formatDuration(timeUsed)} of 57m</Text></View>
        </View>

        <Text style={styles.analysisTitle}>Question analysis</Text>
        <Text style={styles.analysisCopy}>Review every answer to see where to focus your revision.</Text>

        {mockExamQuestions.map((question, index) => {
          const selectedAnswer = result.answers[question.id];
          const correctOption = question.options.find(option => option.correct)!;
          const isCorrect = selectedAnswer === correctOption.id;
          return (
            <View key={question.id} style={styles.reviewCard}>
              <View style={styles.reviewHeader}>
                <Text style={styles.reviewNumber}>QUESTION {index + 1}</Text>
                <View style={[styles.statusChip, isCorrect ? styles.correctChip : styles.incorrectChip]}>
                  <MaterialIcons name={isCorrect ? 'check-circle' : 'cancel'} size={15} color={isCorrect ? '#1B7A60' : '#B64A4A'} />
                  <Text style={[styles.statusText, {color: isCorrect ? '#1B7A60' : '#B64A4A'}]}>{isCorrect ? 'CORRECT' : selectedAnswer ? 'INCORRECT' : 'SKIPPED'}</Text>
                </View>
              </View>
              <Text style={styles.reviewQuestion}>{question.question.english}</Text>
              {!isCorrect && selectedAnswer ? <Text style={styles.selectedAnswer}>Your answer: {selectedAnswer}</Text> : null}
              <Text style={styles.correctAnswer}>Correct answer: {correctOption.label}. {correctOption.text.english}</Text>
            </View>
          );
        })}
      </ScrollView>

      <View style={styles.footer}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Download result PDF"
          disabled={isDownloading}
          onPress={downloadResultPdf}
          style={[styles.downloadButton, isDownloading && styles.shareButtonDisabled]}>
          <MaterialIcons name="file-download" size={22} color="#FFFFFF" />
          <Text style={styles.shareText}>{isDownloading ? 'Preparing PDF...' : 'Download result PDF'}</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Share downloaded result PDF"
          disabled={!downloadedPdfPath}
          onPress={shareDownloadedPdf}
          style={[styles.shareButton, !downloadedPdfPath && styles.shareButtonDisabled]}>
          <MaterialIcons name="share" size={20} color="#FFFFFF" />
          <Text style={styles.shareText}>{isSharing ? 'Preparing PDF…' : 'Share result PDF'}</Text>
        </Pressable>
        <View style={styles.footerActions}>
          <Pressable onPress={onDone} style={styles.doneButton}><Text style={styles.doneText}>Back to home</Text></Pressable>
          <Pressable onPress={onTryAgain} style={styles.retryButton}><Text style={styles.retryText}>Try again</Text></Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {flex: 1, backgroundColor: '#EEF4FB'},
  header: {backgroundColor: '#294D60', paddingHorizontal: 20, paddingTop: homeInsets.androidTopInset + 16, paddingBottom: 20, alignItems: 'center'},
  headerTitle: {color: '#FFFFFF', fontSize: 20, fontWeight: '900', letterSpacing: 0.7},
  headerSubTitle: {color: '#CFE0EA', fontSize: 13, marginTop: 5},
  content: {paddingHorizontal: 18, paddingTop: 22, paddingBottom: 52},
  resultCard: {borderRadius: 22, padding: 22, alignItems: 'center'},
  passedCard: {backgroundColor: '#E3F5ED'},
  failedCard: {backgroundColor: '#FFF1EA'},
  resultIcon: {width: 70, height: 70, borderRadius: 35, alignItems: 'center', justifyContent: 'center', marginBottom: 12},
  passedIcon: {backgroundColor: '#218568'},
  failedIcon: {backgroundColor: '#D87745'},
  resultTitle: {color: '#294D60', fontSize: 22, fontWeight: '900', textAlign: 'center'},
  resultCopy: {color: '#527187', fontSize: 14, lineHeight: 20, textAlign: 'center', marginTop: 7},
  score: {color: '#294D60', fontSize: 48, fontWeight: '900', marginTop: 16},
  scoreTotal: {fontSize: 26, color: '#688398'},
  scoreLabel: {color: '#47728B', fontSize: 11, fontWeight: '800', letterSpacing: 0.8},
  statsRow: {flexDirection: 'row', gap: 9, marginTop: 14},
  statCard: {flex: 1, backgroundColor: '#FFFFFF', borderRadius: 15, paddingVertical: 14, alignItems: 'center', borderWidth: 1, borderColor: '#D7E3EF'},
  statValue: {fontSize: 23, fontWeight: '900'},
  statLabel: {color: '#667F92', fontSize: 10, fontWeight: '800', marginTop: 4},
  timeCard: {marginTop: 14, backgroundColor: '#FFFFFF', borderRadius: 15, padding: 15, flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: 1, borderColor: '#D7E3EF'},
  timeLabel: {color: '#668194', fontSize: 10, fontWeight: '800', letterSpacing: 0.7},
  timeValue: {color: '#294D60', fontSize: 15, fontWeight: '800', marginTop: 3},
  analysisTitle: {color: '#294D60', fontSize: 20, fontWeight: '900', marginTop: 26},
  analysisCopy: {color: '#607B8E', fontSize: 14, lineHeight: 20, marginTop: 5, marginBottom: 14},
  reviewCard: {backgroundColor: '#FFFFFF', borderRadius: 16, padding: 15, marginBottom: 10, borderWidth: 1, borderColor: '#D7E3EF'},
  reviewHeader: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8},
  reviewNumber: {color: '#47728B', fontSize: 11, fontWeight: '900', letterSpacing: 0.6},
  statusChip: {borderRadius: 99, paddingHorizontal: 8, paddingVertical: 4, flexDirection: 'row', alignItems: 'center', gap: 4},
  correctChip: {backgroundColor: '#E1F4ED'},
  incorrectChip: {backgroundColor: '#FBE8E8'},
  statusText: {fontSize: 10, fontWeight: '900'},
  reviewQuestion: {color: '#294D60', fontSize: 15, lineHeight: 21, fontWeight: '700'},
  selectedAnswer: {color: '#B64A4A', fontSize: 13, lineHeight: 19, marginTop: 10, fontWeight: '600'},
  correctAnswer: {color: '#1B7A60', fontSize: 13, lineHeight: 19, marginTop: 7, fontWeight: '600'},
  footer: {paddingHorizontal: 14, paddingTop: 14, paddingBottom: 16 + homeInsets.bottomSafeInset, gap: 10, backgroundColor: '#FFFFFF', borderTopWidth: 1, borderColor: '#D7E3EF'},
  downloadButton: {minHeight: 50, borderRadius: 14, backgroundColor: '#294D60', alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8},
  shareButton: {minHeight: 50, borderRadius: 14, backgroundColor: '#1662B3', alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8},
  shareButtonDisabled: {opacity: 0.7},
  shareText: {color: '#FFFFFF', fontSize: 15, fontWeight: '800'},
  footerActions: {flexDirection: 'row', gap: 10},
  doneButton: {flex: 1, minHeight: 50, borderRadius: 14, borderWidth: 1, borderColor: '#1662B3', alignItems: 'center', justifyContent: 'center'},
  doneText: {color: '#1662B3', fontSize: 15, fontWeight: '800'},
  retryButton: {flex: 1, minHeight: 50, borderRadius: 14, backgroundColor: '#1662B3', alignItems: 'center', justifyContent: 'center'},
  retryText: {color: '#FFFFFF', fontSize: 15, fontWeight: '800'},
});

export default ExamResultScreen;
