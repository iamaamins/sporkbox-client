import { useEffect } from "react";
import { useData } from "@context/Data";
import { useUser } from "@context/User";
import { checkUser } from "@utils/index";
import { useRouter } from "next/router";
import OrdersGroup from "@components/admin/OrdersGroup";
import PageLoader from "@components/layout/PageLoader";

export default function OrdersGroupPage() {
  const router = useRouter();
  const { activeOrdersGroups, allActiveOrders } = useData();
  const { isUserLoading, isAdmin } = useUser();

  useEffect(() => {
    checkUser(isUserLoading, isAdmin, router);
  }, [isUserLoading, isAdmin]);

  return (
    <main>
      {isUserLoading && <PageLoader />}
      {isAdmin && (
        <OrdersGroup
          ordersGroups={activeOrdersGroups}
          isLoading={allActiveOrders.isLoading}
        />
      )}
    </main>
  );
}
