import { useEffect } from 'react';
import { useUser } from '@context/User';
import { checkUser } from '@lib/utils';
import { useRouter } from 'next/router';
import Restaurant from '@components/admin/restaurant/Restaurant';
import PageLoader from '@components/layout/PageLoader';

export default function RestaurantPage() {
  const router = useRouter();
  const { isUserLoading, isAdmin } = useUser();

  useEffect(() => {
    checkUser(isUserLoading, isAdmin, router);
  }, [isUserLoading, isAdmin]);

  return (
    <main>
      {isUserLoading && <PageLoader />}
      {isAdmin && <Restaurant />}
    </main>
  );
}
