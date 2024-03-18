import EditRestaurant from '@components/admin/EditRestaurant';
import PageLoader from '@components/layout/PageLoader';
import { useUser } from '@context/User';
import { checkUser } from '@lib/utils';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';

export default function EditRestaurantPage() {
  const router = useRouter();
  const { isUserLoading, isAdmin } = useUser();

  useEffect(() => {
    checkUser(isUserLoading, isAdmin, router);
  }, [isUserLoading, isAdmin]);

  return (
    <main>
      {isUserLoading && <PageLoader />}
      {isAdmin && <EditRestaurant />}
    </main>
  );
}
