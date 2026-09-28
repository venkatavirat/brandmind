"use client";

import { Bell, ChevronDown, Search, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function TopHeader({ onCommandOpen, onMobileMenu }: { onCommandOpen: () => void; onMobileMenu: () => void }) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background px-4 lg:px-6">
      <div className="flex items-center gap-3">
        <Button type="button" variant="ghost" className="px-2 lg:hidden" onClick={onMobileMenu} aria-label="Open navigation"><span className="text-lg">=</span></Button>
        <label className="relative hidden sm:block">
          <span className="sr-only">Search BrandMind</span>
          <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-muted" />
          <button type="button" onClick={onCommandOpen} className="h-10 w-72 rounded-md border border-border bg-card pl-9 pr-16 text-left text-sm text-muted hover:border-primary/50" aria-label="Open command menu">Search workspace...</button>
          <kbd className="pointer-events-none absolute right-2 top-2 rounded border border-border px-1.5 py-0.5 font-mono text-[10px] text-muted">Cmd K</kbd>
        </label>
        <Button type="button" variant="ghost" className="px-2 sm:hidden" onClick={onCommandOpen} aria-label="Open search"><Search className="h-4 w-4" /></Button>
      </div>
      <div className="flex items-center gap-2">
        <label className="relative hidden md:block">
          <span className="sr-only">Workspace</span>
          <select className="h-11 appearance-none rounded-md border border-border bg-card py-2 pl-3 pr-8 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring">
            <option>Acme Corp</option>
            <option>Personal Marketing</option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-2 top-3 h-3.5 w-3.5 text-muted" />
        </label>
        <Button type="button" variant="ghost" className="relative px-2" aria-label="Notifications"><Bell className="h-4 w-4" /><span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-intelligence" /></Button>
        <Button type="button" variant="ghost" className="gap-2 px-2" aria-label="Open user profile"><UserCircle className="h-5 w-5" /><span className="hidden text-sm md:inline">@member</span></Button>
      </div>
    </header>
  );
}
