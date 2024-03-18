import { useUser } from '@context/User';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Item from '@components/admin/Item';
import { checkUser } from '@lib/utils';
import PageLoader from '@components/layout/PageLoader';

export default function ItemPage() {
  const router = useRouter();
  const { isUserLoading, isAdmin } = useUser();

  useEffect(() => {
    checkUser(isUserLoading, isAdmin, router);
  }, [isUserLoading, isAdmin]);

  return (
    <main>
      {isUserLoading && <PageLoader />}
      {isAdmin && <Item />}
    </main>
  );
}
