'use client';

import { format } from 'date-fns';
import { useState } from 'react';
import { toast } from 'sonner';
import { v4 as uuid } from 'uuid';

import { KeyIcon } from '@/core/components/icons/KeyIcon';
import { LocationIcon } from '@/core/components/icons/LocationIcon';
import { Button } from '@/core/components/ui/Button';
import LoadingIcon from '@/core/components/ui/LoadingIcon';
import { UserItem as TUserItem } from '@/core/features/auth/types';
import { decryptStatistics } from '@/core/features/statistics/actions';
import { ADMIN_DATE_FORMAT } from '@/core/features/statistics/constants';
import { appCodeMap } from '@/core/features/statistics/data';
import { DecryptedStatistics } from '@/core/features/statistics/types';
import { handleServerActionResult } from '@/core/utils';

type UserItemProps = TUserItem & {};

const UserItem = ({ email, statistics }: UserItemProps) => {
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [decrypted, setDecrypted] = useState<DecryptedStatistics[]>([]);

  const isDecrypted = decrypted.length;

  const handleDecryptStatistics = async () => {
    setLoading(true);
    const errMsg = 'Failed to decrypt statistics';
    try {
      const res = await decryptStatistics(email);
      const { data, error } = handleServerActionResult({
        errMsg,
        fallbackData: [],
        fileName: 'UserItem',
        res,
      });
      if (data.length) setDecrypted(data);
      if (error) toast(error);
    } catch (err: unknown) {
      toast(errMsg);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenLocation = (lat: string, long: string) => {
    window.open(
      `https://www.google.com/maps?q=${lat},${long}`,
      '_blank',
      'noopener,noreferrer'
    );
  };

  return (
    <div className="w-full max-w-xl flex flex-col text-sm font-semibold rounded-2xl bg-card overflow-hidden trans-c shadow-xs">
      {/* Header */}
      <div
        className="relative p-4 flex justify-between cursor-pointer leading-none"
        onClick={() => setExpanded((prev) => !prev)}
      >
        {isDecrypted ? (
          <div className="absolute top-1/2 -translate-y-1/2 left-0 w-1 h-4 rounded-xs bg-brand" />
        ) : null}

        {/* Email */}
        <div className="font-bold">{email}</div>

        {/* Stats counter */}
        {statistics?.length ? (
          <div className="text-muted">{statistics?.length}</div>
        ) : null}
      </div>

      {/* Content */}
      {expanded && statistics?.length ? (
        <div className="relative p-4 border-t border-t-border bg-area/20 trans-c">
          {/* Statistics */}
          {isDecrypted ? (
            <div className="flex flex-col items-center gap-4 text-xs font-bold">
              {decrypted.map((item) => {
                const appData = appCodeMap.get(item.data.appId);

                return (
                  <div
                    className="flex w-full flex-wrap gap-x-2 gap-y-1"
                    key={uuid()}
                  >
                    {/* App data */}
                    <div
                      className="uppercase"
                      style={{ color: appData?.color }}
                    >
                      {appData?.appCode}
                    </div>

                    {/* Date, Password */}
                    <div className="flex gap-2">
                      <div className="text-muted">{item.dateKey}</div>
                      <div title="Password" className="flex gap-2">
                        <KeyIcon className="opacity-60" />
                        {item.data.password}
                      </div>
                    </div>

                    {/* Location */}
                    <div className="flex gap-2">
                      {/* Location icon */}
                      <div
                        onClick={() =>
                          handleOpenLocation(
                            item.data.geo.latitude,
                            item.data.geo.longitude
                          )
                        }
                        className="w-4 tooltip-parent relative cursor-pointer opacity-60 hover:opacity-100 transition-opacity"
                      >
                        <LocationIcon />
                        <div className="tooltip flex gap-2 z-10">
                          <div>{item.data.geo.latitude}</div>
                          <div>{item.data.geo.longitude}</div>
                        </div>
                      </div>

                      {/* City, Country */}
                      <div className="flex gap-2">
                        <div title="City">{item.data.geo.city}</div>
                        <div title="Country" className="text-muted">
                          {item.data.geo.country}
                        </div>
                      </div>

                      {/* IP */}
                      <div title="IP Address" className="text-muted">
                        {item.data.ip}
                      </div>
                    </div>

                    <div className="flex gap-2 text-muted">
                      {/* OS */}
                      <div className="flex gap-1">
                        <div title="OS">{item.data.system.os}</div>
                        <div title="OS Version">
                          {item.data.system.osVersion}
                        </div>
                      </div>

                      {/* Browser */}
                      <div title="Browser">{item.data.system.browser}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="flex flex-wrap gap-x-4 gap-y-2 text-muted text-xs font-bold">
                {statistics.map((item) => (
                  <div key={item.timestamp}>
                    {format(item.timestamp, ADMIN_DATE_FORMAT)}
                  </div>
                ))}
              </div>

              <Button
                size="sm"
                variant="outline"
                loading={loading}
                onClick={handleDecryptStatistics}
                className="mt-3"
              >
                Decrypt
              </Button>
            </div>
          )}

          {/* Loading overlay */}
          {loading ? (
            <div className="absolute inset-0 flex-center bg-card/80">
              <LoadingIcon />
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
};

export default UserItem;
