import { useEffect } from 'react';
import { useUser } from '@context/User';
import { useRouter } from 'next/router';
import PageLoader from '@components/layout/PageLoader';
import ResetPassword from '@components/customer/ResetPassword';

export default function PassWordResetPage() {
  const router = useRouter();
  const { isUserLoading, isAdmin, isVendor, isCustomer } = useUser();

  useEffect(() => {
    if (isAdmin) router.push('/admin');
    if (isVendor) router.push('/restaurant');
    if (isCustomer) router.push('/dashboard');
  }, [isAdmin, isVendor, isCustomer]);

  return (
    <main>
      {isUserLoading && <PageLoader />}
      {!isUserLoading && <ResetPassword />}
    </main>
  );
}
