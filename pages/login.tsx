import { useEffect } from 'react';
import { useUser } from '@context/User';
import { useRouter } from 'next/router';
import LoginForm from '@components/customer/auth/LoginForm';
import PageLoader from '@components/layout/PageLoader';

export default function LoginPage() {
  const router = useRouter();
  const { isUserLoading, isAdmin, isVendor, isCustomer, isDriver } = useUser();

  useEffect(() => {
    if (isAdmin) router.push('/admin');
    if (isVendor) router.push('/restaurant');
    if (isCustomer) router.push('/profile');
    if (isDriver) router.push('/driver');
  }, [isAdmin, isVendor, isCustomer, isDriver]);

  return (
    <main>
      {isUserLoading && <PageLoader />}
      {!isUserLoading && <LoginForm />}
    </main>
  );
}
