import PlaceOrder from '@components/customer/company/PlaceOrder';
import PageLoader from '@components/layout/PageLoader';
import { useUser } from '@context/User';
import { checkCompanyAdmin } from '@lib/utils';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function PlaceOderPage() {
  const router = useRouter();
  const { isUserLoading, isCustomer, customer } = useUser();

  useEffect(() => {
    checkCompanyAdmin(isUserLoading, customer, router);
  }, [isUserLoading, customer]);

  return (
    <main>
      {isUserLoading && <PageLoader />}
      {isCustomer && <PlaceOrder />}
    </main>
  );
}
