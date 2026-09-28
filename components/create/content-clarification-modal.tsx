"use client";

import { WandSparkles } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";

export type ContentClarifications = { tone: string; format: string; cta: string; audience: string };

const defaults: ContentClarifications = { tone: "Encouraging and practical", format: "Short-form video", cta: "See how it works", audience: "New category entrants" };

export function ContentClarificationModal({ onGenerate }: { onGenerate?: (clarifications: ContentClarifications) => void }) {
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState(defaults);
  const update = (key: keyof ContentClarifications, value: string) => setValues((current) => ({ ...current, [key]: value }));
  return <><Button type="button" variant="intelligence" onClick={() => setOpen(true)}><WandSparkles className="h-4 w-4" />Clarify &amp; generate</Button><Dialog open={open} onClose={() => setOpen(false)} title="Clarify the content brief" description="A few inputs help BrandMind create work that fits the audience and the memory already earned."><div className="grid gap-4 sm:grid-cols-2"><label className="text-sm text-foreground">Target tone<input value={values.tone} onChange={(event) => update("tone", event.target.value)} className="mt-1.5 h-11 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring" /></label><label className="text-sm text-foreground">Platform format<select value={values.format} onChange={(event) => update("format", event.target.value)} className="mt-1.5 h-11 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"><option>Short-form video</option><option>Carousel</option><option>Landing page</option><option>Email</option></select></label><label className="text-sm text-foreground">Primary CTA<input value={values.cta} onChange={(event) => update("cta", event.target.value)} className="mt-1.5 h-11 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring" /></label><label className="text-sm text-foreground">Audience segment<input value={values.audience} onChange={(event) => update("audience", event.target.value)} className="mt-1.5 h-11 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring" /></label></div><div className="mt-5 flex justify-end gap-2"><Button type="button" variant="outline" onClick={() => setValues(defaults)}>Use suggestions</Button><Button type="button" variant="intelligence" onClick={() => { onGenerate?.(values); setOpen(false); }}>Generate with Clarifications</Button></div></Dialog></>;
}
