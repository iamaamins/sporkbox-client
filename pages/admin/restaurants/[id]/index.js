import { useEffect } from "react";
import { useUser } from "@context/user";
import { useLoader } from "@context/loader";
import { checkUser } from "@utils/index";
import { useRouter } from "next/router";
import Restaurant from "@components/admin/Restaurant";

export default function RestaurantPage() {
  const router = useRouter();
  const { isAdmin } = useUser();
  const { isLoading } = useLoader();

  useEffect(() => {
    checkUser(isLoading, isAdmin, router);
  }, [isLoading, isAdmin]);

  return (
    <main>
      {!isAdmin && <h1>Loading...</h1>}
      {isAdmin && <Restaurant />}
    </main>
  );
}
