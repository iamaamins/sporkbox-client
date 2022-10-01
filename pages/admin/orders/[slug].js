import { useEffect } from "react";
import { useUser } from "@context/user";
import { useLoader } from "@context/loader";
import { checkUser } from "@utils/index";
import { useRouter } from "next/router";
import Order from "@components/admin/Order";

export default function OrderPage() {
  const router = useRouter();
  const { isAdmin } = useUser();
  const { isLoading } = useLoader();

  useEffect(() => {
    checkUser(isLoading, isAdmin, router);
  }, [isLoading, isAdmin]);

  return (
    <main>
      {!isAdmin && <div>Loading...</div>}
      {isAdmin && <Order />}
    </main>
  );
}
