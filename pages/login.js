import { useEffect } from "react";
import { useUser } from "@context/user";
import { useRouter } from "next/router";
import LoginForm from "@components/login/LoginForm";

export default function LoginPage() {
  const router = useRouter();
  const { isAdmin, isCustomer } = useUser();

  // Push to a page depending on user role
  useEffect(() => {
    if (isAdmin) {
      router.push("/admin");
    } else if (isCustomer) {
      router.push("/");
    }
  }, [isAdmin, isCustomer]);

  return (
    <main>
      <LoginForm />
    </main>
  );
}
