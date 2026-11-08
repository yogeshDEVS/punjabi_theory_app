import type {ProfileScreenData} from './types';

export const profileData: ProfileScreenData = {
  title: 'Profile',
  name: 'Rahul Kapoor',
  handle: '@rahul_kapoor',
  role: 'Senior Wealth Partner',
  initials: 'RK',
  stats: [
    {id: 'investors', label: 'Investors', value: '12'},
    {id: 'aum', label: 'Total AUM', value: '$48.2K'},
    {id: 'commission', label: 'This Month', value: '$380.40'},
  ],
  infoItems: [
    {id: 'email', label: 'Email', value: 'rahul.kapoor@gradecapital.in'},
    {id: 'phone', label: 'Phone', value: '+91 98765 43210'},
    {id: 'location', label: 'Location', value: 'Mumbai, India'},
    {id: 'memberSince', label: 'Member Since', value: 'March 2026'},
  ],
  actionItems: [
    {
      id: 'bank',
      title: 'Bank & Payout Details',
      subtitle: 'Manage linked account and withdrawal preferences',
    },
    {
      id: 'documents',
      title: 'Verification Documents',
      subtitle: 'Review KYC and uploaded compliance records',
    },
    {
      id: 'support',
      title: 'Support & Help',
      subtitle: 'Get in touch with the Grade Capital team',
    },
  ],
};
