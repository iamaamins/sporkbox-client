import { useEffect } from "react";
import { useLoader } from "@context/loader";
import { useUser } from "@context/user";
import { useRouter } from "next/router";
import LoginForm from "@components/admin/LoginForm";

export default function LoginPage() {
  const router = useRouter();
  const { admin } = useUser();

  useEffect(() => {
    if (admin) {
      router.push("/admin/dashboard");
    }
  }, [admin]);

  // If there is an admin then show the dashboard
  return <main>{!admin && <LoginForm />}</main>;
}
