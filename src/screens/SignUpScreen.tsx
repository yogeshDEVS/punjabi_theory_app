import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  Image,
} from 'react-native';
import {spacing} from '../theme/colors';
import {homePalette} from '../features/home/theme';
import {getAuthErrorMessage, signUpWithEmail} from '../services/firebaseAuth';

const brandLogo = require('../images/logo.jpeg');

interface SignUpScreenProps {
  onSignUpSuccess: (user: any) => void;
  onNavigateToLogin: () => void;
  onSkip?: () => void;
}

export default function SignUpScreen({
  onSignUpSuccess,
  onNavigateToLogin,
  onSkip,
}: SignUpScreenProps) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSignUp = async () => {
    if (!fullName.trim() || !email.trim() || !password || !confirmPassword) {
      setErrorMessage('Please fill in all fields.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password should be at least 6 characters long.');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      const user = await signUpWithEmail(fullName, email.trim(), password);
      setLoading(false);
      Alert.alert('Account Created', 'Your account has been created successfully!');
      onSignUpSuccess(user);
    } catch (err: any) {
      setLoading(false);
      console.warn('Firebase email account creation failed', {
        code: err?.code,
        message: err?.message,
      });
      const msg = getAuthErrorMessage(err);
      setErrorMessage(msg);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={homePalette.heroStart} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled">
          
          <View style={styles.headerContainer}>
            <View style={styles.logoFrame}>
              <Image source={brandLogo} style={styles.logo} resizeMode="contain" />
            </View>
            <Text style={styles.brandTitle}>PUNJABI THEORY</Text>
            <Text style={styles.welcomeText}>Create your account</Text>
            <Text style={styles.subText}>Save your Punjabi theory practice progress.</Text>
          </View>

          {errorMessage ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
          ) : null}

          <View style={styles.formContainer}>
            <Text style={styles.inputLabel}>Full Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Your full name"
              placeholderTextColor="#98A2B3"
              value={fullName}
              onChangeText={setFullName}
              autoCapitalize="words"
              autoCorrect={false}
              textContentType="name"
              returnKeyType="next"
            />

            <Text style={styles.inputLabel}>Email Address</Text>
            <TextInput
              style={styles.input}
              placeholder="you@example.com"
              placeholderTextColor="#98A2B3"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />

            <Text style={styles.inputLabel}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Min 6 characters"
              placeholderTextColor="#98A2B3"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
            />

            <Text style={styles.inputLabel}>Confirm Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Re-enter password"
              placeholderTextColor="#98A2B3"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              autoCapitalize="none"
            />

            <TouchableOpacity
              style={styles.signUpButton}
              onPress={handleSignUp}
              disabled={loading}
              activeOpacity={0.8}>
              {loading ? (
                <ActivityIndicator color="#000000" />
              ) : (
                <Text style={styles.signUpButtonText}>CREATE ACCOUNT</Text>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.footerContainer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={onNavigateToLogin}>
              <Text style={styles.loginLink}>Sign In</Text>
            </TouchableOpacity>
          </View>

          {onSkip ? (
            <TouchableOpacity style={styles.skipButton} onPress={onSkip}>
              <Text style={styles.skipText}>Continue as Guest</Text>
            </TouchableOpacity>
          ) : null}

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: homePalette.background,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.shellHorizontal,
    paddingTop: 30,
    paddingBottom: spacing.screenBottomInset + 20,
    justifyContent: 'center',
  },
  headerContainer: {
    alignItems: 'center',
    backgroundColor: homePalette.heroStart,
    borderRadius: 28,
    paddingHorizontal: 22,
    paddingTop: 26,
    paddingBottom: 24,
    marginBottom: 22,
    overflow: 'hidden',
  },
  logoFrame: {
    width: 96,
    height: 96,
    borderRadius: 26,
    backgroundColor: homePalette.white,
    borderWidth: 1,
    borderColor: '#E5DACA',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.16,
    shadowRadius: 12,
    elevation: 4,
  },
  logo: {
    width: 78,
    height: 78,
    borderRadius: 17,
  },
  brandTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#F0A46E',
    letterSpacing: 3,
    marginBottom: 8,
  },
  welcomeText: {
    fontSize: 26,
    fontWeight: '700',
    color: homePalette.white,
    marginBottom: 6,
  },
  subText: {
    fontSize: 14,
    color: '#D5E1E8',
    lineHeight: 21,
    textAlign: 'center',
  },
  errorBox: {
    backgroundColor: '#FFF1ED',
    borderWidth: 1,
    borderColor: '#FDA29B',
    borderRadius: 13,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    color: '#B42318',
    fontSize: 13,
    textAlign: 'center',
  },
  formContainer: {
    backgroundColor: homePalette.shell,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: homePalette.line,
    padding: 22,
    marginBottom: 22,
    shadowColor: '#17344E',
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.07,
    shadowRadius: 18,
    elevation: 3,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: homePalette.ink,
    marginBottom: 8,
    marginTop: 10,
  },
  input: {
    backgroundColor: '#FBF8F2',
    borderWidth: 1,
    borderColor: '#DED6C9',
    borderRadius: 13,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: homePalette.ink,
    fontSize: 15,
  },
  signUpButton: {
    backgroundColor: homePalette.accent,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 24,
  },
  signUpButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
    letterSpacing: 1,
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  footerText: {
    color: homePalette.muted,
    fontSize: 14,
  },
  loginLink: {
    color: homePalette.accent,
    fontWeight: '700',
    fontSize: 14,
  },
  skipButton: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  skipText: {
    color: homePalette.muted,
    fontSize: 13,
    textDecorationLine: 'underline',
  },
});
