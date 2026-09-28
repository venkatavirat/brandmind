"use client";

import { useState } from "react";

export default function MetalButton({ children = "Open workspace", className = "", ...props }) {
  const [position, setPosition] = useState({ x: 50, y: 50 });
  return <button className={`rb-metal-button ${className}`} style={{ "--shine-x": `${position.x}%`, "--shine-y": `${position.y}%` }} onPointerMove={(event) => { const rect = event.currentTarget.getBoundingClientRect(); setPosition({ x: ((event.clientX - rect.left) / rect.width) * 100, y: ((event.clientY - rect.top) / rect.height) * 100 }); }} {...props}>{children}</button>;
}
