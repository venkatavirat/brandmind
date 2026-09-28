"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Activity, BarChart3, BookOpen, ChevronLeft, Compass, FolderKanban, Gauge, Lightbulb, Menu, PanelsTopLeft, Search, Target, Users } from "lucide-react";

const groups = [
  { label: "COMMAND", items: [{ label: "Command Center", href: "/dashboard", icon: Gauge }] },
  { label: "BRAND", items: [{ label: "Brand HQ", href: "/brand/hq", icon: PanelsTopLeft }, { label: "Assets", href: "/brand/assets", icon: FolderKanban }] },
  { label: "DISCOVER", items: [{ label: "Research", href: "/discover/research", icon: Search }, { label: "Audience", href: "/discover/audience", icon: Users }, { label: "Competitor", href: "/discover/competitors", icon: Compass }, { label: "Journey", href: "/discover/journey", icon: Activity }] },
  { label: "PLAN", items: [{ label: "Strategy", href: "/plan/strategy", icon: Target }] },
  { label: "CREATE", items: [{ label: "Content Workspace", href: "/create/content", icon: Lightbulb }] },
  { label: "EXECUTE", items: [{ label: "Launch & Campaigns", href: "/execute/campaigns", icon: FolderKanban }] },
  { label: "MEASURE", items: [{ label: "Analytics", href: "/measure/analytics", icon: BarChart3 }] },
  { label: "LEARN", items: [{ label: "Hindsight Memory", href: "/learn/hindsight", icon: BookOpen }] },
];

export function Sidebar({ collapsed, onToggle, mobileOpen = false }: { collapsed: boolean; onToggle: () => void; mobileOpen?: boolean }) {
  const pathname = usePathname();
  return (
    <motion.aside animate={{ width: collapsed ? 64 : 240 }} transition={{ duration: 0.2 }} className={`${mobileOpen ? "block" : "hidden"} fixed inset-y-0 left-0 z-40 border-r border-border bg-background lg:block`}>
      <div className="flex h-16 items-center justify-between border-b border-border px-3">
        <Link href="/dashboard" className={`flex items-center gap-2 overflow-hidden text-foreground ${collapsed ? "justify-center" : ""}`}>
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary text-sm font-semibold text-background">B</span>
          {!collapsed && <span className="font-display text-xl whitespace-nowrap">BrandMind</span>}
        </Link>
        <button type="button" aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"} onClick={onToggle} className="min-h-11 min-w-11 rounded-md p-1.5 text-muted hover:bg-muted/10 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
          {collapsed ? <Menu className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>
      <nav className="h-[calc(100vh-4rem)] overflow-y-auto px-2 py-4 pb-8">
        {groups.map((group) => (
          <div key={group.label} className="mb-5">
            {!collapsed && <p className="px-3 font-mono text-[10px] tracking-[0.18em] text-muted">{group.label}</p>}
            <div className="mt-1 space-y-0.5">
              {group.items.map((item) => {
                const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
                const Icon = item.icon;
                return <Link key={item.href} href={item.href} title={collapsed ? item.label : undefined} className={`flex min-h-11 items-center gap-3 rounded-md border-l-2 px-3 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${collapsed ? "justify-center" : ""} ${active ? "border-primary bg-muted/10 font-medium text-foreground" : "border-transparent text-muted hover:bg-muted/10 hover:text-foreground"}`}><Icon className="h-4 w-4 shrink-0" strokeWidth={1.7} />{!collapsed && <span className="whitespace-nowrap">{item.label}</span>}</Link>;
              })}
            </div>
          </div>
        ))}
      </nav>
    </motion.aside>
  );
}
