"use client";

import { useEffect, useRef, useState } from "react";
import "./LineSidebar.css";

const curves = { smooth: (value) => value * value * (3 - 2 * value), linear: (value) => value, sharp: (value) => Math.pow(value, 3) };

export default function LineSidebar({ items = [], curve = "smooth", active = 0, onChange }) {
  const ref = useRef(null);
  const frame = useRef(0);
  const [activeIndex, setActiveIndex] = useState(active);
  useEffect(() => { const node = ref.current; if (!node) return; const update = (event) => { cancelAnimationFrame(frame.current); frame.current = requestAnimationFrame(() => { const rect = node.getBoundingClientRect(); const falloff = 1 - Math.min(1, Math.abs(event.clientY - (rect.top + rect.height / 2)) / (rect.height / 2)); node.style.setProperty("--effect", curves[curve](falloff).toFixed(3)); }); }; node.addEventListener("pointermove", update); return () => { cancelAnimationFrame(frame.current); node.removeEventListener("pointermove", update); }; }, [curve]);
  const select = (index) => { setActiveIndex(index); onChange?.(index); };
  return <aside ref={ref} className="rb-line-sidebar" style={{ "--items": items.length, "--active-index": activeIndex }}><div className="rb-line-marker" aria-hidden="true" />{items.map((item, index) => <button key={item.label} type="button" className={`rb-line-item ${index === activeIndex ? "is-active" : ""}`} onClick={() => select(index)} onKeyDown={(event) => { if (event.key === "ArrowDown") { event.preventDefault(); select(Math.min(items.length - 1, index + 1)); } if (event.key === "ArrowUp") { event.preventDefault(); select(Math.max(0, index - 1)); } }}><span className="rb-line-index">{String(index + 1).padStart(2, "0")}</span><span>{item.label}</span></button>)}</aside>;
}
