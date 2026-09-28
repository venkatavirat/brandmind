"use client";

import { motion } from "motion/react";

export default function JellyRadio({ options = ["Overview", "Experiments", "Memory"], value, onChange }) {
  const selected = value ?? options[0];
  return <div className="rb-jelly-radio" role="radiogroup" aria-label="Dashboard mode">{options.map((option) => <button key={option} type="button" role="radio" aria-checked={selected === option} onClick={() => onChange?.(option)} className={`rb-jelly-option ${selected === option ? "is-selected" : ""}`}>{selected === option && <motion.span layoutId="rb-jelly-pill" className="rb-jelly-pill" transition={{ type: "spring", stiffness: 500, damping: 32 }} />}<span>{option}</span></button>)}</div>;
}
