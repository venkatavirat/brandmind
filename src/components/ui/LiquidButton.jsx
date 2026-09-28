"use client";

export default function LiquidButton({ children = "Explore memory", className = "", ...props }) {
  return <button className={`rb-liquid-button ${className}`} {...props}><svg aria-hidden="true" width="0" height="0"><defs><filter id="rb-liquid-filter"><feTurbulence type="fractalNoise" baseFrequency=".018" numOctaves="2" result="noise" /><feDisplacementMap in="SourceGraphic" in2="noise" scale="3" /></filter></defs></svg><span>{children}</span></button>;
}
