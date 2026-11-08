export interface ProfileStat {
  id: string;
  label: string;
  value: string;
}

export interface ProfileInfoItem {
  id: string;
  label: string;
  value: string;
}

export interface ProfileActionItem {
  id: string;
  title: string;
  subtitle: string;
}

export interface ProfileScreenData {
  title: string;
  name: string;
  handle: string;
  role: string;
  initials: string;
  stats: ProfileStat[];
  infoItems: ProfileInfoItem[];
  actionItems: ProfileActionItem[];
}
