import { useEffect } from "react";
import { useUser } from "@context/user";
import { useLoader } from "@context/loader";
import { checkAdmin } from "@utils/index";
import { useRouter } from "next/router";
import AddItem from "@components/admin/AddItem";

export default function AddItemPage() {
  const router = useRouter();
  const { admin } = useUser();
  const { loading } = useLoader();

  useEffect(() => {
    checkAdmin(loading, admin, router);
  }, [loading, admin]);

  return (
    <main>
      {loading && <div>Loading...</div>}
      {!loading && admin && <AddItem />}
    </main>
  );
}
