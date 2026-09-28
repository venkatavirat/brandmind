"use client";

import { ArrowUpRight, TrendingUp } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IntelligenceBadge } from "@/components/hindsight/intelligence-badge";
import { MemoryCard } from "@/components/hindsight/memory-card";
import { InsightDrawer } from "@/components/hindsight/insight-drawer";
import { hindsightMemories } from "@/lib/constants/hindsight-mock";
import type { HindsightMemory } from "@/lib/constants/hindsight-mock";

const interpretationMemory = hindsightMemories[0];

export function MetricInterpretation() {
  const [selected, setSelected] = useState<HindsightMemory | null>(null);
  return <section className="space-y-5"><div className="flex items-end justify-between gap-4"><div><p className="font-mono text-xs uppercase tracking-widest text-muted">Hindsight interpretation</p><h2 className="mt-2 font-display text-3xl">What changed, and why?</h2></div><IntelligenceBadge score={89} label="Narrative confidence" variant="full" /></div><div className="grid gap-4 lg:grid-cols-3"><Card><CardHeader><CardTitle>CTR</CardTitle><Badge variant="success"><TrendingUp className="mr-1 h-3.5 w-3.5" />+2.4%</Badge></CardHeader><CardContent><p className="text-sm leading-relaxed text-muted">CTR increased by +2.4% due to an empathetic headline tone that reduced perceived effort for new audiences.</p></CardContent></Card><Card><CardHeader><CardTitle>Qualified sessions</CardTitle><Badge variant="success">+11%</Badge></CardHeader><CardContent><p className="text-sm leading-relaxed text-muted">Qualified sessions followed the lift in demonstration-first creative, suggesting the attention was more intentional than reach alone.</p></CardContent></Card><Card><CardHeader><CardTitle>CAC</CardTitle><Badge variant="warning">Watch</Badge></CardHeader><CardContent><p className="text-sm leading-relaxed text-muted">Acquisition cost remains sensitive to repeat exposure. Rotate assets before retargeting expands.</p></CardContent></Card></div><div className="grid gap-4 lg:grid-cols-2"><MemoryCard memory={interpretationMemory} onSelect={setSelected} /><Card><CardHeader><CardTitle>Connected Hindsight memory</CardTitle></CardHeader><CardContent><p className="text-sm leading-relaxed text-muted">This interpretation is linked to the demonstration-first creative memory and its supporting experiment evidence.</p><button type="button" onClick={() => setSelected(interpretationMemory)} className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-intelligence focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-intelligence">Open supporting memory <ArrowUpRight className="h-4 w-4" /></button></CardContent></Card></div><InsightDrawer memory={selected} onClose={() => setSelected(null)} onApply={() => setSelected(null)} /></section>;
}
