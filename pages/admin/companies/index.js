import { useEffect } from "react";
import { useUser } from "@context/user";
import { checkUser } from "@utils/index";
import { useRouter } from "next/router";
import Companies from "@components/admin/Companies";

export default function CompaniesPage() {
  const router = useRouter();
  const { isLoading, isAdmin } = useUser();

  useEffect(() => {
    checkUser(isLoading, isAdmin, router);
  }, [isLoading, isAdmin]);

  return (
    <main>
      {isLoading && <div>Loading...</div>}
      {isAdmin && <Companies />}
    </main>
  );
}
