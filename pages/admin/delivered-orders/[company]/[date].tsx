import { useEffect } from 'react';
import { useData } from '@context/Data';
import { useUser } from '@context/User';
import { checkUser } from '@lib/utils';
import { useRouter } from 'next/router';
import PageLoader from '@components/layout/PageLoader';
import OrderGroupDetails from '@components/admin/home/OrderGroupDetails';

export default function DeliveredOrderGroupDetailsPage() {
  const router = useRouter();
  const { isUserLoading, isAdmin } = useUser();
  const { deliveredOrderGroups, allDeliveredOrders } = useData();

  useEffect(() => {
    checkUser(isUserLoading, isAdmin, router);
  }, [isUserLoading, isAdmin]);

  return (
    <main>
      {isUserLoading && <PageLoader />}
      {isAdmin && (
        <OrderGroupDetails
          orderGroups={deliveredOrderGroups}
          isLoading={allDeliveredOrders.isLoading}
        />
      )}
    </main>
  );
}
