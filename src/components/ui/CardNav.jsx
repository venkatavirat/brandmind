"use client";

import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import Link from "next/link";

export default function CardNav({ logo = "BRANDMIND", links = [], className = "" }) {
  const [open, setOpen] = useState(false);
  const panel = useRef(null);
  useLayoutEffect(() => { if (!panel.current) return; const context = gsap.context(() => { gsap.to(panel.current, { height: open ? "auto" : 0, opacity: open ? 1 : 0, duration: .42, ease: "elastic.out(1,.8)" }); }, panel); return () => context.revert(); }, [open]);
  return <header className={`rb-card-nav ${className}`}><div className="rb-card-nav-bar"><Link href="/" className="rb-card-nav-logo">{logo}</Link><nav className="rb-card-nav-links">{links.map((link) => <a key={link.label} href={link.href}>{link.label}</a>)}</nav><button type="button" className="rb-card-nav-toggle" aria-expanded={open} onClick={() => setOpen((value) => !value)}><span /><span /></button></div><div ref={panel} className="rb-card-nav-panel"><nav>{links.map((link) => <a key={link.label} href={link.href} onClick={() => setOpen(false)}>{link.label}<span>↗</span></a>)}</nav></div><style jsx>{`.rb-card-nav{position:relative;border:1px solid rgba(148,163,184,.16);border-radius:16px;background:rgba(15,23,42,.86);color:#f8fafc;box-shadow:0 16px 50px rgba(2,6,23,.2);backdrop-filter:blur(16px)}.rb-card-nav-bar{display:flex;align-items:center;justify-content:space-between;min-height:64px;padding:0 18px}.rb-card-nav-logo{font:600 12px/1 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.18em;color:inherit}.rb-card-nav-links{display:flex;gap:26px}.rb-card-nav-links a,.rb-card-nav-panel a{color:#cbd5e1;font:12px/1 ui-monospace,SFMono-Regular,Menlo,monospace;text-decoration:none}.rb-card-nav-links a:hover,.rb-card-nav-panel a:hover{color:#fff}.rb-card-nav-toggle{display:none;width:44px;height:44px;border:0;background:transparent}.rb-card-nav-toggle span{display:block;width:18px;height:1px;margin:5px auto;background:#f8fafc}.rb-card-nav-panel{height:0;overflow:hidden;opacity:0}.rb-card-nav-panel nav{display:grid;grid-template-columns:repeat(2,1fr);gap:1px;padding:0 18px 18px}.rb-card-nav-panel a{display:flex;justify-content:space-between;padding:16px;border-top:1px solid rgba(148,163,184,.16)}@media(max-width:700px){.rb-card-nav-links{display:none}.rb-card-nav-toggle{display:block}}`}</style></header>;
}
