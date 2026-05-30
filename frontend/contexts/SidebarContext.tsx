"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface SidebarCtx {
  isCollapsed: boolean;
  toggle: () => void;
}

const SidebarContext = createContext<SidebarCtx>({
  isCollapsed: false,
  toggle: () => {},
});

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  return (
    <SidebarContext.Provider
      value={{ isCollapsed, toggle: () => setIsCollapsed((v) => !v) }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

export const useSidebar = () => useContext(SidebarContext);