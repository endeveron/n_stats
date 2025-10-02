'use client';

import { useState } from 'react';

import MainMenu from '@/core/components/ui/MainMenu';
import { useDashboard } from '@/core/features/statistics/hooks/useDashboard';
import AnimatedAppear from '@/core/components/ui/AnimatedAppear';
import Statistics from '@/core/features/statistics/components/Statistics';
import { Button } from '@/core/components/ui/Button';
import { cn } from '@/core/utils';

export type ItemMode = 'expanded' | 'collapsed';

const DashboardClient = ({
  email,
  name,
}: {
  email?: string | null;
  name?: string | null;
}) => {
  const { fetching, visitors, updateStatistics } = useDashboard({ email });
  const [itemMode, setItemMode] = useState<ItemMode | null>(null);

  const handleToggleMode = () => {
    const newMode: ItemMode =
      itemMode === 'expanded' ? 'collapsed' : 'expanded';
    setItemMode(newMode);
  };

  return (
    <AnimatedAppear className="fade flex flex-1 w-full max-w-[1724px] mx-auto px-4 pb-4 cursor-default">
      <div className="flex flex-col flex-1 w-full">
        <div className="flex items-center justify-between pl-3 py-4">
          <h1 className="text-2xl leading-0 font-bold">Visitors</h1>
          {visitors.length ? (
            <div className={cn('flex gap-2', fetching && 'cursor-wait')}>
              <Button
                onClick={updateStatistics}
                variant="secondary"
                size="sm"
                loading={fetching}
                className="button--sm w-20"
              >
                Update
              </Button>
              <Button
                onClick={handleToggleMode}
                variant="secondary"
                size="sm"
                loading={fetching}
                className="button--sm w-20"
              >
                {itemMode === 'expanded' ? 'Collapse' : 'Expand'}
              </Button>
            </div>
          ) : null}
          <MainMenu userData={{ name, email }} />
        </div>
        <Statistics
          fetching={fetching}
          visitors={visitors}
          itemMode={itemMode}
        />
      </div>
    </AnimatedAppear>
  );
};

export default DashboardClient;
