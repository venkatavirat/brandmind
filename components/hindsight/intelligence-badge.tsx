import { BrainCircuit, Sparkles } from "lucide-react";

export function IntelligenceBadge({ score, label = "Intelligence confidence", variant = "compact" }: { score: number | string; label?: string; variant?: "compact" | "full" }) {
  const value = typeof score === "number" ? `${score}%` : score;
  return (
    <span className={`inline-flex items-center gap-2 rounded-md border border-intelligence-border bg-intelligence/10 text-intelligence ${variant === "full" ? "px-3 py-2" : "px-2.5 py-1"}`} aria-label={`${label}: ${value}`}>
      {variant === "full" ? <BrainCircuit className="h-4 w-4" strokeWidth={1.7} /> : <Sparkles className="h-3.5 w-3.5" strokeWidth={1.7} />}
      <span className="font-mono text-xs">{variant === "full" && `${label} `}{value}</span>
    </span>
  );
}
