export type InvestorStatus = 'Active' | 'Dormant' | 'KYC Pending';

export interface InvestorFilter {
  id: 'all' | 'active' | 'dormant';
  label: string;
  active?: boolean;
}

export interface InvestorItem {
  id: string;
  name: string;
  joinedOn: string;
  status: InvestorStatus;
  invested: string;
  current: string;
  returnValue: string;
}

export interface InvestorOverview {
  totalInvested: string;
  currentValue: string;
  totalReturns: string;
  totalReturnsDelta: string;
  walletBalance: string;
  activeInvestments: string;
}

export interface InvestorCommission {
  totalEarned: string;
  oneTimeEarned: string;
  recurringMonthly: string;
  recurringAccrued: string;
  remainingTerm: string;
  projectedRecurring: string;
}

export interface InvestorHolding {
  id: string;
  title: string;
  subtitle: string;
  tag: string;
  primaryLabel: string;
  primaryValue: string;
  secondaryLabel: string;
  secondaryValue: string;
  tertiaryLabel: string;
  tertiaryValue: string;
}

export interface InvestorDetail {
  id: string;
  title: string;
  name: string;
  joinedOn: string;
  verificationLabel: string;
  portfolioSummaryUrl: string;
  overview: InvestorOverview;
  commission: InvestorCommission;
  holdings: InvestorHolding[];
}

export interface InvestorsScreenData {
  title: string;
  searchPlaceholder: string;
  filters: InvestorFilter[];
  investors: InvestorItem[];
  detailsById: Record<string, InvestorDetail>;
}
