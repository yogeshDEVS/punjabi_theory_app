import React, {useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {MaterialIcons} from '@react-native-vector-icons/material-icons';

import BottomTabBar from '../components/home/BottomTabBar';
import type {HomeTab} from '../features/home/data';
import {homePalette} from '../features/home/theme';

interface HelpSupportScreenProps {
  onTabPress: (tab: HomeTab) => void;
}

const topics = [
  'Practice questions',
  'Mock exam',
  'Account',
  'Technical issue',
  'Other',
];

const FORMSPREE_ENDPOINT = 'https://formspree.io/f/mljgzjgn';

function HelpSupportScreen({onTabPress}: HelpSupportScreenProps): React.JSX.Element {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [topic, setTopic] = useState<string | null>(null);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (isSubmitting) {
      return;
    }

    if (!name.trim() || !email.trim() || !topic || !subject.trim() || !message.trim()) {
      setError('Please complete each field so we can understand your query.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Enter a valid email address.');
      return;
    }

    setError('');
    setIsSubmitting(true);

    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          topic,
          subject: subject.trim(),
          message: message.trim(),
        }),
      });

      const result = await response.json().catch(() => ({})) as {
        errors?: Array<{message?: string}>;
        error?: string;
      };

      if (!response.ok) {
        setError(
          result.errors?.map(item => item.message).filter(Boolean).join(' ') ||
            result.error ||
            'Your request could not be sent. Please try again.',
        );
        return;
      }

      setName('');
      setEmail('');
      setTopic(null);
      setSubject('');
      setMessage('');
      Alert.alert('Request sent', 'Thanks for contacting us. Your support request has been sent.');
    } catch {
      setError('Could not connect to support. Check your internet connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={homePalette.heroStart} />

      <View style={styles.screen}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <View style={styles.hero}>
            <View style={styles.heroIconWrap}>
              <MaterialIcons name="support-agent" size={27} color="#FFFFFF" />
            </View>
            <Text style={styles.eyebrow}>WE’RE HERE TO HELP</Text>
            <Text style={styles.heroTitle}>How can we support you?</Text>
            <Text style={styles.heroCopy}>
              Tell us what happened and our team will know where to start.
            </Text>
            <View style={styles.heroDecoration} />
          </View>

          <View style={styles.content}>
            <View style={styles.introRow}>
              <View style={styles.introIcon}>
                <MaterialIcons name="edit-note" size={22} color={homePalette.mint} />
              </View>
              <View style={styles.introTextWrap}>
                <Text style={styles.formTitle}>Send us a message</Text>
                <Text style={styles.formSubtitle}>All fields are required</Text>
              </View>
              <View style={styles.privateBadge}>
                <MaterialIcons name="lock-outline" size={13} color="#5D7181" />
                <Text style={styles.privateBadgeText}>Private</Text>
              </View>
            </View>

            <Text style={styles.fieldLabel}>What do you need help with?</Text>
            <View style={styles.topicGrid}>
              {topics.map(item => {
                const selected = topic === item;
                return (
                  <Pressable
                    key={item}
                    accessibilityRole="button"
                    accessibilityState={{selected}}
                    onPress={() => setTopic(item)}
                    style={[styles.topicChip, selected && styles.topicChipSelected]}>
                    {selected ? <MaterialIcons name="check" size={15} color="#FFFFFF" /> : null}
                    <Text style={[styles.topicChipText, selected && styles.topicChipTextSelected]}>
                      {item}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <View style={styles.fieldRow}>
              <View style={styles.fieldColumn}>
                <Text style={styles.fieldLabel}>Your name</Text>
                <View style={styles.inputWrap}>
                  <MaterialIcons name="person-outline" size={19} color="#82919C" />
                  <TextInput
                    value={name}
                    onChangeText={setName}
                    placeholder="e.g. Alex Smith"
                    placeholderTextColor="#A5AFB7"
                    autoCapitalize="words"
                    style={styles.input}
                    accessibilityLabel="Your name"
                    returnKeyType="next"
                  />
                </View>
              </View>
              <View style={styles.fieldColumn}>
                <Text style={styles.fieldLabel}>Email address</Text>
                <View style={styles.inputWrap}>
                  <MaterialIcons name="mail-outline" size={18} color="#82919C" />
                  <TextInput
                    value={email}
                    onChangeText={setEmail}
                    placeholder="you@example.com"
                    placeholderTextColor="#A5AFB7"
                    autoCapitalize="none"
                    autoComplete="email"
                    keyboardType="email-address"
                    style={styles.input}
                    accessibilityLabel="Email address"
                    returnKeyType="next"
                  />
                </View>
              </View>
            </View>

            <Text style={styles.fieldLabel}>Subject</Text>
            <View style={styles.inputWrap}>
              <MaterialIcons name="short-text" size={20} color="#82919C" />
              <TextInput
                value={subject}
                onChangeText={setSubject}
                placeholder="A short summary of your query"
                placeholderTextColor="#A5AFB7"
                style={styles.input}
                accessibilityLabel="Subject"
                returnKeyType="next"
              />
            </View>

            <View style={styles.messageLabelRow}>
              <Text style={styles.fieldLabel}>How can we help?</Text>
              <Text style={styles.characterCount}>{message.length}/1000</Text>
            </View>
            <TextInput
              value={message}
              onChangeText={value => setMessage(value.slice(0, 1000))}
              placeholder="Include any details that could help us understand the issue…"
              placeholderTextColor="#A5AFB7"
              multiline
              textAlignVertical="top"
              style={[styles.input, styles.messageInput]}
              accessibilityLabel="Describe your query"
            />

            <View style={styles.privacyNote}>
              <MaterialIcons name="info-outline" size={18} color="#53728A" />
              <Text style={styles.privacyText}>
                Please don’t include passwords or payment details in your message.
              </Text>
            </View>

            {error ? <Text accessibilityRole="alert" style={styles.errorText}>{error}</Text> : null}

            <Pressable
              accessibilityRole="button"
              accessibilityState={{disabled: isSubmitting, busy: isSubmitting}}
              disabled={isSubmitting}
              onPress={handleSubmit}
              style={({pressed}) => [styles.submitButton, pressed && styles.submitButtonPressed]}>
              {isSubmitting ? (
                <>
                  <ActivityIndicator size="small" color="#FFFFFF" />
                  <Text style={styles.submitButtonText}>Sending request…</Text>
                </>
              ) : (
                <>
                  <Text style={styles.submitButtonText}>Send support request</Text>
                  <MaterialIcons name="arrow-forward" size={19} color="#FFFFFF" />
                </>
              )}
            </Pressable>
            <Text style={styles.submitNote}>Your request will be sent to the support email configured for this form.</Text>
          </View>
        </ScrollView>

        <BottomTabBar activeTab="help" onTabPress={onTabPress} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {flex: 1, backgroundColor: homePalette.background},
  screen: {flex: 1, backgroundColor: homePalette.background},
  scrollView: {flex: 1},
  scrollContent: {paddingBottom: 18},
  hero: {
    minHeight: 203,
    paddingTop: 25,
    paddingBottom: 27,
    paddingHorizontal: 23,
    overflow: 'hidden',
    backgroundColor: homePalette.heroStart,
  },
  heroIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.14)',
    marginBottom: 13,
  },
  eyebrow: {color: '#A9DCD2', fontSize: 10, fontWeight: '900', letterSpacing: 1.4},
  heroTitle: {color: '#FFFFFF', fontSize: 25, lineHeight: 32, fontWeight: '800', marginTop: 4},
  heroCopy: {color: '#D5E2EA', fontSize: 13, lineHeight: 19, marginTop: 5, maxWidth: 310},
  heroDecoration: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 24,
    borderColor: 'rgba(73,183,165,0.12)',
    right: -42,
    top: -45,
  },
  content: {
    width: '100%',
    maxWidth: 580,
    alignSelf: 'center',
    paddingHorizontal: 18,
    paddingTop: 20,
    paddingBottom: 12,
  },
  introRow: {flexDirection: 'row', alignItems: 'center', marginBottom: 21},
  introIcon: {width: 42, height: 42, borderRadius: 14, backgroundColor: '#E5F5F1', alignItems: 'center', justifyContent: 'center', marginRight: 11},
  introTextWrap: {flex: 1},
  formTitle: {color: homePalette.ink, fontSize: 18, fontWeight: '800'},
  formSubtitle: {color: homePalette.muted, fontSize: 12, marginTop: 2},
  privateBadge: {flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 9, paddingVertical: 6, borderRadius: 20, backgroundColor: '#F0F3F5'},
  privateBadgeText: {color: '#5D7181', fontSize: 10, fontWeight: '700'},
  fieldLabel: {color: '#314A5D', fontSize: 12, fontWeight: '800', marginBottom: 7},
  topicGrid: {flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 18},
  topicChip: {minHeight: 35, flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 12, borderRadius: 18, borderWidth: 1, borderColor: '#D8E0E5', backgroundColor: '#FFFEFB'},
  topicChipSelected: {backgroundColor: homePalette.heroStart, borderColor: homePalette.heroStart},
  topicChipText: {color: '#5D7181', fontSize: 11, fontWeight: '700'},
  topicChipTextSelected: {color: '#FFFFFF'},
  fieldRow: {flexDirection: 'row', gap: 10, marginBottom: 15},
  fieldColumn: {flex: 1},
  inputWrap: {minHeight: 48, flexDirection: 'row', alignItems: 'center', gap: 9, paddingHorizontal: 12, borderWidth: 1, borderColor: '#E0E5E8', borderRadius: 13, backgroundColor: '#FFFEFB', marginBottom: 15},
  input: {flex: 1, minHeight: 46, paddingVertical: 10, color: homePalette.ink, fontSize: 13},
  messageLabelRow: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'},
  characterCount: {color: '#8B98A2', fontSize: 10, marginBottom: 7},
  messageInput: {minHeight: 126, paddingHorizontal: 13, paddingTop: 12, borderWidth: 1, borderColor: '#E0E5E8', borderRadius: 13, backgroundColor: '#FFFEFB', marginBottom: 13},
  privacyNote: {flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 11, paddingVertical: 10, borderRadius: 12, backgroundColor: '#EAF1F5', marginBottom: 13},
  privacyText: {flex: 1, color: '#53728A', fontSize: 11, lineHeight: 16},
  errorText: {color: '#B7423C', fontSize: 12, lineHeight: 17, marginBottom: 10},
  submitButton: {minHeight: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 9, borderRadius: 15, backgroundColor: '#207E70', shadowColor: '#145D54', shadowOffset: {width: 0, height: 4}, shadowOpacity: 0.16, shadowRadius: 7, elevation: 2},
  submitButtonPressed: {opacity: 0.86},
  submitButtonText: {color: '#FFFFFF', fontSize: 14, fontWeight: '800'},
  submitNote: {color: '#7B8993', fontSize: 10, lineHeight: 15, textAlign: 'center', marginTop: 9, paddingHorizontal: 6},
});

export default HelpSupportScreen;
