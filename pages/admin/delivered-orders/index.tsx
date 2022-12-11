import { useEffect } from "react";
import { useUser } from "@context/User";
import { checkUser } from "@utils/index";
import { useRouter } from "next/router";
import { useData } from "@context/Data";
import OrdersGroups from "@components/admin/OrdersGroups";
import PageLoader from "@components/layout/PageLoader";

export default function DeliveredOrdersGroupsPage() {
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
        <OrdersGroups
          slug="delivered-orders"
          title="Delivered orders"
          ordersGroups={deliveredOrdersGroups}
        />
      )}
    </main>
  );
}
