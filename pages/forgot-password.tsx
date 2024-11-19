import ForgotPassword from '@components/customer/auth/ForgotPassword';
import PageLoader from '@components/layout/PageLoader';
import { useUser } from '@context/User';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function ResetPasswordPage() {
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
      {!isUserLoading && <ForgotPassword />}
    </main>
  );
}
