"use client";

import { AlertTriangle, CheckCircle2, Circle } from "lucide-react";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const initialChecks = [
  { id: "brand", label: "Brand Compliance", detail: "Voice, logo, and claims match approved guidelines.", checked: true },
  { id: "asset", label: "Asset Resolution", detail: "All placements have production-ready exports.", checked: true },
  { id: "tracking", label: "Link Tracking", detail: "UTMs and conversion events are connected.", checked: false },
  { id: "audience", label: "Target Audience Match", detail: "Audience and message are aligned to the brief.", checked: true },
  { id: "budget", label: "Budget Cap", detail: "Spend guardrail and stop condition are recorded.", checked: false },
];

export function LaunchChecklist({ onLaunch }: { onLaunch?: () => void }) {
  const [checks, setChecks] = useState(initialChecks);
  const ready = checks.every((item) => item.checked);
  const status = useMemo(() => ready ? "Ready" : checks.some((item) => !item.checked && item.id === "tracking") ? "Blocked" : "Attention Needed", [checks, ready]);
  const toggle = (id: string) => setChecks((items) => items.map((item) => item.id === id ? { ...item, checked: !item.checked } : item));
  return <Card className="border-intelligence-border"><CardHeader><div className="flex items-center justify-between gap-4"><CardTitle>Pre-flight checklist</CardTitle><Badge variant={status === "Ready" ? "success" : status === "Blocked" ? "destructive" : "warning"}>{status}</Badge></div><p className="text-sm text-muted">Confirm every launch dependency before publishing campaign work.</p></CardHeader><CardContent><div className="space-y-2">{checks.map((item) => <button key={item.id} type="button" role="checkbox" aria-checked={item.checked} onClick={() => toggle(item.id)} className="flex w-full items-start gap-3 rounded-md border border-border p-3 text-left transition-colors hover:bg-muted/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-intelligence"><span className={item.checked ? "mt-0.5 text-success" : "mt-0.5 text-muted"}>{item.checked ? <CheckCircle2 className="h-5 w-5" /> : <Circle className="h-5 w-5" />}</span><span className="flex-1"><span className="block text-sm font-medium text-foreground">{item.label}</span><span className="mt-1 block text-xs text-muted">{item.detail}</span></span>{!item.checked && item.id === "tracking" && <AlertTriangle className="h-4 w-4 text-warning" />}</button>)}</div><div className="mt-5 flex items-center justify-between gap-3 border-t border-border pt-5"><p className="text-sm text-muted">{ready ? "All launch checks passed." : `${checks.filter((item) => item.checked).length} of ${checks.length} checks complete.`}</p><Button type="button" variant="intelligence" disabled={!ready} onClick={onLaunch}>Launch Campaign</Button></div></CardContent></Card>;
}
