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
  Image,
} from 'react-native';
import {spacing} from '../theme/colors';
import {homePalette} from '../features/home/theme';
import {getAuthErrorMessage, loginWithEmail} from '../services/firebaseAuth';

const brandLogo = require('../images/logo.jpeg');

interface LoginScreenProps {
  onLoginSuccess: (user: any) => void;
  onNavigateToSignUp: () => void;
  onSkip?: () => void;
}

export default function LoginScreen({
  onLoginSuccess,
  onNavigateToSignUp,
  onSkip,
}: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      setErrorMessage('Enter your email and password to sign in.');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      const user = await loginWithEmail(email.trim(), password);
      setLoading(false);
      onLoginSuccess(user);
    } catch (err: any) {
      setLoading(false);
      console.warn('Firebase email sign-in failed', {
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
            <Text style={styles.eyebrow}>PUNJABI THEORY</Text>
            <Text style={styles.welcomeText}>Ready to pass?</Text>
            <Text style={styles.subText}>Your driving theory journey starts here.</Text>
          </View>

          {errorMessage ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
          ) : null}

          <View style={styles.formContainer}>
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
              textContentType="emailAddress"
              returnKeyType="next"
            />

            <Text style={styles.inputLabel}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter password"
              placeholderTextColor="#98A2B3"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
              textContentType="password"
              returnKeyType="done"
              onSubmitEditing={handleLogin}
            />

            <TouchableOpacity
              style={styles.loginButton}
              onPress={handleLogin}
              disabled={loading}
              activeOpacity={0.8}>
              {loading ? (
                <ActivityIndicator color="#000000" />
              ) : (
                <Text style={styles.loginButtonText}>Sign in</Text>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.footerContainer}>
            <Text style={styles.footerText}>New to Punjabi Theory? </Text>
            <TouchableOpacity onPress={onNavigateToSignUp}>
              <Text style={styles.signUpLink}>Create account</Text>
            </TouchableOpacity>
          </View>

          {onSkip ? (
            <TouchableOpacity style={styles.skipButton} onPress={onSkip}>
              <Text style={styles.skipText}>Continue without an account</Text>
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
    paddingTop: 28,
    paddingBottom: 26,
    marginBottom: 22,
    overflow: 'hidden',
  },
  logoFrame: {
    width: 104,
    height: 104,
    borderRadius: 28,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5DACA',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
    shadowColor: '#17344E',
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.2,
    shadowRadius: 14,
    elevation: 5,
  },
  logo: {
    width: 84,
    height: 84,
    borderRadius: 18,
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: '800',
    color: '#F0A46E',
    letterSpacing: 2.5,
    marginBottom: 10,
  },
  welcomeText: {
    fontSize: 30,
    fontWeight: '800',
    color: homePalette.white,
    marginBottom: 6,
  },
  subText: {
    fontSize: 14,
    color: '#D5E1E8',
    textAlign: 'center',
    lineHeight: 21,
  },
  errorBox: {
    backgroundColor: '#FFF1ED',
    borderWidth: 1,
    borderColor: '#FDA29B',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    color: '#B42318',
    fontSize: 13,
    textAlign: 'center',
  },
  formContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: homePalette.line,
    padding: 22,
    marginBottom: 22,
    shadowColor: '#17344E',
    shadowOffset: {width: 0, height: 10},
    shadowOpacity: 0.07,
    shadowRadius: 20,
    elevation: 3,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#17344E',
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
  loginButton: {
    backgroundColor: homePalette.accent,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 26,
  },
  loginButtonText: {
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
  signUpLink: {
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
