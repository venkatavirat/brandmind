"use client";

import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { MemoryCard } from "@/components/hindsight/memory-card";
import type { HindsightMemory } from "@/lib/constants/hindsight-mock";

const filters = ["All", "Audience", "Creative", "Campaigns", "Strategy"] as const;
type Filter = (typeof filters)[number];

export function HindsightTimelineFeed({ memories, view = "timeline", onSelect }: { memories: HindsightMemory[]; view?: "grid" | "timeline"; onSelect: (memory: HindsightMemory) => void }) {
  const [filter, setFilter] = useState<Filter>("All");
  const [query, setQuery] = useState("");
  const visible = useMemo(() => memories.filter((memory) => (filter === "All" || memory.category === filter) && `${memory.title} ${memory.executiveSummary} ${memory.takeaways.join(" ")}`.toLowerCase().includes(query.toLowerCase())), [filter, memories, query]);
  return (
    <section>
      <div className="flex flex-col gap-4 border-b border-border pb-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-1.5">{filters.map((item) => <button key={item} type="button" onClick={() => setFilter(item)} className={`min-h-11 rounded-md px-3 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${filter === item ? "bg-intelligence/10 font-medium text-intelligence" : "text-muted hover:bg-muted/10 hover:text-foreground"}`}>{item}</button>)}</div>
        <label className="relative block w-full lg:w-72"><span className="sr-only">Search Hindsight memories</span><Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-muted" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search memories..." className="h-10 w-full rounded-md border border-border bg-card pl-9 pr-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-intelligence" /></label>
      </div>
      <div className={view === "grid" ? "mt-6 grid gap-4 md:grid-cols-2" : "relative mt-6 space-y-5 pl-6 before:absolute before:bottom-4 before:left-2 before:top-4 before:w-px before:bg-border"}>
        {visible.map((memory) => <div key={memory.id} className={view === "timeline" ? "relative before:absolute before:-left-[1.55rem] before:top-8 before:h-2 before:w-2 before:rounded-full before:bg-intelligence" : ""}><MemoryCard memory={memory} onSelect={onSelect} /></div>)}
        {!visible.length && <p className="py-12 text-center text-sm text-muted">No memories match this view.</p>}
      </div>
    </section>
  );
}
