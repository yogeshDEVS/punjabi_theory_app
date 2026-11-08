import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {reduxStorage} from '../store/storage';

const LOCAL_STORAGE_KEY_PREFIX = 'road_signs_progress_';

// In-memory cache so we never do redundant file reads within the same session
const memoryCache: Record<string, number> = {};

/**
 * Reads local progress from AsyncStorage (file-backed).
 * Uses an in-memory cache to avoid redundant file reads.
 */
async function readLocalProgress(topicId: string): Promise<number> {
  // Check memory cache first
  if (memoryCache[topicId] !== undefined) {
    return memoryCache[topicId];
  }

  try {
    const localKey = `${LOCAL_STORAGE_KEY_PREFIX}${topicId}`;
    const cached = await reduxStorage.getItem(localKey);
    if (cached) {
      const parsed = JSON.parse(cached);
      const val = Number(parsed.percentage) || 0;
      memoryCache[topicId] = val;
      return val;
    }
  } catch (err) {
    console.warn('Could not read local road signs progress:', err);
  }

  memoryCache[topicId] = 0;
  return 0;
}

/**
 * Writes progress to local storage (only if greater than existing).
 */
async function writeLocalProgress(
  topicId: string,
  percentage: number,
): Promise<void> {
  const current = memoryCache[topicId] ?? 0;
  if (percentage <= current) {
    return;
  }

  memoryCache[topicId] = percentage;

  try {
    const localKey = `${LOCAL_STORAGE_KEY_PREFIX}${topicId}`;
    await reduxStorage.setItem(
      localKey,
      JSON.stringify({
        percentage,
        updatedAt: Date.now(),
      }),
    );
  } catch (err) {
    console.warn('Could not save road signs progress locally:', err);
  }
}

/**
 * Saves progress to both local storage and Firestore.
 * Only saves if the new value is higher than the stored value (monotonically increasing).
 * @param topicId e.g. 'signs-giving-orders'
 * @param percentage number between 0 and 100
 */
export async function saveRoadSignsProgress(
  topicId: string,
  percentage: number,
): Promise<void> {
  const safePercentage = Math.min(100, Math.max(0, Math.round(percentage)));

  // 1. Save locally (fast, synchronous memory + async file write)
  await writeLocalProgress(topicId, safePercentage);

  // 2. Save to Firestore if user is authenticated
  try {
    const user = auth().currentUser;
    if (user) {
      const docRef = firestore()
        .collection('users')
        .doc(user.uid)
        .collection('roadSignsProgress')
        .doc(topicId);

      await firestore().runTransaction(async transaction => {
        const snapshot = await transaction.get(docRef);
        const existingData = snapshot.data();
        const previousScore = existingData?.percentage ?? 0;

        if (safePercentage > previousScore) {
          transaction.set(
            docRef,
            {
              topicId,
              percentage: safePercentage,
              updatedAt: firestore.FieldValue.serverTimestamp(),
            },
            {merge: true},
          );
        }
      });
    }
  } catch (err) {
    console.warn('Could not sync road signs progress to Firestore:', err);
  }
}

/**
 * Retrieves the highest progress percentage (max of local and Firestore).
 * @param topicId e.g. 'signs-giving-orders'
 */
export async function getRoadSignsProgress(topicId: string): Promise<number> {
  const localPercentage = await readLocalProgress(topicId);

  // Check Firestore if user is logged in
  try {
    const user = auth().currentUser;
    if (user) {
      const doc = await firestore()
        .collection('users')
        .doc(user.uid)
        .collection('roadSignsProgress')
        .doc(topicId)
        .get();

      if (doc.exists) {
        const firestorePercentage = Number(doc.data()?.percentage) || 0;
        const maxVal = Math.max(localPercentage, firestorePercentage);

        // Sync the higher value back to local cache
        if (maxVal > localPercentage) {
          await writeLocalProgress(topicId, maxVal);
        }

        return maxVal;
      }
    }
  } catch (err) {
    console.warn('Could not fetch road signs progress from Firestore:', err);
  }

  return localPercentage;
}

/**
 * Subscribes to real-time progress updates.
 * Combines Firestore onSnapshot with periodic local-storage polling
 * so progress updates are always reflected even without Firestore.
 * @param topicId e.g. 'signs-giving-orders'
 * @param onUpdate callback when progress changes
 * @returns unsubscribe function
 */
export function subscribeRoadSignsProgress(
  topicId: string,
  onUpdate: (percentage: number) => void,
): () => void {
  let isSubscribed = true;
  let lastReported = -1;

  const reportProgress = (val: number) => {
    if (!isSubscribed) {
      return;
    }
    const rounded = Math.min(100, Math.max(0, Math.round(val)));
    if (rounded !== lastReported) {
      lastReported = rounded;
      onUpdate(rounded);
    }
  };

  // 1. Immediate local load
  getRoadSignsProgress(topicId).then(val => {
    reportProgress(val);
  });

  // 2. Poll local memory cache every 1s to pick up scroll-driven changes
  //    This ensures the RoadSignsScreen card updates even without Firestore
  const pollInterval = setInterval(() => {
    if (!isSubscribed) {
      return;
    }
    const cached = memoryCache[topicId] ?? 0;
    reportProgress(cached);
  }, 1000);

  // 3. Real-time Firestore subscription if logged in
  const user = auth().currentUser;
  let unsubFirestore: (() => void) | null = null;

  if (user) {
    unsubFirestore = firestore()
      .collection('users')
      .doc(user.uid)
      .collection('roadSignsProgress')
      .doc(topicId)
      .onSnapshot(
        snapshot => {
          if (!isSubscribed || !snapshot || !snapshot.exists) {
            return;
          }
          const data = snapshot.data();
          if (data && typeof data.percentage === 'number') {
            // Also update memory cache so local is always in sync
            const firestoreVal = data.percentage;
            const current = memoryCache[topicId] ?? 0;
            if (firestoreVal > current) {
              memoryCache[topicId] = firestoreVal;
            }
            reportProgress(Math.max(firestoreVal, current));
          }
        },
        error => {
          console.warn('roadSignsProgress listener error:', error);
        },
      );
  }

  return () => {
    isSubscribed = false;
    clearInterval(pollInterval);
    if (unsubFirestore) {
      unsubFirestore();
    }
  };
}
