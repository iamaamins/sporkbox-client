import { useEffect } from "react";
import { useUser } from "@context/user";
import { useRouter } from "next/router";
import LoginForm from "@components/admin/LoginForm";

export default function LoginPage() {
  const router = useRouter();
  const { isAdmin } = useUser();

  // If not loading and admin
  // then push to the dashboard
  useEffect(() => {
    if (isAdmin) {
      router.push("/admin/dashboard");
    }
  }, [isAdmin]);

  return (
    <main>
      <LoginForm />
    </main>
  );
}
