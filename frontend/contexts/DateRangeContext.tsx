"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { STATIC_TODAY } from "@/lib/constants";

interface DateRangeContextValue {
  startDate: string;
  endDate: string;
  datePreset: string;
  setStartDate: (date: string) => void;
  setEndDate: (date: string) => void;
  setDatePreset: (preset: string) => void;
}

const DateRangeContext = createContext<DateRangeContextValue | undefined>(undefined);

export function DateRangeProvider({ children }: { children: ReactNode }) {
  const [startDate, setStartDate] = useState(() => {
    const d = new Date(STATIC_TODAY);
    d.setDate(d.getDate() - 6);
    return d.toISOString().split("T")[0];
  });
  const [endDate, setEndDate] = useState(() => STATIC_TODAY.toISOString().split("T")[0]);
  const [datePreset, setDatePreset] = useState("This Week");

  return (
    <DateRangeContext.Provider
      value={{ startDate, endDate, datePreset, setStartDate, setEndDate, setDatePreset }}
    >
      {children}
    </DateRangeContext.Provider>
  );
}

export function useDateRange() {
  const ctx = useContext(DateRangeContext);
  if (!ctx) throw new Error("useDateRange must be used within DateRangeProvider");
  return ctx;
}