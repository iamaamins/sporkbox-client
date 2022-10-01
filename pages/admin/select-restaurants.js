import { useEffect } from "react";
import { useUser } from "@context/user";
import { checkUser } from "@utils/index";
import { useRouter } from "next/router";
import SelectRestaurants from "@components/admin/SelectRestaurants";

export default function SelectRestaurantsPage() {
  const router = useRouter();
  const { isLoading, isAdmin } = useUser();

  useEffect(() => {
    checkUser(isLoading, isAdmin, router);
  }, [isLoading, isAdmin]);

  return (
    <main>
      {isLoading && <h1>Loading...</h1>}
      {isAdmin && <SelectRestaurants />}
    </main>
  );
}
