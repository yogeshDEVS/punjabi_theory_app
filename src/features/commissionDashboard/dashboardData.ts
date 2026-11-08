import type {DashboardData} from './types';

const RUPEE = '\u20B9';

export const dashboardData: DashboardData = {
  greeting: 'Hi, Rahul Kapoor',
  handle: '@rahul_kapoor',
  commissionBalance: `${RUPEE}2,450.00`,
  commissionBalanceSubValue: '5,450 USDT',
  summaryMetrics: [
    {
      id: 'one-time',
      label: 'ONE TIME',
      value: `${RUPEE}1,29,504`,
      subValue: '$1500.00',
    },
    {
      id: 'recurring',
      label: 'RECURRING',
      value: `${RUPEE}50,616`,
      subValue: '$650.80',
    },
  ],
  lifetimeEarnings: `${RUPEE}4,820.60`,
  lifetimeEarningsSubValue: '5,450 USDT',
  earningsMetrics: [
    {
      id: 'yesterday',
      label: 'YESTERDAY',
      value: `${RUPEE}3,17,010`,
      subValue: '$8.42',
    },
    {
      id: 'this-month',
      label: 'THIS MONTH',
      value: `${RUPEE}3,17,010`,
      subValue: '$380.40',
    },
    {
      id: 'last-month',
      label: 'LAST MONTH',
      value: `${RUPEE}3,17,010`,
      subValue: '$310.20',
    },
  ],
  stats: [
    {id: 'investors', value: '12', label: 'INVESTORS'},
    {id: 'aum', value: '$48.2K', label: 'TOTAL AUM'},
    {id: 'return', value: '+18%', label: 'CUM. RETURN', accent: true},
  ],
  commissionTarget: `${RUPEE}27,720`,
  progress: 0.36,
  progressLabel: `14% \u00b7 ${RUPEE}1,72,280 to reach ${RUPEE}2L`,
  milestones: [
    {id: '2l', amount: `${RUPEE}2L`},
    {id: '5l', amount: `${RUPEE}5L`},
    {id: '20l', amount: `${RUPEE}20L`, active: true},
    {id: '50l', amount: `${RUPEE}50L`},
    {id: '1cr', amount: `${RUPEE}1Cr`},
  ],
  quickActions: [
    {
      id: 'withdraw',
      title: 'Withdraw',
      subtitle: 'Transfer to bank',
      icon: 'withdraw',
    },
    {
      id: 'share',
      title: 'Share',
      subtitle: 'Invite new client',
      icon: 'share',
    },
    {
      id: 'transactions',
      title: 'Transactions',
      subtitle: 'View all transfers',
      icon: 'transactions',
    },
    {
      id: 'commissions',
      title: 'Commissions',
      subtitle: 'View breakdown',
      icon: 'commissions',
    },
    {
      id: 'baskets',
      title: 'Baskets',
      subtitle: 'Browse all',
      icon: 'baskets',
    },
    {
      id: 'calculator',
      title: 'Calculator',
      subtitle: 'SIP returns',
      icon: 'calculator',
    },
  ],
};
