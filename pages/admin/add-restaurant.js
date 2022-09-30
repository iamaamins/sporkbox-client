import { useEffect } from "react";
import { useUser } from "@context/user";
import { useLoader } from "@context/loader";
import { checkAdmin } from "@utils/index";
import { useRouter } from "next/router";
import AddRestaurant from "@components/admin/AddRestaurant";

export default function AddRestaurantPage() {
  const router = useRouter();
  const { isAdmin } = useUser();
  const { isLoading } = useLoader();

  useEffect(() => {
    checkAdmin(isLoading, isAdmin, router);
  }, [isLoading, isAdmin]);

  return (
    <main>
      {isLoading && <h1>Loading...</h1>}
      {isAdmin && <AddRestaurant />}
    </main>
  );
}
