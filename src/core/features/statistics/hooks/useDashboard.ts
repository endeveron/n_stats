'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { getStatistics } from '@/core/features/statistics/actions';
import { UserItem } from '@/core/features/auth/types';
import { handleServerActionResult } from '@/core/utils';

export function useDashboard({ email }: { email?: string | null }) {
  const [fetchedUsers, setFetchedUsers] = useState<UserItem[]>([]);

  // Fetch and sync user data from database
  useEffect(() => {
    if (!email) return;

    const syncStatistics = async () => {
      try {
        const res = await getStatistics(8);
        const { data } = handleServerActionResult({
          errMsg: 'Failed to recieve statistics from database',
          fallbackData: [],
          fileName: 'useDashboard',
          res,
        });

        setFetchedUsers(data);
      } catch (error) {
        console.error('[useDashboard] Error syncing user data:', error);
        toast('Unable to retrieve data from database');
      }
    };

    syncStatistics();
  }, [email]);

  return {
    fetchedUsers,
  };
}
