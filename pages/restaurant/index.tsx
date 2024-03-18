import PageLoader from '@components/layout/PageLoader';
import Dashboard from '@components/restaurant/Dashboard';
import { useUser } from '@context/User';
import { checkUser } from '@lib/utils';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function DashboardPage() {
  const router = useRouter();
  const { isUserLoading, isVendor } = useUser();

  useEffect(() => {
    checkUser(isUserLoading, isVendor, router);
  }, [isUserLoading, isVendor]);

  return (
    <main>
      {isUserLoading && <PageLoader />}
      {isVendor && <Dashboard />}
    </main>
  );
}
