import ReactNativeBlobUtil from 'react-native-blob-util';

const getFilePath = (key: string): string =>
  `${ReactNativeBlobUtil.fs.dirs.DocumentDir}/redux_persist_${key}.json`;

export const reduxStorage = {
  async getItem(key: string): Promise<string | null> {
    try {
      const path = getFilePath(key);
      const exists = await ReactNativeBlobUtil.fs.exists(path);
      if (!exists) {
        return null;
      }
      return await ReactNativeBlobUtil.fs.readFile(path, 'utf8');
    } catch (error) {
      console.warn('reduxStorage.getItem error:', error);
      return null;
    }
  },

  async setItem(key: string, value: string): Promise<void> {
    try {
      const path = getFilePath(key);
      await ReactNativeBlobUtil.fs.writeFile(path, value, 'utf8');
    } catch (error) {
      console.warn('reduxStorage.setItem error:', error);
    }
  },

  async removeItem(key: string): Promise<void> {
    try {
      const path = getFilePath(key);
      const exists = await ReactNativeBlobUtil.fs.exists(path);
      if (exists) {
        await ReactNativeBlobUtil.fs.unlink(path);
      }
    } catch (error) {
      console.warn('reduxStorage.removeItem error:', error);
    }
  },
};
