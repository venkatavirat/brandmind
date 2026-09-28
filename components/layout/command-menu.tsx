"use client";

import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const destinations = [
  { group: "Workspaces", label: "Command Center", href: "/dashboard" },
  { group: "Projects", label: "Campaign Projects", href: "/execute/campaigns" },
  { group: "Research", label: "Research Center", href: "/discover/research" },
  { group: "Campaigns", label: "Launch & Campaigns", href: "/execute/campaigns" },
  { group: "Insights", label: "Analytics", href: "/measure/analytics" },
  { group: "Memories", label: "Hindsight Memory", href: "/learn/hindsight" },
];

export function CommandMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const results = useMemo(() => destinations.filter((item) => `${item.group} ${item.label}`.toLowerCase().includes(query.toLowerCase())), [query]);
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        window.dispatchEvent(new CustomEvent("brandmind:command-menu"));
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);
  return <Dialog open={open} onClose={onClose} title="Command menu" description="Navigate across workspaces, projects, research, campaigns, insights, and memories.">
    <div className="relative"><Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-muted" /><input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search everything..." className="h-10 w-full rounded-md border border-border bg-background pl-9 text-sm text-foreground outline-none focus:ring-2 focus:ring-intelligence" /></div>
    <div className="mt-4 max-h-72 space-y-1 overflow-y-auto">{results.map((item) => <Button key={`${item.group}-${item.href}`} type="button" variant="ghost" className="h-auto w-full justify-between px-3 py-2 text-left" onClick={() => { window.location.href = item.href; }}>{item.label}<span className="font-mono text-[10px] text-muted">{item.group}</span></Button>)}{!results.length && <p className="p-3 text-sm text-muted">No destinations found.</p>}</div>
  </Dialog>;
}
