import {Platform, StatusBar} from 'react-native';

export const homePalette = {
  background: '#F3EFE7',
  heroStart: '#17344E',
  shell: '#FFFDF8',
  surface: '#FFF9F1',
  ink: '#163047',
  muted: '#6D7A86',
  line: '#DDD2C2',
  accent: '#E86F2D',
  mint: '#49B7A5',
  navy: '#234B73',
  white: '#FFFFFF',
  shadow: '#CBBEAD',
} as const;

export const homeInsets = {
  androidTopInset: Platform.OS === 'android' ? (StatusBar.currentHeight ?? 5) : 0,
  bottomSafeInset: Platform.OS === 'android' ? 20 : 0,
} as const;
