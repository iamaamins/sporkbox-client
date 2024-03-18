import { useEffect } from 'react';
import { useUser } from '@context/User';
import { checkUser } from '@lib/utils';
import { useRouter } from 'next/router';
import EditItem from '@components/admin/EditItem';
import PageLoader from '@components/layout/PageLoader';

export default function EditItemPage() {
  const router = useRouter();
  const { isUserLoading, isAdmin } = useUser();

  useEffect(() => {
    checkUser(isUserLoading, isAdmin, router);
  }, [isUserLoading, isAdmin]);

  return (
    <main>
      {isUserLoading && <PageLoader />}
      {isAdmin && <EditItem />}
    </main>
  );
}
