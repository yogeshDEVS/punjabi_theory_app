import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export interface LeaderboardEntry {
  uid: string;
  displayName: string;
  bestScore: number;
  updatedAt: number;
}

const leaderboardCollection = () => firestore().collection('mockExamLeaderboard');

export async function saveMockExamScore(
  user: AuthUser,
  score: number,
): Promise<void> {
  const reference = leaderboardCollection().doc(user.uid);
  await firestore().runTransaction(async transaction => {
    const snapshot = await transaction.get(reference);
    const existing = snapshot.data();
    const bestScore = Math.max(existing?.bestScore ?? 0, score);
    const displayName = user.displayName || user.email?.split('@')[0] || 'Learner';

    transaction.set(reference, {
      uid: user.uid,
      displayName,
      bestScore,
      updatedAt: Date.now(),
      attempts: (existing?.attempts ?? 0) + 1,
    });
  });
}

export async function fetchMockExamLeaderboard(): Promise<LeaderboardEntry[]> {
  const snapshot = await leaderboardCollection().orderBy('bestScore', 'desc').get();
  return snapshot.docs.map(document => {
    const data = document.data();
    return {
      uid: document.id,
      displayName: data.displayName || 'Learner',
      bestScore: Number(data.bestScore) || 0,
      updatedAt: Number(data.updatedAt) || 0,
    };
  });
}

export type AuthUser = FirebaseAuthTypes.User;

export function subscribeToAuthState(
  onChange: (user: AuthUser | null) => void,
): () => void {
  return auth().onAuthStateChanged(onChange);
}

export async function loginWithEmail(
  email: string,
  password: string,
): Promise<AuthUser> {
  const credential = await auth().signInWithEmailAndPassword(email, password);
  return credential.user;
}

export async function signUpWithEmail(
  fullName: string,
  email: string,
  password: string,
): Promise<AuthUser> {
  const credential = await auth().createUserWithEmailAndPassword(email, password);
  const user = credential.user;
  const normalizedName = fullName.trim();

  await user.updateProfile({displayName: normalizedName});
  await firestore().collection('users').doc(user.uid).set({
    uid: user.uid,
    fullName: normalizedName,
    displayName: normalizedName,
    email: user.email,
    createdAt: firestore.FieldValue.serverTimestamp(),
  });

  return user;
}

export async function logout(): Promise<void> {
  await auth().signOut();
}

export function getAuthErrorMessage(error: unknown): string {
  const authError = error as {code?: string; message?: string};
  const code = authError?.code;

  switch (code) {
    case 'auth/invalid-email':
      return 'Enter a valid email address.';
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Email or password is incorrect.';
    case 'auth/email-already-in-use':
      return 'An account already exists for this email.';
    case 'auth/weak-password':
      return 'Choose a stronger password with at least 6 characters.';
    case 'auth/network-request-failed':
      return 'Could not connect. Check your internet and try again.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Please wait a moment and try again.';
    case 'auth/operation-not-allowed':
      return 'Email and password sign-in is disabled for this Firebase project. Enable the Email/Password provider in Firebase Authentication settings.';
    case 'app/no-app':
      return 'Firebase is not initialized in this app. Check the native Firebase configuration and rebuild.';
    default:
      // Keep the native error code visible so configuration and SDK failures
      // can be diagnosed from the login screen instead of being hidden.
      if (code && authError?.message) {
        return `Authentication failed (${code}): ${authError.message}`;
      }
      if (code) {
        return `Authentication failed (${code}). Please check the Firebase configuration.`;
      }
      return authError?.message || 'Authentication failed. Please try again.';
  }
}
