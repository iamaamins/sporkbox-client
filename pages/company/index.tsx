import Dashboard from '@components/customer/company/Dashboard';
import PageLoader from '@components/layout/PageLoader';
import { useUser } from '@context/User';
import { checkUser } from '@lib/utils';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function CompanyPage() {
  const router = useRouter();
  const { isUserLoading, isCustomer, customer } = useUser();

  useEffect(() => {
    checkUser(isUserLoading, isCustomer, router);
  }, [isUserLoading, isCustomer, customer]);

  return (
    <main>
      {isUserLoading && <PageLoader />}
      {isCustomer && customer?.isCompanyAdmin && <Dashboard />}
    </main>
  );
}
