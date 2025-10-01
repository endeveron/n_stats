'use client';

import { format } from 'date-fns';

import { ADMIN_DATE_FORMAT } from '@/core/features/statistics/constants';
import { appCodeMap } from '@/core/features/statistics/data';
import { StatisticsItem } from '@/core/features/statistics/types';

const AppDate = ({ appId, timestamp }: StatisticsItem) => {
  const appData = appCodeMap.get(appId);
  const formattedDate = format(timestamp, ADMIN_DATE_FORMAT);

  return (
    <div className="flex items-center gap-1 text-xs font-bold uppercase">
      {/* App data */}
      <div title="App ID" className="flex">
        <div
          className="w-1 h-4 rounded-xs"
          style={{ backgroundColor: appData?.color }}
        ></div>
        <div className="flex-center h-full w-10 pl-0.5">
          <span className="">{appData?.appCode}</span>
        </div>
      </div>

      {/* Date */}
      <div className="text-muted">{formattedDate}</div>
    </div>
  );
};

export default AppDate;
