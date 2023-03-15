import { useUser } from "@context/User";
import { checkUser } from "@utils/index";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import Item from "@components/generic/Item";
import PageLoader from "@components/layout/PageLoader";

export default function ItemPage() {
  const router = useRouter();
  const { isUserLoading, isCustomer } = useUser();

  useEffect(() => {
    checkUser(isUserLoading, isCustomer, router);
  }, [isUserLoading, isCustomer]);

  return (
    <main>
      {isUserLoading && <PageLoader />}
      {isCustomer && <Item />}
    </main>
  );
}
