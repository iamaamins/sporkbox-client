import { useUser } from '@context/User';
import { checkUser } from '@lib/utils';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import PlaceOrderItem from '@components/customer/ordering/PlaceOrderItem';
import PageLoader from '@components/layout/PageLoader';

export default function ItemPage() {
  const router = useRouter();
  const { isUserLoading, isCustomer } = useUser();

  useEffect(() => {
    checkUser(isUserLoading, isCustomer, router);
  }, [isUserLoading, isCustomer]);

  return (
    <main>
      {isUserLoading && <PageLoader />}
      {isCustomer && <PlaceOrderItem />}
    </main>
  );
}
