import type { HTMLAttributes } from "react";

type BadgeVariant = "default" | "secondary" | "intelligence" | "success" | "warning" | "destructive";
type BadgeProps = HTMLAttributes<HTMLSpanElement> & { variant?: BadgeVariant };

const variants: Record<BadgeVariant, string> = {
  default: "border-border bg-card text-foreground",
  secondary: "border-border bg-muted/10 text-muted",
  intelligence: "border-intelligence-border bg-intelligence-muted text-intelligence",
  success: "border-success/30 bg-success/10 text-success",
  warning: "border-warning/30 bg-warning/10 text-warning",
  destructive: "border-destructive/30 bg-destructive/10 text-destructive",
};

export function Badge({ className = "", variant = "default", ...props }: BadgeProps) {
  return <span className={`inline-flex items-center rounded-md border px-2.5 py-1 font-mono text-xs ${variants[variant]} ${className}`} {...props} />;
}
