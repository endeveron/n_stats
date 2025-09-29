'use server';

import { format } from 'date-fns';

import UserModel from '@/core/features/auth/models/user';
import { UserItem } from '@/core/features/auth/types';
import {
  ADMIN_DATE_FORMAT,
  RECENT_STATISTICS_NUMBER,
} from '@/core/features/statistics/constants';
import {
  DecryptedStatistics,
  Statistics,
  StatisticsDBItem,
  StatisticsProps,
} from '@/core/features/statistics/types';
import { decryptObject, encryptObject } from '@/core/lib/crypto';
import { mongoDB } from '@/core/lib/mongo';
import { ServerActionResult } from '@/core/types';
import { handleActionError } from '@/core/utils/error';
import { configureUser } from '@/core/utils/user';

/**
 * Creates a new user in a database and returns the user's object ID.
 *
 * @param {string} params.email email address of the user.
 * @param {string} params.password user's password.
 * @returns a Promise that resolves to either a ServerActionResult object or undefined.
 */
export const saveStatistics = async ({
  appId,
  credentials,
  geo,
  ip,
  system,
}: StatisticsProps): Promise<ServerActionResult | undefined> => {
  const { email, password } = credentials;
  const errMsg = 'Unable to save user statistics';

  try {
    if (!email || !password) {
      return handleActionError(`${errMsg}. Invalid credentials`);
    }

    await mongoDB.connect();

    // Find user by email
    let user = await UserModel.findOne({ email });

    // Don't save admin's statistics
    if (user?.role === 'admin') return { success: true };

    // Create a new user
    if (!user) {
      console.info(
        `saveStatistics: No users with the email address ${email} are registered. Creating a new user in db...`
      );
      const userData = configureUser({ email });
      user = await UserModel.create(userData);
    }

    // Encrypt statistics
    const encryptedStats = encryptObject({
      geo,
      ip,
      password,
      system,
    });

    // Add data to user, save in db
    const statisticsDBItem: StatisticsDBItem = {
      appId,
      timestamp: Date.now(),
      data: encryptedStats,
    };
    user.statistics.push(statisticsDBItem);
    await user.save();

    return {
      success: true,
    };
  } catch (err: unknown) {
    return handleActionError(errMsg, err);
  }
};

export const getStatistics = async (
  recentItemsNumber = RECENT_STATISTICS_NUMBER,
  appId?: string
): Promise<ServerActionResult<UserItem[]> | undefined> => {
  const errMsg = 'Unable to receive statistics';
  try {
    await mongoDB.connect();

    // Build the input for sorting based on whether appId is provided
    const statisticsInput = appId
      ? {
          $filter: {
            input: '$statistics',
            as: 'stat',
            cond: { $eq: ['$$stat.appId', appId] },
          },
        }
      : '$statistics';

    const users = await UserModel.aggregate<UserItem>([
      {
        $match: {
          role: { $ne: 'admin' },
        },
      },
      {
        $addFields: {
          statistics: {
            $map: {
              input: {
                $slice: [
                  {
                    $sortArray: {
                      input: statisticsInput,
                      sortBy: { timestamp: -1 },
                    },
                  },
                  recentItemsNumber,
                ],
              },
              as: 'stat',
              in: {
                timestamp: '$$stat.timestamp',
                appId: '$$stat.appId',
              },
            },
          },
        },
      },
      {
        $project: {
          _id: 0, // Exclude _id as per UserItem type
          id: { $toString: '$_id' }, // Convert ObjectId to string for id field
          name: 1,
          email: 1,
          emailConfirmed: 1,
          image: 1,
          statistics: 1,
        },
      },
    ]);

    return {
      success: true,
      data: users,
    };
  } catch (err: unknown) {
    return handleActionError(errMsg, err);
  }
};

export const decryptStatistics = async (
  email: string,
  recentItemsNumber = RECENT_STATISTICS_NUMBER
): Promise<ServerActionResult<DecryptedStatistics[]> | undefined> => {
  const errMsg = 'Unable to decrypt statistics';

  try {
    await mongoDB.connect();

    const users = await UserModel.aggregate([
      {
        $match: { email },
      },
      {
        $project: {
          _id: 0,
          statistics: {
            $slice: [
              {
                $sortArray: {
                  input: '$statistics',
                  sortBy: { timestamp: -1 },
                },
              },
              recentItemsNumber,
            ],
          },
        },
      },
    ]);

    const statistics = users[0]?.statistics;

    if (!statistics) {
      return {
        success: false,
        error: { message: 'Unable to recieve statistics from database' },
      };
    }

    const decryptedStatistics: DecryptedStatistics[] = [];

    for (const { data: encryptedData, appId, timestamp } of statistics) {
      const data = decryptObject<Statistics>(encryptedData);
      data.appId = appId;

      decryptedStatistics.push({
        data,
        dateKey: format(timestamp, ADMIN_DATE_FORMAT),
      });
    }

    return {
      success: true,
      data: decryptedStatistics,
    };
  } catch (err: unknown) {
    return handleActionError(errMsg, err);
  }
};
