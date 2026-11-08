import firestore from '@react-native-firebase/firestore';

export interface PracticeProgress {
  visitedQuestionIds: number[];
  flaggedQuestionIds: number[];
}

const emptyProgress: PracticeProgress = {
  visitedQuestionIds: [],
  flaggedQuestionIds: [],
};

function progressDocument(uid: string) {
  return firestore()
    .collection('users')
    .doc(uid)
    .collection('practiceProgress')
    .doc('current');
}

function normalizeProgress(data?: {[key: string]: unknown}): PracticeProgress {
  const visited = data?.visitedQuestionIds;
  const flagged = data?.flaggedQuestionIds;
  return {
    visitedQuestionIds: Array.isArray(visited)
      ? visited.filter((id): id is number => typeof id === 'number')
      : [],
    flaggedQuestionIds: Array.isArray(flagged)
      ? flagged.filter((id): id is number => typeof id === 'number')
      : [],
  };
}

export async function loadPracticeProgress(uid: string): Promise<PracticeProgress> {
  const snapshot = await progressDocument(uid).get();
  return snapshot.exists ? normalizeProgress(snapshot.data()) : emptyProgress;
}

export async function savePracticeProgress(
  uid: string,
  progress: PracticeProgress,
): Promise<void> {
  await progressDocument(uid).set(
    {
      visitedQuestionIds: [...new Set(progress.visitedQuestionIds)],
      flaggedQuestionIds: [...new Set(progress.flaggedQuestionIds)],
      updatedAt: firestore.FieldValue.serverTimestamp(),
    },
    {merge: true},
  );
}
