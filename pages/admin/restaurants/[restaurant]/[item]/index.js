import { useUser } from "@context/user";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Item from "@components/admin/Item";
import { checkUser } from "@utils/index";

export default function ItemPage() {
  const router = useRouter();
  const { isLoading, isAdmin } = useUser();

  useEffect(() => {
    checkUser(isLoading, isAdmin, router);
  }, [isLoading, isAdmin]);

  return (
    <main>
      {isLoading && <h1>Loading...</h1>}
      {isAdmin && <Item />}
    </main>
  );
}
