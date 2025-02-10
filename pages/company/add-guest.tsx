import AddGuest from '@components/customer/company/AddGuest';
import PageLoader from '@components/layout/PageLoader';
import { useUser } from '@context/User';
import { checkCompanyAdmin } from '@lib/utils';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function AddGuestPage() {
  const router = useRouter();
  const { isUserLoading, customer, isCustomer } = useUser();

  useEffect(() => {
    checkCompanyAdmin(isUserLoading, customer, router);
  }, [isUserLoading, customer]);

  return (
    <main>
      {isUserLoading && <PageLoader />}
      {isCustomer && <AddGuest />}
    </main>
  );
}
