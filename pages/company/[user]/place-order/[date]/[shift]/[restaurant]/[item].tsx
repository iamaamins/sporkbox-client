import PlaceOrderItem from '@components/customer/company/PlaceOrderItem';
import PageLoader from '@components/layout/PageLoader';
import { useUser } from '@context/User';
import { checkCompanyAdmin } from '@lib/utils';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function ItemPage() {
  const router = useRouter();

  const { isUserLoading, customer, isCustomer } = useUser();

  useEffect(() => {
    checkCompanyAdmin(isUserLoading, customer, router);
  }, [isUserLoading, customer]);

  return (
    <main>
      {isUserLoading && <PageLoader />}
      {isCustomer && <PlaceOrderItem />}
    </main>
  );
}
