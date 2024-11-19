import { useEffect } from 'react';
import { useUser } from '@context/User';
import { checkUser } from '@lib/utils';
import { useRouter } from 'next/router';
import { useData } from '@context/Data';
import OrderGroups from '@components/admin/home/OrderGroups';
import PageLoader from '@components/layout/PageLoader';

export default function DeliveredOrderGroupsPage() {
  const router = useRouter();
  const { deliveredOrderGroups } = useData();
  const { isUserLoading, isAdmin } = useUser();

  useEffect(() => {
    checkUser(isUserLoading, isAdmin, router);
  }, [isUserLoading, isAdmin]);

  return (
    <main>
      {isUserLoading && <PageLoader />}
      {isAdmin && (
        <OrderGroups
          slug='delivered-orders'
          title='Delivered orders'
          orderGroups={deliveredOrderGroups}
        />
      )}
    </main>
  );
}
