'use client';

import { toast } from 'sonner';

import { KeyIcon } from '@/core/components/icons/KeyIcon';
import { LocationIcon } from '@/core/components/icons/LocationIcon';
import AppDate from '@/core/features/statistics/components/AppDate';
import { Statistics } from '@/core/features/statistics/types';
import { useClipboard } from '@/core/hooks/useClipboard';

const StatisticsItemDecrypted = ({
  appId,
  geo,
  ip,
  password,
  system,
  timestamp,
}: Statistics) => {
  const { copy } = useClipboard();

  const handleOpenLocation = (lat: string, long: string) => {
    if (!Number.isInteger(lat) || !!Number.isInteger(long)) return;

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
      <AppDate appId={appId} timestamp={timestamp} />

      {/* Password */}
      <div
        title="Password"
        onClick={() => handleCopyToClipboard(password)}
        className="w-4 tooltip-parent relative cursor-pointer transition-opacity"
      >
        <KeyIcon className="opacity-60" />
        <div className="tooltip flex gap-2 z-10">{password}</div>
      </div>

      {/* Location */}
      <div
        title="Location"
        onClick={() => handleOpenLocation(geo.latitude, geo.longitude)}
        className="w-4 tooltip-parent relative cursor-pointer opacity-60 hover:opacity-100 transition-opacity"
      >
        <LocationIcon />
        <div className="tooltip flex gap-2 z-10">
          <div>{geo.latitude}</div>
          <div>{geo.longitude}</div>
        </div>
      </div>

      {/* City */}
      <div title="City">{geo.city}</div>

      {/* Country */}
      <div title="Country" className="text-muted">
        {geo.country}
      </div>

      {/* IP */}
      <div
        className="cursor-pointer"
        title="IP Address"
        onClick={() => handleCopyToClipboard(ip)}
      >
        {ip}
      </div>

      {/* OS */}
      <div className="flex gap-1 text-muted">
        <div title="OS">{system.os}</div>
        <div title="OS Version">{system.osVersion}</div>
      </div>

      {/* Browser */}
      <div title="Browser" className="text-muted">
        {system.browser}
      </div>
    </div>
  );
};

export default StatisticsItemDecrypted;
