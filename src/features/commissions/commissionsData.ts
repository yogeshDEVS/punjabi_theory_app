import type {CommissionsScreenData} from './types';

const RUPEE = '\u20B9';

export const commissionsData: CommissionsScreenData = {
  title: 'Commissions',
  availableBalance: `${RUPEE}2,450.00`,
  availableBalanceSubValue: '5,450 USDT',
  lifetimeEarned: '$3,200.80',
  lifetimeEarnedSubValue: '$3,200.80',
  withdrawn: `${RUPEE}7500.00`,
  withdrawnSubValue: '$750.00',
  timeline: [
    {id: 'yesterday', label: 'Yesterday', value: '+$8.42'},
    {id: 'this-month', label: 'This Month (Mar)', value: '+$380.40'},
    {id: 'last-month', label: 'Last Month (Feb)', value: '+$310.20'},
  ],
  breakdown: [
    {id: 'one-time', label: 'One-Time Earned', value: '$1,800'},
    {id: 'recurring', label: 'Recurring Accrued', value: '$650.80'},
  ],
  monthlyAverage: {
    averageCommissionPerMonth: '$320.08',
    basedOnMonths: '10 months',
    averageOneTimePerMonth: '$180.00',
    averageRecurringPerMonth: '$140.08',
  },
  targetCommission: `${RUPEE}27,720`,
  progress: 0.28,
  progressLabel: `14% \u00b7 ${RUPEE}1,72,280 to reach ${RUPEE}2L`,
  milestones: [
    {id: '2l', amount: `${RUPEE}2L`},
    {id: '5l', amount: `${RUPEE}5L`},
    {id: '20l', amount: `${RUPEE}20L`, active: true},
    {id: '50l', amount: `${RUPEE}50L`},
    {id: '1cr', amount: `${RUPEE}1Cr`},
  ],
  ctaLabel: 'View Full Commission History',
};
