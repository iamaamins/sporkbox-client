import { useEffect } from 'react';
import { useUser } from '@context/User';
import { checkUser } from '@lib/utils';
import { useRouter } from 'next/router';
import PageLoader from '@components/layout/PageLoader';
import AddDiscountCodeForm from '@components/admin/discount/AddDiscountCodeForm';

export default function AddDiscountCodePage() {
  // Hooks
  const router = useRouter();
  const { isUserLoading, isAdmin } = useUser();

  // Handle navigation
  useEffect(() => {
    checkUser(isUserLoading, isAdmin, router);
  }, [isUserLoading, isAdmin]);

  return (
    <main>
      {isUserLoading && <PageLoader />}
      {isAdmin && <AddDiscountCodeForm />}
    </main>
  );
}
