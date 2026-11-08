export type Vehicle = 'adi';

export const vehicles: Array<{id: Vehicle; label: string; icon: string}> = [
  {id: 'adi', label: 'Learners Theory Test for Car Driving', icon: 'school'},
];

export const menuCards = [
  {
    id: 'practise',
    title: 'Practise',
    description: 'Start learning with topic-based quizzes',
    icon: 'fact-check',
    iconTone: '#49B7A5',
    iconBackground: '#E9FAF7',
  },
  {
    id: 'mock',
    title: 'Mock Exam',
    description: 'Ready for the real thing? Try a mock exam',
    icon: 'assignment-turned-in',
    iconTone: '#E86F2D',
    iconBackground: '#FFF0E7',
  },
  {
    id: 'roadSigns',
    title: 'Road Signs',
    description: 'Learn UK traffic signs and giving orders',
    icon: 'traffic',
    iconTone: '#C83A2A',
    iconBackground: '#FDEEEB',
  },
  {
    id: 'code',
    title: 'Highway Code',
    description: 'Get road-ready with essential driving rules',
    icon: 'route',
    iconTone: '#234B73',
    iconBackground: '#EEF5FD',
  },
] as const;

export const tabs = [
  {id: 'learn', label: 'Learn', icon: 'home'},
  {id: 'practice', label: 'Practice', icon: 'fact-check'},
  {id: 'mock', label: 'Mock Exam', icon: 'assignment-turned-in'},
  {id: 'dashboard', label: 'Test Dashboard', icon: 'insights'},
  {id: 'help', label: 'Help & Support', icon: 'support-agent'},
] as const;

export type HomeTab = (typeof tabs)[number]['id'];

export const brandLogo = require('../../images/logo.jpeg');

export const drawerItems = [
  {
    id: 'home',
    label: 'Home',
    icon: 'home',
  },
  {
    id: 'practice',
    label: 'Practise',
    icon: 'fact-check',
  },
  {
    id: 'highwayCode',
    label: 'Highway Code',
    icon: 'route',
  },
  {
    id: 'mockExam',
    label: 'Mock Exam',
    icon: 'assignment-turned-in',
  },
  {
    id: 'profile',
    label: 'Profile',
    icon: 'account-circle',
  },
  {
    id: 'leaderboard',
    label: 'Leaderboard',
    icon: 'leaderboard',
  },
  {
    id: 'roadSigns',
    label: 'Road Signs',
    icon: 'add-road',
  },
] as const;
