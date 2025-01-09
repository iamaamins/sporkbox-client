import EditUser from '@components/admin/company/EditUser';
import PageLoader from '@components/layout/PageLoader';
import { useUser } from '@context/User';
import { checkUser } from '@lib/utils';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function EditUserPage() {
  const router = useRouter();
  const { isUserLoading, isAdmin } = useUser();

  useEffect(() => {
    checkUser(isUserLoading, isAdmin, router);
  }, [isUserLoading, isAdmin]);

  return (
    <main>
      {isUserLoading && <PageLoader />}
      {isAdmin && <EditUser />}
    </main>
  );
}
