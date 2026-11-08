import React from 'react';
import { ActivityIndicator, Alert, StyleSheet, View } from 'react-native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import { store, persistor, useAppDispatch } from './src/store';
import HomeScreen from './src/screens/HomeScreen';
import HighwayCodeScreen from './src/screens/HighwayCodeScreen';
import PracticeChoiceScreen from './src/screens/PracticeChoiceScreen';
import PracticeTopicsScreen from './src/screens/PracticeTopicsScreen';
import TheoryTestScreen from './src/screens/TheoryTestScreen';
import FlaggedQuestionsScreen from './src/screens/FlaggedQuestionsScreen';
import ExamScreen, { ExamResult } from './src/screens/ExamScreen';
import ExamResultScreen from './src/screens/ExamResultScreen';
import ExamRulesScreen from './src/screens/ExamRulesScreen';
import LoginScreen from './src/screens/LoginScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import TestDashboardScreen from './src/screens/TestDashboardScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import LeaderboardScreen from './src/screens/LeaderboardScreen';
import HelpSupportScreen from './src/screens/HelpSupportScreen';
import RoadSignsScreen from './src/screens/RoadSignsScreen';
import SignsGivingOrdersScreen from './src/screens/SignsGivingOrdersScreen';
import { logout, saveMockExamScore, subscribeToAuthState } from './src/services/firebaseAuth';
import { mockExamQuestions } from './src/features/theory/mockExamData';
import { loadPracticeProgress, savePracticeProgress } from './src/services/practiceProgress';
import { hydratePractice, resetPractice } from './src/store/practiceSlice';

function AppContent(): React.JSX.Element {
  const [screen, setScreen] = React.useState<
    | 'login'
    | 'signUp'
    | 'home'
    | 'practice'
    | 'practiceTopics'
    | 'theory'
    | 'highwayCode'
    | 'flagged'
    | 'examRules'
    | 'exam'
    | 'examResult'
    | 'dashboard'
    | 'profile'
    | 'leaderboard'
    | 'help'
    | 'roadSigns'
    | 'signsGivingOrders'
  >('login');
  const [user, setUser] = React.useState<any>(null);
  const [authInitialized, setAuthInitialized] = React.useState(false);
  const [practiceReady, setPracticeReady] = React.useState(false);
  const practiceHydratingRef = React.useRef(false);
  const dispatch = useAppDispatch();
  const guestMode = React.useRef(false);
  const [examResult, setExamResult] = React.useState<ExamResult | null>(null);
  const [examHistory, setExamHistory] = React.useState<ExamResult[]>([]);
  const [theoryStartQuestionId, setTheoryStartQuestionId] = React.useState<number | undefined>();

  React.useEffect(() => {
    return subscribeToAuthState(authUser => {
      setUser(authUser);
      setPracticeReady(false);
      if (authUser) {
        guestMode.current = false;
        setScreen(current =>
          current === 'login' || current === 'signUp' ? 'home' : current,
        );
      } else if (!guestMode.current) {
        setScreen('login');
      }
      setAuthInitialized(true);
    });
  }, []);

  // Progress is scoped to the authenticated Firebase UID. Clear the Redux
  // snapshot first so one account can never briefly see another account's data.
  React.useEffect(() => {
    let active = true;
    practiceHydratingRef.current = true;
    dispatch(resetPractice());

    if (!user) {
      practiceHydratingRef.current = false;
      setPracticeReady(true);
      return () => { active = false; };
    }

    void loadPracticeProgress(user.uid)
      .then(progress => {
        if (active) {
          dispatch(hydratePractice(progress));
        }
      })
      .catch(error => {
        console.warn('Could not load practice progress from Firestore:', error);
      })
      .finally(() => {
        if (active) {
          practiceHydratingRef.current = false;
          setPracticeReady(true);
        }
      });

    return () => {
      active = false;
      practiceHydratingRef.current = false;
    };
  }, [dispatch, user]);

  // Persist every visited/flagged change for this user, with a short debounce
  // so rapid question navigation does not create a write for every tap.
  React.useEffect(() => {
    if (!user) {
      return undefined;
    }

    let timeout: ReturnType<typeof setTimeout> | null = null;
    const unsubscribe = store.subscribe(() => {
      if (practiceHydratingRef.current) {
        return;
      }
      if (timeout) {
        clearTimeout(timeout);
      }
      timeout = setTimeout(() => {
        const practice = store.getState().practice;
        void savePracticeProgress(user.uid, practice).catch(error => {
          console.warn('Could not save practice progress to Firestore:', error);
        });
      }, 350);
    });

    return () => {
      unsubscribe();
      if (timeout) {
        clearTimeout(timeout);
        const practice = store.getState().practice;
        void savePracticeProgress(user.uid, practice).catch(error => {
          console.warn('Could not save final practice progress to Firestore:', error);
        });
      }
    };
  }, [user]);

  if (!authInitialized || !practiceReady) {
    return (
      <View style={styles.authLoading}>
        <ActivityIndicator size="large" color="#17344E" />
      </View>
    );
  }

  if (screen === 'login') {
    return (
      <LoginScreen
        onLoginSuccess={u => {
          guestMode.current = false;
          setUser(u);
          setScreen('home');
        }}
        onNavigateToSignUp={() => setScreen('signUp')}
        onSkip={() => {
          guestMode.current = true;
          setScreen('home');
        }}
      />
    );
  }

  if (screen === 'signUp') {
    return (
      <SignUpScreen
        onSignUpSuccess={u => {
          guestMode.current = false;
          setUser(u);
          setScreen('home');
        }}
        onNavigateToLogin={() => setScreen('login')}
        onSkip={() => {
          guestMode.current = true;
          setScreen('home');
        }}
      />
    );
  }

  if (screen === 'dashboard') {
    return <TestDashboardScreen attempts={examHistory} onHome={() => setScreen('home')} onPractice={() => setScreen('practiceTopics')} onMock={() => setScreen('examRules')} />;
  }

  if (screen === 'profile') {
    return <ProfileScreen user={user} onBack={() => setScreen('home')} />;
  }

  if (screen === 'leaderboard') {
    return <LeaderboardScreen user={user} onBack={() => setScreen('home')} />;
  }

  if (screen === 'help') {
    return <HelpSupportScreen onTabPress={tab => {
      if (tab === 'learn') setScreen('home');
      if (tab === 'practice') setScreen('practiceTopics');
      if (tab === 'mock') setScreen('examRules');
      if (tab === 'dashboard') setScreen('dashboard');
    }} />;
  }

  if (screen === 'examRules') {
    return (
      <ExamRulesScreen
        onBack={() => setScreen('home')}
        onStart={() => setScreen('exam')}
      />
    );
  }

  if (screen === 'examResult' && examResult) {
    return (
      <ExamResultScreen
        result={examResult}
        onDone={() => setScreen('home')}
        onTryAgain={() => setScreen('examRules')}
      />
    );
  }

  if (screen === 'exam') {
    return (
      <ExamScreen
        onExit={() => setScreen('home')}
        onComplete={result => {
          if (user) {
            const score = mockExamQuestions.filter(question =>
              question.options.some(option => option.correct && result.answers[question.id] === option.id),
            ).length;
            void saveMockExamScore(user, score).catch(error => {
              console.warn('Could not save mock exam leaderboard score', error);
            });
          }
          setExamResult(result);
          setExamHistory(history => [result, ...history]);
          setScreen('examResult');
        }}
      />
    );
  }

  if (screen === 'highwayCode') {
    return <HighwayCodeScreen onBack={() => setScreen('home')} />;
  }

  if (screen === 'roadSigns') {
    return (
      <RoadSignsScreen
        onBack={() => setScreen('home')}
        onSignsGivingOrdersPress={() => setScreen('signsGivingOrders')}
      />
    );
  }

  if (screen === 'signsGivingOrders') {
    return <SignsGivingOrdersScreen onBack={() => setScreen('roadSigns')} />;
  }

  if (screen === 'theory') {
    return <TheoryTestScreen onBack={() => setScreen('practiceTopics')} initialQuestionId={theoryStartQuestionId} />;
  }

  if (screen === 'flagged') {
    return <FlaggedQuestionsScreen onBack={() => setScreen('practiceTopics')} />;
  }

  if (screen === 'practiceTopics') {
    return (
      <PracticeTopicsScreen
        onBack={() => setScreen('home')}
        onRoadProceduresPress={() => {
          setTheoryStartQuestionId(undefined);
          setScreen('theory');
        }}
        onAlertnessPress={() => {
          setTheoryStartQuestionId(1001);
          setScreen('theory');
        }}
        onSafetyPress={() => {
          setTheoryStartQuestionId(1092);
          setScreen('theory');
        }}
        onHazardAwarenessPress={() => {
          setTheoryStartQuestionId(1120);
          setScreen('theory');
        }}
        onTrafficSignsPress={() => {
          setTheoryStartQuestionId(1142);
          setScreen('theory');
        }}
        onMotorwayRulesPress={() => {
          setTheoryStartQuestionId(1355);
          setScreen('theory');
        }}
        onVulnerableRoadUsersPress={() => {
          setTheoryStartQuestionId(1185);
          setScreen('theory');
        }}
        onAttitudePress={() => {
          setTheoryStartQuestionId(1231);
          setScreen('theory');
        }}
        onFlaggedPress={() => setScreen('flagged')}
      />
    );
  }

  if (screen === 'practice') {
    return (
      <PracticeChoiceScreen
        onBack={() => setScreen('home')}
        onTheoryPress={() => setScreen('practiceTopics')}
      />
    );
  }

  return (
    <HomeScreen
      onPracticePress={() => setScreen('practiceTopics')}
      onHighwayCodePress={() => setScreen('highwayCode')}
      onMockExamPress={() => setScreen('examRules')}
      onRoadSignsPress={() => setScreen('roadSigns')}
      onDashboardPress={() => setScreen('dashboard')}
      onProfilePress={() => setScreen('profile')}
      onLeaderboardPress={() => setScreen('leaderboard')}
      onHelpPress={() => setScreen('help')}
      onLogout={async () => {
        try {
          await logout();
          setUser(null);
          setScreen('login');
        } catch (error) {
          console.warn('Sign-out failed', error);
          Alert.alert('Could not log out', 'Please try again.');
        }
      }}
    />
  );
}

const styles = StyleSheet.create({
  authLoading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F2F5F7',
  },
});

function App(): React.JSX.Element {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AppContent />
      </PersistGate>
    </Provider>
  );
}

export default App;
