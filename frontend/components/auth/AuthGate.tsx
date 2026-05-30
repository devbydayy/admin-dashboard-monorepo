"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useLogin } from "@/hooks/useAuth";
import DashboardLoading from "@/app/(dashboard)/loading";

function getCookie(name: string): string | undefined {
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : undefined;
}

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { mutate: login } = useLogin();

  useEffect(() => {
    if (pathname.startsWith("/auth")) {
      setReady(true);
      return;
    }

    const token = localStorage.getItem("auth_token");
    const manualRequired = getCookie("prevent_auto_login") === "1";

    if (token) {
      setReady(true);
      return;
    }

    if (manualRequired) {
      router.replace("/auth/login");
      return;
    }

    login(
      { email: "admin@example.com", password: "password123" },
      {
        onSuccess: () => setReady(true),
        onError: () => router.replace("/auth/login"),
      }
    );
  }, [pathname]);

  if (!ready) {
    return <DashboardLoading />;
  }

  return <>{children}</>;
}