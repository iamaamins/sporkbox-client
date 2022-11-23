import { useEffect } from "react";
import { useRouter } from "next/router";
import { useUser } from "@context/User";
import { checkUser } from "@utils/index";
import Calendar from "@components/generic/Calendar";

export default function DatePage() {
  const router = useRouter();
  const { isUserLoading, isCustomer } = useUser();

  useEffect(() => {
    checkUser(isUserLoading, isCustomer, router);
  }, [isUserLoading, isCustomer]);

  return (
    <main>
      <Calendar />
    </main>
  );
}
