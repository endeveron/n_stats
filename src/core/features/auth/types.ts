import { StatisticsDBItem } from '@/core/features/statistics/types';
import { Types } from 'mongoose';
import { Session } from 'next-auth';
import { JWT } from 'next-auth/jwt';

export enum UserRole {
  user = 'user',
  admin = 'admin',
}

export type User = {
  _id: Types.ObjectId;
  id: string;
  name?: string;
  email: string;
  emailConfirmed?: boolean;
  password?: string;
  role: UserRole;
  image?: string;
  statistics?: StatisticsDBItem[];
};

export interface GlobalAuthState {
  isSigningOut: boolean;
  isSignedOut: boolean;
  lastSignOutTime: number;
  sessionId: string | null;
  signOutCount: number;
}

export interface CustomToken extends JWT {
  userId: string;
  role: UserRole;
  accessToken?: string;
  error?: string;
}

// Extended session type with custom properties
export interface ExtendedSession extends Session {
  expires: string;
  iat?: number; // Token issued at time
}

export enum SocialProvider {
  google = 'google',
}

export type Credentials = {
  email: string;
  password: string;
};

export type SignInArgs = Credentials & {
  redirectTo?: string;
};

export type UserItem = Omit<User, '_id role password'>;
