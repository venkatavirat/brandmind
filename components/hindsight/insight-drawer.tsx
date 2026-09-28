"use client";

import { ArrowRight, Database, Link2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { IntelligenceBadge } from "@/components/hindsight/intelligence-badge";
import type { HindsightMemory } from "@/lib/constants/hindsight-mock";

export function InsightDrawer({ memory, onClose, onApply }: { memory: HindsightMemory | null; onClose: () => void; onApply: (memory: HindsightMemory) => void }) {
  if (!memory) return null;
  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-foreground/20" role="presentation" onMouseDown={onClose}>
      <aside className="h-full w-full max-w-xl overflow-y-auto border-l border-border bg-card p-6 text-foreground" role="dialog" aria-modal="true" aria-labelledby="insight-drawer-title" onMouseDown={(event) => event.stopPropagation()}>
        <div className="flex items-start justify-between gap-4"><div><p className="font-mono text-xs uppercase tracking-widest text-muted">{memory.id} / {memory.categoryLabel}</p><h2 id="insight-drawer-title" className="mt-3 font-display text-3xl tracking-tight">{memory.title}</h2></div><Button type="button" variant="ghost" className="px-2" onClick={onClose} aria-label="Close insight"><X className="h-4 w-4" /></Button></div>
        <div className="mt-6 flex items-center justify-between border-y border-border py-4"><span className="text-sm text-muted">Captured {memory.timestamp}</span><IntelligenceBadge score={memory.confidence} label="Confidence" variant="full" /></div>
        <section className="mt-7"><p className="font-mono text-[10px] uppercase tracking-widest text-muted">Executive summary</p><p className="mt-3 text-base leading-relaxed">{memory.executiveSummary}</p></section>
        <section className="mt-7"><p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-muted"><Database className="h-3.5 w-3.5" /> Supporting data</p><ul className="mt-3 space-y-2 text-sm">{memory.supportingData.map((item) => <li key={item} className="border-l-2 border-intelligence pl-3">{item}</li>)}</ul></section>
        <section className="mt-7"><p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-muted"><Link2 className="h-3.5 w-3.5" /> Connected brand guidelines</p><div className="mt-3 flex flex-wrap gap-2">{memory.connectedGuidelines.map((item) => <span key={item} className="rounded-md bg-intelligence/10 px-2.5 py-1 text-sm text-intelligence">{item}</span>)}</div></section>
        <section className="mt-7"><p className="font-mono text-[10px] uppercase tracking-widest text-muted">Raw source attribution</p><p className="mt-3 rounded-md border border-border bg-background p-3 font-mono text-xs text-muted">{memory.rawSource}</p></section>
        <Button type="button" variant="intelligence" className="mt-8 w-full" onClick={() => onApply(memory)}>Apply to New Campaign <ArrowRight className="h-4 w-4" /></Button>
      </aside>
    </div>
  );
}
