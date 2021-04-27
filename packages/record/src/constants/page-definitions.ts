import {
  CogIcon as Options,
  HomeIcon as Home,
  StatusOnlineIcon as Groups,
} from '@heroicons/react/solid';

export const pages = [
  { path: '/', label: 'Home', Icon: Home },
  { path: '/speaker-groups', label: 'Speaker Groups', Icon: Groups },
  { path: '/options', label: 'Options', Icon: Options },
] as const;
