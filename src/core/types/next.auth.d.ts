import { DefaultSession, DefaultUser } from 'next-auth';
import { UserRole } from '@/core/features/auth/types';

declare module 'next-auth' {
  interface Session {
    accessToken?: string;
    error?: string;
    user: {
      id: string;
      role: UserRole;
    } & DefaultSession['user'];
  }

  interface User extends DefaultUser {
    id: string;
    role: UserRole;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    userId: string;
    role: UserRole;
    accessToken?: string;
    error?: string;
  }
}
