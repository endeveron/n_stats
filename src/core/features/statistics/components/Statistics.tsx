'use client';

import { UserItem as TUserItem } from '@/core/features/auth/types';
import { ItemMode } from '@/core/features/statistics/components/DashboardClient';
import UserItem from '@/core/features/statistics/components/UserItem';
import { cn } from '@/core/utils';

type StatisticsProps = {
  fetching: boolean;
  itemMode: ItemMode | null;
  visitors: TUserItem[];
};

const Statistics = ({ fetching, itemMode, visitors }: StatisticsProps) => {
  return (
    <div className="flex flex-col w-full">
      <div
        className={cn(
          'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 items-start flex-1 w-full gap-x-4 gap-y-3 trans-o',
          fetching ? 'opacity-20 pointer-events-none' : 'opacity-100'
        )}
      >
        {visitors.map((data) => (
          <UserItem {...data} forcedMode={itemMode} key={data.id} />
        ))}
      </div>
    </div>
  );
};

export default Statistics;
