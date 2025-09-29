'use client';

import { format } from 'date-fns';
import { useState } from 'react';
import { toast } from 'sonner';
import { v4 as uuid } from 'uuid';

import { Button } from '@/core/components/ui/Button';
import LoadingIcon from '@/core/components/ui/LoadingIcon';
import { UserItem as TUserItem } from '@/core/features/auth/types';
import { decryptStatistics } from '@/core/features/statistics/actions';
import { ADMIN_DATE_FORMAT } from '@/core/features/statistics/constants';
import { DecryptedStatistics } from '@/core/features/statistics/types';
import { handleServerActionResult } from '@/core/utils';
import StatisticsItem from '@/core/features/statistics/components/StatisticsItem';

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
          {isDecrypted ? (
            <div className="flex flex-col items-center gap-4 text-xs font-bold">
              {decrypted.map((item) => (
                <StatisticsItem {...item} key={uuid()} />
              ))}
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
