import ReactNativeBlobUtil from 'react-native-blob-util';

export interface PracticeStorageData {
  visitedQuestionIds: number[];
  flaggedQuestionIds: number[];
}

const STORAGE_FILE_PATH = `${ReactNativeBlobUtil.fs.dirs.DocumentDir}/grade_capital_practice_state.json`;

let memoryCache: PracticeStorageData = {
  visitedQuestionIds: [],
  flaggedQuestionIds: [],
};

export async function loadPracticeData(): Promise<PracticeStorageData> {
  try {
    const exists = await ReactNativeBlobUtil.fs.exists(STORAGE_FILE_PATH);
    if (exists) {
      const content = await ReactNativeBlobUtil.fs.readFile(
        STORAGE_FILE_PATH,
        'utf8',
      );
      if (content) {
        const parsed = JSON.parse(content);
        memoryCache = {
          visitedQuestionIds: Array.isArray(parsed.visitedQuestionIds)
            ? parsed.visitedQuestionIds
            : [],
          flaggedQuestionIds: Array.isArray(parsed.flaggedQuestionIds)
            ? parsed.flaggedQuestionIds
            : [],
        };
        return memoryCache;
      }
    }
  } catch (error) {
    console.warn('Could not load practice data from storage:', error);
  }
  return memoryCache;
}

export async function savePracticeData(
  data: PracticeStorageData,
): Promise<void> {
  memoryCache = data;
  try {
    const jsonString = JSON.stringify(data);
    await ReactNativeBlobUtil.fs.writeFile(
      STORAGE_FILE_PATH,
      jsonString,
      'utf8',
    );
  } catch (error) {
    console.warn('Could not save practice data to storage:', error);
  }
}
