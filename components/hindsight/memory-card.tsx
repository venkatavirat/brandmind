import { ArrowUpRight, Clock3 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IntelligenceBadge } from "@/components/hindsight/intelligence-badge";
import type { HindsightMemory } from "@/lib/constants/hindsight-mock";

export function MemoryCard({ memory, onSelect }: { memory: HindsightMemory; onSelect: (memory: HindsightMemory) => void }) {
  return (
    <Card className="h-full transition-colors hover:border-intelligence-border">
      <CardHeader className="gap-3">
        <div className="flex items-start justify-between gap-3">
          <Badge variant="secondary">{memory.categoryLabel}</Badge>
          <IntelligenceBadge score={memory.confidence} />
        </div>
        <CardTitle>{memory.title}</CardTitle>
        <p className="flex items-center gap-1.5 text-xs text-muted"><Clock3 className="h-3.5 w-3.5" />{memory.timestamp}</p>
      </CardHeader>
      <CardContent className="space-y-5">
        <p className="text-sm leading-relaxed text-muted">{memory.executiveSummary}</p>
        <div className="flex flex-wrap gap-2">{memory.impactMetrics.map((metric) => <Badge key={metric} variant="intelligence">{metric}</Badge>)}</div>
        <div><p className="font-mono text-[10px] uppercase tracking-widest text-muted">Key takeaways</p><ul className="mt-2 space-y-2 text-sm text-foreground">{memory.takeaways.map((takeaway) => <li key={takeaway} className="border-l-2 border-intelligence pl-3">{takeaway}</li>)}</ul></div>
        <Button type="button" variant="ghost" className="w-full justify-between px-0 text-intelligence hover:bg-transparent" onClick={() => onSelect(memory)}>Open memory <ArrowUpRight className="h-4 w-4" /></Button>
      </CardContent>
    </Card>
  );
}
