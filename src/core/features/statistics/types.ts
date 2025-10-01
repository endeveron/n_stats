import { Credentials } from '@/core/features/auth/types';

export type StatisticsProps = {
  appId: string;
  credentials: Credentials;
  geo: {
    city: string;
    country: string;
    latitude: string;
    longitude: string;
    flag?: string;
    postalCode?: string;
  };
  ip: string;
  system: {
    browser: string;
    os: string;
    osVersion: string;
  };
};

export type StatisticsItem = {
  appId: string;
  timestamp: number;
};

export type StatisticsDBItem = StatisticsItem & {
  data: string;
};

export type Statistics = Omit<StatisticsProps, 'credentials'> & {
  password: string;
  timestamp: number;
};
