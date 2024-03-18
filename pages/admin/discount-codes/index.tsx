import { useEffect } from 'react';
import { useUser } from '@context/User';
import { checkUser } from '@lib/utils';
import { useRouter } from 'next/router';
import DiscountCodes from '@components/admin/DiscountCodes';
import PageLoader from '@components/layout/PageLoader';

export default function DiscountCodesPage() {
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
      {isAdmin && <DiscountCodes />}
    </main>
  );
}
