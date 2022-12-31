import { useEffect } from "react";
import { useUser } from "@context/User";
import { checkUser } from "@utils/index";
import { useRouter } from "next/router";
import PageLoader from "@components/layout/PageLoader";
import ScheduleRestaurants from "@components/admin/ScheduleRestaurantsModal";

export default function ScheduleRestaurantsPage() {
  const router = useRouter();
  const { isUserLoading, isAdmin } = useUser();

  useEffect(() => {
    checkUser(isUserLoading, isAdmin, router);
  }, [isUserLoading, isAdmin]);

  return (
    <main>
      {isUserLoading && <PageLoader />}
      {isAdmin && <ScheduleRestaurants />}
    </main>
  );
}
