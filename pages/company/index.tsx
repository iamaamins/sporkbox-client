import Dashboard from '@components/customer/company/Dashboard';
import PageLoader from '@components/layout/PageLoader';
import { useUser } from '@context/User';
import { checkCompanyAdmin } from '@lib/utils';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function CompanyPage() {
  const router = useRouter();
  const { isUserLoading, isCustomer, customer } = useUser();

  useEffect(() => {
    checkCompanyAdmin(isUserLoading, customer, router);
  }, [isUserLoading, customer]);

  return (
    <main>
      {isUserLoading && <PageLoader />}
      {isCustomer && <Dashboard />}
    </main>
  );
}
