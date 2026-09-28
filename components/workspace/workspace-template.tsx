import { ArrowUpRight, CheckCircle2, CircleDashed, Plus, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IntelligenceBadge } from "@/components/hindsight/intelligence-badge";
import { EmptyState } from "@/components/ui/empty-state";

export type WorkspaceSection = {
  title: string;
  description: string;
  items: string[];
  badge?: string;
  score?: number;
};

export type WorkspaceTemplateProps = {
  eyebrow: string;
  title: string;
  subtitle: string;
  actions: string[];
  stats: { label: string; value: string; detail: string }[];
  sections: WorkspaceSection[];
};

export function WorkspaceTemplate({ eyebrow, title, subtitle, actions, stats, sections }: WorkspaceTemplateProps) {
  const emptyState = title === "Launch & Campaigns" ? { title: "No campaigns yet...", description: "Start with a strategy, then move the approved brief into a stage-based campaign workspace.", action: "Create your first strategy" } : title === "Asset Library" ? { title: "No brand assets uploaded...", description: "Import your guidelines first so every campaign can use the right identity, type, and palette.", action: "Import brand guidelines" } : title === "Performance Analytics" ? { title: "No Hindsight learnings recorded...", description: "Run campaign analysis after your first launch to turn performance evidence into reusable memory.", action: "Run campaign analysis" } : null;
  return (
    <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:py-10">
      <header className="border-b border-border pb-7">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-intelligence">{eyebrow}</p>
        <div className="mt-4 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div><h1 className="font-display text-5xl tracking-tight sm:text-6xl">{title}</h1><p className="mt-4 max-w-2xl text-base leading-relaxed text-muted">{subtitle}</p></div>
          <div className="flex flex-wrap gap-2" aria-label="Quick actions">{actions.map((action) => <Button key={action} type="button" variant={action === actions[0] ? "intelligence" : "outline"}><Plus className="h-4 w-4" />{action}</Button>)}</div>
        </div>
      </header>
      <section className="grid gap-px border-b border-border bg-border sm:grid-cols-3">{stats.map((stat) => <div key={stat.label} className="bg-background py-6 pr-6 first:pl-0 sm:pl-6"><p className="font-mono text-xs uppercase tracking-widest text-muted">{stat.label}</p><p className="mt-3 font-display text-4xl">{stat.value}</p><p className="mt-2 text-sm text-muted">{stat.detail}</p></div>)}</section>
      <section className="grid gap-4 py-8 md:grid-cols-2 xl:grid-cols-3">{sections.map((section) => <Card key={section.title} className="flex h-full flex-col"><CardHeader><div className="flex items-start justify-between gap-3"><CardTitle>{section.title}</CardTitle>{section.score !== undefined ? <IntelligenceBadge score={section.score} /> : section.badge && <Badge variant="secondary">{section.badge}</Badge>}</div><p className="text-sm leading-relaxed text-muted">{section.description}</p></CardHeader><CardContent className="flex flex-1 flex-col"><ul className="space-y-3 text-sm text-foreground">{section.items.map((item, index) => <li key={item} className="flex gap-2"><span className="mt-0.5 text-intelligence">{index === 0 ? <CheckCircle2 className="h-4 w-4" /> : <CircleDashed className="h-4 w-4" />}</span><span>{item}</span></li>)}</ul><Button type="button" variant="ghost" className="mt-6 justify-between px-0 text-intelligence hover:bg-transparent">Open workspace <ArrowUpRight className="h-4 w-4" /></Button></CardContent></Card>)}</section>
      {emptyState && <EmptyState title={emptyState.title} description={emptyState.description} action={emptyState.action} />}
      <aside className="flex items-center gap-3 border-t border-border py-5 text-sm text-muted"><Sparkles className="h-4 w-4 text-intelligence" />Insights are grounded in BrandMind&apos;s shared memory layer.</aside>
    </div>
  );
}
