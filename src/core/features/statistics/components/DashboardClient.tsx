'use client';

import MainMenu from '@/core/components/ui/MainMenu';
import { useDashboard } from '@/core/features/statistics/hooks/useDashboard';
import AnimatedAppear from '@/core/components/ui/AnimatedAppear';
import Statistics from '@/core/features/statistics/components/Statistics';

const DashboardClient = ({
  email,
  name,
}: {
  email?: string | null;
  name?: string | null;
}) => {
  const { fetchedUsers } = useDashboard({ email });

  return (
    <AnimatedAppear className="flex flex-1 w-full max-w-[1220px] mx-auto px-6 pb-6 cursor-default">
      <div className="flex flex-col flex-1 w-full">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Statistics</h1>
          <MainMenu userData={{ name, email }} />
        </div>
        <Statistics users={fetchedUsers} />
      </div>
    </AnimatedAppear>
  );
};

export default DashboardClient;
