import { useEffect } from 'react';
import { useUser } from '@context/User';
import { useRouter } from 'next/router';
import LoginForm from '@components/customer/LoginForm';
import PageLoader from '@components/layout/PageLoader';

export default function LoginPage() {
  const router = useRouter();
  const { isUserLoading, isAdmin, isVendor, isCustomer } = useUser();

  useEffect(() => {
    if (isAdmin) router.push('/admin');
    if (isVendor) router.push('restaurant');
    if (isCustomer) router.push('/profile');
  }, [isAdmin, isVendor, isCustomer]);

  return (
    <main>
      {isUserLoading && <PageLoader />}
      {!isUserLoading && <LoginForm />}
    </main>
  );
}
