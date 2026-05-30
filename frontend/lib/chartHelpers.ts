import { STATIC_TODAY } from "./constants";

export function getDateRangeFromPreset(preset: string) {
  const now = new Date(STATIC_TODAY);
  let start = new Date(now);
  switch (preset) {
    case "Today":        start = new Date(now); break;
    case "This Week":    start.setDate(now.getDate() - 6); break;
    case "This Month":   start = new Date(now.getFullYear(), now.getMonth(), 1); break;
    case "Last 30 Days": start.setDate(now.getDate() - 29); break;
    default:             start.setDate(now.getDate() - 6);
  }
  const end = new Date(now);
  return { start, end };
}

export function fmtShort(s: string, e: string) {
  const sf = new Date(s).toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const ef = new Date(e).toLocaleDateString("en-US", { month: "short", day: "numeric" });
  return `${sf} - ${ef}`;
}

export function rangeLabel(start: string, end: string, year: number) {
  return `${fmtShort(start, end)}, ${year}`;
}

export function getWeekLabel(date: Date): string {
  const sow = new Date(date);
  const day = sow.getDay();
  const diff = sow.getDate() - day + (day === 0 ? -6 : 1);
  sow.setDate(diff);
  const eow = new Date(sow);
  eow.setDate(eow.getDate() + 6);
  const o: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };
  return `${sow.toLocaleDateString("en-US", o)} - ${eow.toLocaleDateString("en-US", o)}`;
}

export function getAllKeysDaily(s: Date, e: Date): string[] {
  const keys: string[] = [];
  const cur = new Date(s);
  while (cur <= e) {
    keys.push(cur.toLocaleDateString("en-US", { month: "short", day: "numeric" }));
    cur.setDate(cur.getDate() + 1);
  }
  return keys;
}

export function getAllKeysWeekly(s: Date, e: Date): string[] {
  const keys: string[] = [];
  const cur = new Date(s);
  const cd = cur.getDay();
  cur.setDate(cur.getDate() - cd + (cd === 0 ? -6 : 1));
  while (cur <= e) {
    keys.push(getWeekLabel(cur));
    cur.setDate(cur.getDate() + 7);
  }
  return keys;
}

export function getAllKeys(s: Date, e: Date, useWeekly: boolean): string[] {
  return useWeekly ? getAllKeysWeekly(s, e) : getAllKeysDaily(s, e);
}

export function aggregateItems(
  items: any[],
  valueExt: (item: any) => number,
  useWeekly: boolean
): Map<string, number> {
  const map = new Map<string, number>();
  items.forEach((item) => {
    const d = new Date(item.createdAt);
    const k = useWeekly ? getWeekLabel(d) : d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    map.set(k, (map.get(k) || 0) + valueExt(item));
  });
  return map;
}

export function buildOverviewChartData(
  snapshots: any,
  orders: any,
  start: string,
  end: string,
  key: "revenue" | "orders"
) {
  const s = new Date(start);
  const e = new Date(end);
  const inclusiveDays = (e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24) + 1;
  const useWeekly = inclusiveDays >= 30;

  if (Array.isArray(snapshots) && snapshots.length > 0) {
    const filtered = snapshots.filter((snap: any) => {
      const d = new Date(snap.createdAt);
      return d >= s && d <= e;
    });
    if (filtered.length > 0) {
      const map = aggregateItems(filtered, (snap: any) =>
        key === "revenue" ? (snap.data?.stats?.totalRevenue || 0) : (snap.data?.stats?.totalOrders || 0),
        useWeekly
      );
      const allKeys = getAllKeys(s, e, useWeekly);
      return allKeys.map((k) => ({ name: k, value: map.get(k) || 0 }));
    }
  }

  if (Array.isArray(orders) && orders.length > 0) {
    const filtered = orders.filter((order: any) => {
      const d = new Date(order.createdAt);
      return d >= s && d <= e;
    });
    if (filtered.length > 0) {
      const map = aggregateItems(filtered, (order: any) =>
        key === "revenue" ? order.total : 1,
        useWeekly
      );
      const allKeys = getAllKeys(s, e, useWeekly);
      return allKeys.map((k) => ({ name: k, value: map.get(k) || 0 }));
    }
  }

  const allKeys = getAllKeys(s, e, useWeekly);
  return allKeys.map((k) => {
    const seed = k.length + k.charCodeAt(0);
    const base = key === "revenue" ? 1000 : 30;
    const variance = key === "revenue" ? 500 : 15;
    const value = Math.round((base + Math.sin(seed) * variance) * 100) / 100;
    return { name: k, value: Math.abs(value) };
  });
}

export function buildChartData(
  snapshots: any[],
  allOrders: any,
  start: string,
  end: string,
  key: "revenue" | "orders"
) {
  const s = new Date(start);
  const e = new Date(end);

  if (Array.isArray(snapshots) && snapshots.length > 0) {
    const filtered = snapshots.filter((snap) => {
      const d = new Date(snap.createdAt);
      return d >= s && d <= e;
    });
    if (filtered.length > 0) {
      const dedup = new Map<number, any>();
      filtered.forEach((snap) => {
        const d = new Date(snap.createdAt);
        dedup.set(d.getDate(), snap);
      });
      const days = Array.from(dedup.keys()).sort((a, b) => a - b);
      return days.map((day) => {
        const snap = dedup.get(day)!;
        const value =
          key === "revenue"
            ? snap.data?.stats?.totalRevenue || 0
            : snap.data?.stats?.totalOrders || 0;
        return {
          name: new Date(snap.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          }),
          day,
          value,
        };
      });
    }
  }

  if (Array.isArray(allOrders) && allOrders.length > 0) {
    const filtered = allOrders.filter((order: any) => {
      const d = new Date(order.createdAt);
      return d >= s && d <= e;
    });
    const map = new Map<number, { value: number; date: Date }>();
    filtered.forEach((order: any) => {
      const d = new Date(order.createdAt);
      const day = d.getDate();
      const val = key === "revenue" ? order.total : 1;
      if (!map.has(day)) {
        map.set(day, { value: val, date: d });
      } else {
        map.get(day)!.value += val;
      }
    });
    const allDays: number[] = [];
    const cur = new Date(s);
    while (cur <= e) {
      allDays.push(cur.getDate());
      cur.setDate(cur.getDate() + 1);
    }
    return allDays.map((day) => {
      const entry = map.get(day);
      const date = entry?.date || new Date(s.getFullYear(), s.getMonth(), day);
      return {
        name: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        day,
        value: entry ? entry.value : 0,
      };
    });
  }

  return [];
}

export function sumMetric(
  snapshots: any,
  orders: any,
  start: string,
  end: string,
  key: "revenue" | "orders"
): number {
  const s = new Date(start);
  const e = new Date(end);

  if (Array.isArray(snapshots) && snapshots.length > 0) {
    let total = 0;
    snapshots.forEach((snap: any) => {
      const d = new Date(snap.createdAt);
      if (d >= s && d <= e) {
        total += key === "revenue" ? (snap.data?.stats?.totalRevenue || 0) : (snap.data?.stats?.totalOrders || 0);
      }
    });
    if (total > 0) return total;
  }

  if (Array.isArray(orders) && orders.length > 0) {
    let total = 0;
    orders.forEach((order: any) => {
      const d = new Date(order.createdAt);
      if (d >= s && d <= e) {
        total += key === "revenue" ? order.total : 1;
      }
    });
    return total;
  }

  return 0;
}