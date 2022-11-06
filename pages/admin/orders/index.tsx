import { useEffect } from "react";
import { useUser } from "@context/User";
import { checkUser } from "@utils/index";
import { useRouter } from "next/router";
import { useData } from "@context/Data";
import Orders from "@components/admin/Orders";
import PageLoader from "@components/layout/PageLoader";

export default function OrdersPage() {
  const router = useRouter();
  const { deliveredOrders } = useData();
  const { isUserLoading, isAdmin } = useUser();

  useEffect(() => {
    checkUser(isUserLoading, isAdmin, router);
  }, [isUserLoading, isAdmin]);

  return (
    <main>
      {isUserLoading && <PageLoader />}
      {isAdmin && <Orders orders={deliveredOrders} title="Delivered orders" />}
    </main>
  );
}
