export const PRACTICE_TOTAL_QUESTIONS = 150;

export const practiceSummaryStats = [
  {
    id: 'all',
    value: PRACTICE_TOTAL_QUESTIONS,
    label: 'ALL QUESTIONS',
    showArrow: false,
    circleColor: '#BFDFFA',
  },
  {
    id: 'seen',
    value: 0,
    label: 'SEEN',
    showArrow: false,
    circleColor: '#BFDFFA',
  },
  {
    id: 'unseen',
    value: PRACTICE_TOTAL_QUESTIONS,
    label: 'NOT SEEN',
    showArrow: false,
    circleColor: '#BFDFFA',
  },
  {
    id: 'flagged',
    value: 0,
    label: 'FLAGGED',
    showArrow: true,
    circleColor: '#FFFFFF',
  },
] as const;

export const practiceTopics = [
  {
    id: 'road-procedures',
    title: 'Band 1 road procedure',
    subtitle: `0/${PRACTICE_TOTAL_QUESTIONS} Questions`,
    icon: 'crossroad',
    locked: false,
    progress: 0,
  },
  {
    id: 'traffic-signs',
    title: 'Band 2 traffic signs and sig...',
    subtitle: '0/266 Questions',
    icon: 'stop-sign',
    locked: true,
    progress: 0,
  },
] as const;

export type PracticeTopic = (typeof practiceTopics)[number];
