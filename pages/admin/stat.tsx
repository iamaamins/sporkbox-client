import PageLoader from '@components/layout/PageLoader';
import { useUser } from '@context/User';
import { checkUser } from '@lib/utils';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Stat from '@components/admin/stat/Stat';

export default function StatPage() {
  const router = useRouter();
  const { isUserLoading, isAdmin } = useUser();

  useEffect(() => {
    checkUser(isUserLoading, isAdmin, router);
  }, [isUserLoading, isAdmin]);

  return (
    <main>
      {isUserLoading && <PageLoader />}
      {isAdmin && <Stat />}
    </main>
  );
}
