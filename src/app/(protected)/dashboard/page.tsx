import { redirect } from 'next/navigation';

import { SIGNIN_REDIRECT } from '@/core/constants';
import DashboardClient from '@/core/features/statistics/components/DashboardClient';
import { auth } from '~/auth';

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) return redirect(SIGNIN_REDIRECT);

  return (
    <main className="relative">
      <DashboardClient email={session.user.email} name={session.user.name} />
    </main>
  );
}
