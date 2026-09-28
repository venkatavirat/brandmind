"use client";

import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { useRef } from "react";

export default function ContainerScroll({ title, children, className = "" }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center center"] });
  const rotateX = useSpring(useTransform(scrollYProgress, [0, 1], [14, 0]), { stiffness: 100, damping: 22 });
  const scale = useSpring(useTransform(scrollYProgress, [0, 1], [.88, 1]), { stiffness: 100, damping: 22 });
  return <section ref={ref} className={`rb-container-scroll ${className}`}><motion.div className="rb-container-scroll-card" style={{ rotateX, scale, transformPerspective: 1200 }}><div className="rb-container-scroll-title">{title}</div>{children}</motion.div></section>;
}
