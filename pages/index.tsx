import { useEffect } from "react";
import { useRouter } from "next/router";

export default function HomePage() {
  // Hooks
  const router = useRouter();

  useEffect(() => {
    router.push("/login");
  }, []);

  return (
    <main style={{ padding: "1.25rem" }}>
      <h2>Homepage</h2>
    </main>
  );
}
