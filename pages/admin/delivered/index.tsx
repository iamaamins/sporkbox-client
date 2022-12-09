import { useEffect } from "react";
import { useUser } from "@context/User";
import { checkUser } from "@utils/index";
import { useRouter } from "next/router";
import { useData } from "@context/Data";
import Orders from "@components/admin/OrdersGroups";
import PageLoader from "@components/layout/PageLoader";

export default function OrdersPage() {
  const router = useRouter();
  const { deliveredOrdersGroups } = useData();
  const { isUserLoading, isAdmin } = useUser();

  useEffect(() => {
    checkUser(isUserLoading, isAdmin, router);
  }, [isUserLoading, isAdmin]);

  return (
    <main>
      {isUserLoading && <PageLoader />}
      {isAdmin && (
        <Orders ordersGroups={deliveredOrdersGroups} title="Delivered orders" />
      )}
    </main>
  );
}
