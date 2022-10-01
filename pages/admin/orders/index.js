import { useEffect } from "react";
import { useUser } from "@context/user";
import { checkUser } from "@utils/index";
import { useRouter } from "next/router";
import Orders from "@components/admin/Orders";

export default function OrdersPage() {
  const router = useRouter();
  const { isLoading, isAdmin } = useUser();

  useEffect(() => {
    checkUser(isLoading, isAdmin, router);
  }, [isLoading, isAdmin]);

  return (
    <main>
      {isLoading && <div>Loading...</div>}
      {isAdmin && <Orders />}
    </main>
  );
}
