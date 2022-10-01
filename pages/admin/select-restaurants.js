import { useEffect } from "react";
import { useUser } from "@context/user";
import { useLoader } from "@context/loader";
import { checkUser } from "@utils/index";
import { useRouter } from "next/router";
import SelectRestaurants from "@components/admin/SelectRestaurants";

export default function SelectRestaurantsPage() {
  const router = useRouter();
  const { isAdmin } = useUser();
  const { isLoading } = useLoader();

  useEffect(() => {
    checkUser(isLoading, isAdmin, router);
  }, [isLoading, isAdmin]);

  return (
    <main>
      {!isAdmin && <h1>Loading...</h1>}
      {isAdmin && <SelectRestaurants />}
    </main>
  );
}
