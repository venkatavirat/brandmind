"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";
import { TopHeader } from "@/components/layout/top-header";
import { CommandMenu } from "@/components/layout/command-menu";

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  useEffect(() => {
    const open = () => setCommandOpen(true);
    window.addEventListener("brandmind:command-menu", open);
    return () => window.removeEventListener("brandmind:command-menu", open);
  }, []);

  const bareRoute = pathname === "/" || pathname === "/privacy" || pathname === "/terms";
  if (bareRoute) return <>{children}</>;
  return (
    <div className="min-h-screen bg-background text-foreground">
      {mobileOpen && <button type="button" aria-label="Close navigation" className="fixed inset-0 z-30 bg-foreground/20 lg:hidden" onClick={() => setMobileOpen(false)} />}
      <Sidebar collapsed={collapsed} mobileOpen={mobileOpen} onToggle={() => setCollapsed((value) => !value)} />
      <div className={`${collapsed ? "lg:pl-16" : "lg:pl-60"} min-h-screen transition-[padding] duration-200`}>
        <TopHeader onCommandOpen={() => setCommandOpen(true)} onMobileMenu={() => setMobileOpen((value) => !value)} />
        <main>{children}</main>
      </div>
      <CommandMenu open={commandOpen} onClose={() => setCommandOpen(false)} />
    </div>
  );
}
