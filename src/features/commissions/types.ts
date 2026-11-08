import type {Milestone} from '../commissionDashboard/types';

export interface CommissionTimelineItem {
  id: string;
  label: string;
  value: string;
}

export interface CommissionBreakdownMetric {
  id: string;
  label: string;
  value: string;
}

export interface MonthlyAverageData {
  averageCommissionPerMonth: string;
  basedOnMonths: string;
  averageOneTimePerMonth: string;
  averageRecurringPerMonth: string;
}

export interface CommissionsScreenData {
  title: string;
  availableBalance: string;
  availableBalanceSubValue: string;
  lifetimeEarned: string;
  lifetimeEarnedSubValue: string;
  withdrawn: string;
  withdrawnSubValue: string;
  timeline: CommissionTimelineItem[];
  breakdown: CommissionBreakdownMetric[];
  monthlyAverage: MonthlyAverageData;
  targetCommission: string;
  progress: number;
  progressLabel: string;
  milestones: Milestone[];
  ctaLabel: string;
}
