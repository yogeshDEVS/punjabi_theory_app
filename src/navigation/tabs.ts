import type {BottomTab} from '../features/commissionDashboard/types';
import type {AppTab} from '../features/commissionDashboard/types';

const tabConfig: Omit<BottomTab, 'active'>[] = [
  {id: 'home', label: 'HOME', icon: 'home'},
  {id: 'investors', label: 'INVESTORS', icon: 'investors'},
  {id: 'earnings', label: 'EARNINGS', icon: 'earnings'},
  {id: 'profile', label: 'PROFILE', icon: 'profile'},
];

export function buildBottomTabs(activeTab: AppTab): BottomTab[] {
  return tabConfig.map(tab => ({
    ...tab,
    active: tab.id === activeTab,
  }));
}
