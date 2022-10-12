import { useEffect } from "react";
import { useUser } from "@context/User";
import { checkUser } from "@utils/index";
import { useRouter } from "next/router";
import PageLoader from "@components/layout/PageLoader";
import AddRestaurant from "@components/admin/AddRestaurant";

export default function AddRestaurantPage() {
  const router = useRouter();
  const { isLoading, isAdmin } = useUser();

  useEffect(() => {
    checkUser(isLoading, isAdmin, router);
  }, [isLoading, isAdmin]);

  return (
    <main>
      {isLoading && <PageLoader />}
      {isAdmin && <AddRestaurant />}
    </main>
  );
}
