'use client';

import { UserItem as TUserItem } from '@/core/features/auth/types';
import UserItem from '@/core/features/statistics/components/UserItem';

type StatisticsProps = {
  visitors: TUserItem[];
};

const Statistics = ({ visitors }: StatisticsProps) => {
  return (
    <div className="flex flex-col w-full">
      <div className="flex items-start flex-wrap gap-x-5 gap-y-3">
        {visitors.map((data) => (
          <UserItem {...data} key={data.id} />
        ))}
      </div>
    </div>
  );
};

export default Statistics;
