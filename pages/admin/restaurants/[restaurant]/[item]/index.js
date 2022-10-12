import { useUser } from "@context/User";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Item from "@components/admin/Item";
import { checkUser } from "@utils/index";
import PageLoader from "@components/layout/PageLoader";

export default function ItemPage() {
  const router = useRouter();
  const { isLoading, isAdmin } = useUser();

  useEffect(() => {
    checkUser(isLoading, isAdmin, router);
  }, [isLoading, isAdmin]);

  return (
    <main>
      {isLoading && <PageLoader />}
      {isAdmin && <Item />}
    </main>
  );
}
