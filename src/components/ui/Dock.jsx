"use client";

import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { Children, isValidElement, useRef, useState } from "react";
import "./Dock.css";

export function Dock({ children, className = "" }) {
  const mouseX = useMotionValue(Infinity);
  return <motion.div className={`rb-dock ${className}`} onMouseMove={(event) => mouseX.set(event.pageX)} onMouseLeave={() => mouseX.set(Infinity)}>{Children.map(children, (child) => { if (!isValidElement(child)) return child; const Child = child.type; return <Child {...child.props} mouseX={mouseX} />; })}</motion.div>;
}

export function DockItem({ children, label, mouseX }) {
  const ref = useRef(null);
  const [hovered, setHovered] = useState(false);
  const fallbackMouseX = useMotionValue(Infinity);
  const distance = useTransform(mouseX || fallbackMouseX, (value) => {
    const bounds = ref.current?.getBoundingClientRect();
    if (!bounds || !Number.isFinite(value)) return 0;
    return Math.max(0, 1 - Math.abs(value - (bounds.left + bounds.width / 2)) / 140);
  });
  const scale = useSpring(useTransform(distance, [0, 1], [1, 1.55]), { stiffness: 360, damping: 24 });
  return <motion.div ref={ref} style={{ scale }} className="rb-dock-item" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>{children}<AnimatePresence>{hovered && label && <motion.span className="rb-dock-label" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }}>{label}</motion.span>}</AnimatePresence></motion.div>;
}

export function DockIcon({ children }) {
  return <motion.div className="rb-dock-icon" whileHover={{ y: -4, scale: 1.08 }} transition={{ type: "spring", stiffness: 420, damping: 22 }}>{children}</motion.div>;
}

export function DockLabel({ children }) {
  return <span className="rb-dock-label">{children}</span>;
}
