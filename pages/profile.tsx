import { useEffect } from "react";
import { useUser } from "@context/User";
import { checkUser } from "@utils/index";
import { useRouter } from "next/router";

export default function ProfilePage() {
  const router = useRouter();
  const { isUserLoading, isCustomer } = useUser();

  useEffect(() => {
    checkUser(isUserLoading, isCustomer, router);
  }, [isUserLoading, isCustomer]);

  return <main>ProfilePage</main>;
}
