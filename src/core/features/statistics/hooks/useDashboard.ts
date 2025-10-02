'use client';

import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

import { getStatistics } from '@/core/features/statistics/actions';
import { UserItem } from '@/core/features/auth/types';
import { handleServerActionResult } from '@/core/utils';

export function useDashboard({ email }: { email?: string | null }) {
  const pathname = usePathname();

  const [visitors, setVisitors] = useState<UserItem[]>([]);
  const [fetching, setFetching] = useState(false);

  const updateStatistics = useCallback(async () => {
    setFetching(true);

    setTimeout(async () => {
      try {
        const res = await getStatistics({
          recentItemsNumber: 8,
          path: pathname,
        });
        const { data } = handleServerActionResult({
          errMsg: 'Failed to recieve statistics from database',
          fallbackData: [],
          fileName: 'useDashboard',
          res,
        });

        setVisitors(data);
      } catch (error) {
        console.error('[useDashboard] Error syncing user data:', error);
        toast('Unable to retrieve data from database');
      } finally {
        setFetching(false);
      }
    }, 1000);
  }, [pathname]);

  // Fetch and sync user data from database
  useEffect(() => {
    if (!email) return;

    updateStatistics();
  }, [email, updateStatistics]);

  return {
    fetching,
    visitors,
    updateStatistics,
  };
}
