import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "secondary" | "destructive" | "outline" | "success" | "warning" | "error" | "info";
}

const variantClasses: Record<string, string> = {
  default: "bg-primary text-white",
  secondary: "bg-secondary text-white",
  destructive: "bg-danger text-white",
  outline: "border",
  success: "bg-success text-white",
  warning: "bg-warning text-dark",
  error: "bg-danger text-white",
  info: "bg-info text-dark",
};

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "badge rounded-pill",
        variantClasses[variant] || variantClasses.default,
        className
      )}
      {...props}
    />
  );
}