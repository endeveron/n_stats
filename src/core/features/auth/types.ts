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

export type TUserData = {
  name: string;
  email: string;
};

export type Invite = {
  code: string;
  userId?: Types.ObjectId;
  timestamp?: number;
};

export interface JwtEmailPayload {
  userId: string;
  exp: number;
}

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
  // refreshToken?: string;
  // accessTokenExpires?: number;
  error?: string;
}

// Extended session type with custom properties
export interface ExtendedSession extends Session {
  // accessToken?: string;
  // user: {
  //   id: string;
  //   role: UserRole;
  //   name?: string | null;
  //   email?: string | null;
  //   image?: string | null;
  // };
  expires: string;
  // accessTokenExpiry?: number;
  // refreshTokenExpiry?: number;
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

export type SignInSocialArgs = {
  provider: SocialProvider;
  email: string;
  emailConfirmed: boolean;
  name?: string | null;
  image?: string | null;
};

export type SignUpArgs = {
  email: string;
};

export type OnboardUserArgs = {
  userId: string;
  name?: string;
  password: string;
  inviteCode: string;
};

export type CreateUserArgs = {
  email: string;
};

export type UserItem = Omit<User, '_id role password'>;
