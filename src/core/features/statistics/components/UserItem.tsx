'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { v4 as uuid } from 'uuid';

import { Button } from '@/core/components/ui/Button';
import LoadingIcon from '@/core/components/ui/LoadingIcon';
import { UserItem as TUserItem } from '@/core/features/auth/types';
import { decryptStatistics } from '@/core/features/statistics/actions';
import StatisticsItemDecrypted from '@/core/features/statistics/components/StatisticsItemDecrypted';
import { Statistics } from '@/core/features/statistics/types';
import { handleServerActionResult } from '@/core/utils';
import AppDate from '@/core/features/statistics/components/AppDate';

type UserItemProps = TUserItem & {};

const UserItem = ({ email, statistics }: UserItemProps) => {
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [decrypted, setDecrypted] = useState<Statistics[]>([]);

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
      if (data.length) {
        setDecrypted(data);
        if (!expanded) {
          setExpanded(true);
        }
      }
      if (error) toast(error);
    } catch (err: unknown) {
      toast(errMsg);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-xl flex flex-col text-sm font-semibold rounded-2xl bg-area overflow-hidden trans-c shadow-xs">
      {/* Header */}
      <div className="min-h-8 relative flex justify-between cursor-pointer leading-none rounded-2xl bg-card">
        <div
          onClick={() => setExpanded((prev) => !prev)}
          className="flex flex-1 items-center gap-2 px-4 font-bold"
        >
          {/* Email */}
          <div className="flex items-center">{email}</div>

          {/* Stats counter */}
          {statistics?.length ? (
            <div className="text-muted text-xs translate-y-0.25">
              {statistics.length}
            </div>
          ) : null}
        </div>

        {!isDecrypted ? (
          <Button
            variant="secondary"
            loading={loading}
            onClick={handleDecryptStatistics}
            size="sm"
            className="button--sm"
          >
            Decrypt
          </Button>
        ) : null}
      </div>

      {/* Content */}
      {expanded && statistics?.length ? (
        <div className="relative p-4 trans-c">
          {isDecrypted && decrypted.length ? (
            <div className="flex flex-col gap-4 text-xs font-bold">
              {decrypted.map((data) => (
                <StatisticsItemDecrypted {...data} key={uuid()} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col">
              <div className="flex flex-wrap gap-x-4 gap-y-2">
                {statistics.map((item) => (
                  <AppDate {...item} key={item.timestamp} />
                ))}
              </div>
            </div>
          )}

          {/* Loading overlay */}
          {loading ? (
            <div className="absolute inset-0 flex-center bg-area/80">
              <LoadingIcon />
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
};

export default UserItem;
