'use server';

import bcrypt from 'bcryptjs';
import { AuthError } from 'next-auth';

import { signIn as nextSignIn } from '~/auth';

import { DEFAULT_REDIRECT } from '@/core/constants';
import UserModel from '@/core/features/auth/models/user';
import {
  Credentials,
  SignInArgs,
  User,
  UserRole,
} from '@/core/features/auth/types';
import { mongoDB } from '@/core/lib/mongo';
import { ServerActionResult } from '@/core/types';
import { handleActionError } from '@/core/utils/error';

/**
 * Handles user signin using email and password, calling an authentication method.
 *
 * @param {string} params.email email address of the user.
 * @param {string} params.password password to the user account.
 * @returns a Promise that resolves to a value of type `ServerActionResult` or `undefined`.
 */
export const signIn = async ({
  email,
  password,
  redirectTo,
}: SignInArgs): Promise<ServerActionResult> => {
  try {
    // Call the `auth.providers.Credentials.authorize` method (./auth.ts)
    await nextSignIn('credentials', {
      email,
      password,
      redirectTo: redirectTo ? `/${redirectTo}` : DEFAULT_REDIRECT,
    });
    return { success: true };
  } catch (err: unknown) {
    // Do not use handleActionError here
    if (err instanceof AuthError) {
      switch (err.type) {
        case 'CredentialsSignin':
          return {
            success: false,
            error: { message: 'Invalid email or password' },
          };
        default:
          return {
            success: false,
            error: { message: 'Unable to sign in' },
          };
      }
    }
    throw err;
  }
};

/**
 * Checks user credentials against a database and returns user data if authentication is successful.
 *
 * @param {string} params.email email address of the user.
 * @param {string} params.password password to the user account.
 * @returns either the user data (id, name, email, role) if the provided email and password match a user in the database, or `null` if no user is found or the password does not match.
 */
export const authorizeUser = async ({ email, password }: Credentials) => {
  try {
    await mongoDB.connect();

    // Find a user document in the db that matches the provided email address.
    const user = await UserModel.findOne<User>({ email });
    if (!user || !user.id || !user.email || !user.role) return null;

    // Check the password
    const passwordsMatch = await bcrypt.compare(
      password,
      user.password as string
    );

    const userData = {
      id: user.id as string,
      name: user.name as string,
      email: user.email as string,
      role: user.role as UserRole,
    };

    // Debug logging
    // console.log('User data being returned from authorizeUser:', userData);

    if (passwordsMatch) return userData;
    return null;
  } catch (err: unknown) {
    handleActionError('Unable to authorize user', err);
    return null;
  }
};
