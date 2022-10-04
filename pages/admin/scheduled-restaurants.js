import { useEffect } from "react";
import { useUser } from "@context/user";
import { checkUser } from "@utils/index";
import { useRouter } from "next/router";
import PageLoader from "@components/layout/PageLoader";
import ScheduledRestaurants from "@components/admin/ScheduledRestaurants";

export default function ScheduledRestaurantsPage() {
  const router = useRouter();
  const { isLoading, isAdmin } = useUser();

  useEffect(() => {
    checkUser(isLoading, isAdmin, router);
  }, [isLoading, isAdmin]);

  return (
    <main>
      {isLoading && <PageLoader />}
      {isAdmin && <ScheduledRestaurants />}
    </main>
  );
}
