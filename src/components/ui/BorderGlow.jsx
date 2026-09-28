"use client";

import { useRef } from "react";

export default function BorderGlow({ children, className = "" }) {
  const ref = useRef(null);
  const move = (event) => { const rect = ref.current?.getBoundingClientRect(); if (!rect) return; ref.current.style.setProperty("--glow-x", `${event.clientX - rect.left}px`); ref.current.style.setProperty("--glow-y", `${event.clientY - rect.top}px`); };
  return <div ref={ref} onPointerMove={move} className={`rb-border-glow ${className}`}><div className="rb-border-glow-inner">{children}</div></div>;
}
