import { API_URL } from '@/core/constants';
import { Credentials } from '@/core/features/auth/types';
import { APIResult } from '@/core/types';

export const saveStatistics = async ({
  appId,
  credentials,
}: {
  appId: string;
  credentials: Credentials;
}): Promise<APIResult<boolean>> => {
  try {
    const response = await fetch(`${API_URL}/statistics`, {
      method: 'POST',
      body: JSON.stringify({
        appId,
        ...credentials,
      }),
    });
    const statisticsRes = await response.json();
    if (!statisticsRes?.data?.success) {
      return { data: false };
    }

    return { data: true };
  } catch (err: unknown) {
    console.error(err);
    return { data: false };
  }
};
