'use client';

import MainMenu from '@/core/components/ui/MainMenu';
import { useDashboard } from '@/core/features/statistics/hooks/useDashboard';
import AnimatedAppear from '@/core/components/ui/AnimatedAppear';
import Statistics from '@/core/features/statistics/components/Statistics';
import { Button } from '@/core/components/ui/Button';

const DashboardClient = ({
  email,
  name,
}: {
  email?: string | null;
  name?: string | null;
}) => {
  const { visitors, updateStatistics } = useDashboard({ email });

  return (
    <AnimatedAppear className="flex flex-1 w-full max-w-[1220px] mx-auto px-6 pb-6 cursor-default">
      <div className="flex flex-col flex-1 w-full">
        <div className="flex items-center justify-between py-4">
          <h1 className="text-2xl leading-0 font-bold">Visitors</h1>
          {visitors.length ? (
            <Button
              onClick={updateStatistics}
              variant="secondary"
              size="sm"
              className="button--sm"
            >
              Update
            </Button>
          ) : null}
          <MainMenu userData={{ name, email }} />
        </div>
        <Statistics visitors={visitors} />
      </div>
    </AnimatedAppear>
  );
};

export default DashboardClient;
