export interface SummaryMetric {
  id: string;
  label: string;
  value: string;
  subValue: string;
}

export interface StatMetric {
  id: string;
  value: string;
  label: string;
  accent?: boolean;
}

export interface Milestone {
  id: string;
  amount: string;
  active?: boolean;
}

export type QuickActionIcon =
  | 'withdraw'
  | 'share'
  | 'transactions'
  | 'commissions'
  | 'baskets'
  | 'calculator';

export interface QuickAction {
  id: string;
  title: string;
  subtitle: string;
  icon: QuickActionIcon;
}

export type BottomTabIcon = 'home' | 'investors' | 'earnings' | 'profile';
export type AppTab = BottomTabIcon;

export interface BottomTab {
  id: AppTab;
  label: string;
  icon: BottomTabIcon;
  active?: boolean;
}

export interface DashboardData {
  greeting: string;
  handle: string;
  commissionBalance: string;
  commissionBalanceSubValue: string;
  summaryMetrics: SummaryMetric[];
  lifetimeEarnings: string;
  lifetimeEarningsSubValue: string;
  earningsMetrics: SummaryMetric[];
  stats: StatMetric[];
  commissionTarget: string;
  progress: number;
  progressLabel: string;
  milestones: Milestone[];
  quickActions: QuickAction[];
}
