"use client";

import { ThemeProvider, useTheme } from "next-themes";
import { useEffect } from "react";
import QueryProvider from "@/providers/QueryProvider";
import SocketProvider from "@/providers/SocketProvider";

function ThemeSync() {
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    if (resolvedTheme) {
      document.documentElement.setAttribute("data-bs-theme", resolvedTheme);
    }
  }, [resolvedTheme]);

  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <SocketProvider>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <ThemeSync />
          {children}
        </ThemeProvider>
      </SocketProvider>
    </QueryProvider>
  );
}