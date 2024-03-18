import ForgotPassword from '@components/customer/ForgotPassword';
import PageLoader from '@components/layout/PageLoader';
import { useUser } from '@context/User';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function ResetPasswordPage() {
  const router = useRouter();
  const { isUserLoading, isAdmin, isCustomer } = useUser();

  // Push to a page depending on user role
  useEffect(() => {
    if (isAdmin) {
      router.push('/admin');
    } else if (isCustomer) {
      router.push('/dashboard');
    }
  }, [isAdmin, isCustomer]);

  return (
    <main>
      {isUserLoading && <PageLoader />}
      {!isUserLoading && <ForgotPassword />}
    </main>
  );
}
