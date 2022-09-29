import { useEffect } from "react";
import { useUser } from "@context/user";
import { useLoader } from "@context/loader";
import { checkAdmin } from "@utils/index";
import { useRouter } from "next/router";
import AddRestaurant from "@components/admin/AddRestaurant";

export default function AddRestaurantPage() {
  const router = useRouter();
  const { admin } = useUser();
  const { loading } = useLoader();

  useEffect(() => {
    checkAdmin(loading, admin, router);
  }, [loading, admin]);

  return (
    <main>
      {loading && <h1>Loading...</h1>}
      {!loading && admin && <AddRestaurant />}
    </main>
  );
}
