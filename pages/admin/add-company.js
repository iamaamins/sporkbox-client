import { useUser } from "@context/user";
import { checkUser } from "@utils/index";
import { useRouter } from "next/router";
import { useEffect } from "react";
import AddCompany from "@components/admin/AddCompany";

export default function AddCompanyPage() {
  const router = useRouter();
  const { isLoading, isAdmin } = useUser();

  useEffect(() => {
    checkUser(isLoading, isAdmin, router);
  }, [isLoading, isAdmin]);

  return (
    <main>
      {isLoading && <h1>Loading...</h1>}
      {isAdmin && <AddCompany />}
    </main>
  );
}
