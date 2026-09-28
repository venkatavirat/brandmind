"use client";

import { Check, Circle } from "lucide-react";
import { useState } from "react";

const stages = ["Ideation", "Strategy", "Content", "Launch", "Analytics"];

export function StageNavigator({ activeStage = 0, completedStages = [], onStageChange }: { activeStage?: number; completedStages?: number[]; onStageChange?: (stage: number) => void }) {
  const [selected, setSelected] = useState(activeStage);
  const changeStage = (stage: number) => { setSelected(stage); onStageChange?.(stage); };
  return (
    <nav aria-label="Workflow stages" className="border-y border-border py-5">
      <ol className="grid grid-cols-5 gap-2">
        {stages.map((stage, index) => {
          const complete = completedStages.includes(index) || index < selected;
          const active = selected === index;
          return <li key={stage} className="min-w-0"><button type="button" aria-current={active ? "step" : undefined} aria-label={`${stage}, ${complete ? "completed" : active ? "current" : "upcoming"}`} onClick={() => changeStage(index)} onKeyDown={(event) => { if (event.key === "ArrowRight") { event.preventDefault(); changeStage(Math.min(stages.length - 1, index + 1)); } if (event.key === "ArrowLeft") { event.preventDefault(); changeStage(Math.max(0, index - 1)); } }} className={`group flex min-h-11 w-full flex-col items-center gap-2 rounded-md px-2 py-2 text-center text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${active ? "text-intelligence" : "text-muted hover:bg-muted/10 hover:text-foreground"}`}><span className={`flex h-8 w-8 items-center justify-center rounded-full border ${complete ? "border-success bg-success/10 text-success" : active ? "border-intelligence bg-intelligence/10 text-intelligence" : "border-border text-muted"}`}>{complete ? <Check className="h-4 w-4" /> : active ? <span className="h-2 w-2 rounded-full bg-intelligence" /> : <Circle className="h-3.5 w-3.5" />}</span><span className="truncate font-mono">{stage}</span></button></li>;
        })}
      </ol>
    </nav>
  );
}
