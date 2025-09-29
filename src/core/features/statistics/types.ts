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

export type StatisticsDBItem = {
  appId: string;
  data: string;
  timestamp: number;
};

export type Statistics = Omit<StatisticsProps, 'credentials'> & {
  password: string;
};

export type DecryptedStatistics = {
  data: Statistics;
  dateKey: string;
};
