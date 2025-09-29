'use client';

import { KeyIcon } from '@/core/components/icons/KeyIcon';
import { LocationIcon } from '@/core/components/icons/LocationIcon';
import { appCodeMap } from '@/core/features/statistics/data';
import { DecryptedStatistics } from '@/core/features/statistics/types';
import { useClipboard } from '@/core/hooks/useClipboard';
import { toast } from 'sonner';

const StatisticsItem = ({ data, dateKey }: DecryptedStatistics) => {
  const { copy } = useClipboard();

  const appData = appCodeMap.get(data.appId);

  const handleOpenLocation = (lat: string, long: string) => {
    window.open(
      `https://www.google.com/maps?q=${lat},${long}`,
      '_blank',
      'noopener,noreferrer'
    );
  };

  const handleCopyToClipboard = async (value: string) => {
    await copy(value);
    toast('Copied to clipboard');
  };

  return (
    <div className="flex w-full items-center flex-wrap gap-x-2 gap-y-1">
      {/* App data */}
      <div title="App ID" className="flex">
        <div
          className="w-1 rounded-xs"
          style={{ backgroundColor: appData?.color }}
        ></div>
        <div className="flex-center h-4 w-10 text-[10px] font-bold uppercase rounded-sm bg-background trans-c">
          {appData?.appCode}
        </div>
      </div>

      {/* Date */}
      <div className="text-muted">{dateKey}</div>

      {/* Password */}
      <div
        title="Password"
        onClick={() => handleCopyToClipboard(data.password)}
        className="w-4 tooltip-parent relative cursor-pointer transition-opacity"
      >
        <KeyIcon className="opacity-60" />
        <div className="tooltip flex gap-2 z-10">{data.password}</div>
      </div>

      {/* Location */}
      <div
        title="Location"
        onClick={() =>
          handleOpenLocation(data.geo.latitude, data.geo.longitude)
        }
        className="w-4 tooltip-parent relative cursor-pointer opacity-60 hover:opacity-100 transition-opacity"
      >
        <LocationIcon />
        <div className="tooltip flex gap-2 z-10">
          <div>{data.geo.latitude}</div>
          <div>{data.geo.longitude}</div>
        </div>
      </div>

      {/* City */}
      <div title="City">{data.geo.city}</div>

      {/* Country */}
      <div title="Country" className="text-muted">
        {data.geo.country}
      </div>

      {/* IP */}
      <div
        className="cursor-pointer"
        title="IP Address"
        onClick={() => handleCopyToClipboard(data.ip)}
      >
        {data.ip}
      </div>

      {/* OS */}
      <div className="flex gap-1 text-muted">
        <div title="OS">{data.system.os}</div>
        <div title="OS Version">{data.system.osVersion}</div>
      </div>

      {/* Browser */}
      <div title="Browser" className="text-muted">
        {data.system.browser}
      </div>
    </div>
  );
};

export default StatisticsItem;
