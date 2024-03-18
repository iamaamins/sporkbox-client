import { useEffect } from 'react';
import { useUser } from '@context/User';
import { useRouter } from 'next/router';
import { checkUser } from '@lib/utils';
import Dashboard from '@components/admin/Dashboard';
import PageLoader from '@components/layout/PageLoader';

export default function DashboardPage() {
  const router = useRouter();
  const { isUserLoading, isAdmin } = useUser();

  useEffect(() => {
    checkUser(isUserLoading, isAdmin, router);
  }, [isUserLoading, isAdmin]);

  return (
    <main>
      {isUserLoading && <PageLoader />}
      {isAdmin && <Dashboard />}
    </main>
  );
}
