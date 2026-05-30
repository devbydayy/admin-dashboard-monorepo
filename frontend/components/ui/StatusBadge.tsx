import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
  className?: string;
}

const statusConfig: Record<string, string> = {
  pending: "bg-warning text-dark",
  paid: "bg-info text-dark",
  shipped: "bg-purple text-white", 
  delivered: "bg-success text-white",
  completed: "bg-success text-white",
  cancelled: "bg-danger text-white",
  active: "bg-success text-white",
  inactive: "bg-secondary text-white",
  "out-of-stock": "bg-warning text-dark",
  verified: "bg-success text-white",
  suspended: "bg-danger text-white",
  published: "bg-success text-white",
  draft: "bg-light text-dark",
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const bgClass = statusConfig[status.toLowerCase()] || "bg-light text-dark";
  return (
    <span className={cn("badge rounded-pill", bgClass, className)}>
      {status}
    </span>
  );
}