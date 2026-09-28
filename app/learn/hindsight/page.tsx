"use client";

import { LayoutGrid, List, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { HindsightTimelineFeed } from "@/components/hindsight/timeline-feed";
import { InsightDrawer } from "@/components/hindsight/insight-drawer";
import { hindsightMemories } from "@/lib/constants/hindsight-mock";
import type { HindsightMemory } from "@/lib/constants/hindsight-mock";

export default function HindsightPage() {
  const router = useRouter();
  const [view, setView] = useState<"grid" | "timeline">("timeline");
  const [selected, setSelected] = useState<HindsightMemory | null>(null);
  const confidence = hindsightMemories.length ? Math.round(hindsightMemories.reduce((total, memory) => total + memory.confidence, 0) / hindsightMemories.length) : 0;
  const activeLearnings = useMemo(() => hindsightMemories.reduce((total, memory) => total + memory.takeaways.length, 0), []);

  return (
    <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:py-10">
      <header className="flex flex-col gap-6 border-b border-border pb-8 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-intelligence"><Sparkles className="h-3.5 w-3.5" /> Hindsight Memory Layer</p>
          <h1 className="mt-4 font-display text-5xl tracking-tight sm:text-6xl">Hindsight Memory</h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted">BrandMind&apos;s continuous learning engine and historical memory bank.</p>
        </div>
        <div className="flex rounded-md border border-border bg-card p-1"><Button type="button" variant={view === "timeline" ? "default" : "ghost"} className="px-3" onClick={() => setView("timeline")} aria-label="Timeline view"><List className="h-4 w-4" /></Button><Button type="button" variant={view === "grid" ? "default" : "ghost"} className="px-3" onClick={() => setView("grid")} aria-label="Grid view"><LayoutGrid className="h-4 w-4" /></Button></div>
      </header>
      <section className="grid gap-px border-b border-border bg-border sm:grid-cols-3">
        <div className="bg-background py-6 pr-6"><p className="font-mono text-xs uppercase tracking-widest text-muted">Total memories saved</p><p className="mt-3 font-display text-5xl">{hindsightMemories.length}</p></div>
        <div className="bg-background py-6 pr-6 sm:pl-6"><p className="font-mono text-xs uppercase tracking-widest text-muted">Intelligence confidence avg</p><p className="mt-3 font-display text-5xl">{confidence}%</p></div>
        <div className="bg-background py-6 sm:pl-6"><p className="font-mono text-xs uppercase tracking-widest text-muted">Active learnings applied</p><p className="mt-3 font-display text-5xl">{activeLearnings}</p></div>
      </section>
      <main className="pt-8">{hindsightMemories.length ? <HindsightTimelineFeed memories={hindsightMemories} view={view} onSelect={setSelected} /> : <EmptyState title="No Hindsight learnings recorded..." description="Run campaign analysis after your first launch to turn results and audience reactions into durable memory." action="Run campaign analysis" />}</main>
      <InsightDrawer memory={selected} onClose={() => setSelected(null)} onApply={(memory) => { setSelected(null); router.push(`/execute/campaigns?memory=${memory.id}`); }} />
    </div>
  );
}
