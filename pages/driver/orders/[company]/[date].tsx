import OrderGroupDetails from '@components/driver/OrderGroupDetails';
import PageLoader from '@components/layout/PageLoader';
import { useUser } from '@context/User';
import { checkUser } from '@lib/utils';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function OrderDetailsPage() {
  const router = useRouter();
  const { isUserLoading, isDriver } = useUser();

  useEffect(() => {
    checkUser(isUserLoading, isDriver, router);
  }, [isUserLoading, isDriver]);

  return (
    <main>
      {isUserLoading && <PageLoader />}
      {isDriver && <OrderGroupDetails />}
    </main>
  );
}
