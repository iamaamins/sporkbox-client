import { useEffect } from "react";
import { useUser } from "@context/user";
import { useLoader } from "@context/loader";
import { checkAdmin } from "@utils/index";
import { useRouter } from "next/router";
import Orders from "@components/admin/Orders";

export default function OrdersPage() {
  const router = useRouter();
  const { admin } = useUser();
  const { isLoading } = useLoader();

  useEffect(() => {
    checkAdmin(isLoading, admin, router);
  }, [admin]);

  return (
    <main>
      {!admin && <div>Loading...</div>}
      {admin && <Orders />}
    </main>
  );
}
