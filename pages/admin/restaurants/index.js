import { useEffect } from "react";
import { useUser } from "@context/user";
import { useLoader } from "@context/loader";
import { checkAdmin } from "@utils/index";
import { useRouter } from "next/router";
import Restaurants from "@components/admin/Restaurants";

export default function RestaurantsPage() {
  const router = useRouter();
  const { isAdmin } = useUser();
  const { isLoading } = useLoader();

  useEffect(() => {
    checkAdmin(isLoading, isAdmin, router);
  }, [isLoading, isAdmin]);

  return (
    <main>
      {isLoading && <div>Loading...</div>}
      {isAdmin && <Restaurants />}
    </main>
  );
}
