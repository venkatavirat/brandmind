export type MemoryCategory = "Audience" | "Creative" | "Campaigns" | "Strategy";

export interface HindsightMemory {
  id: string;
  title: string;
  category: MemoryCategory;
  categoryLabel: string;
  timestamp: string;
  executiveSummary: string;
  confidence: number;
  impactMetrics: string[];
  takeaways: string[];
  supportingData: string[];
  rawSource: string;
  connectedGuidelines: string[];
}

export const hindsightMemories: HindsightMemory[] = [
  {
    id: "HM-024",
    title: "Demonstration-first creative earned qualified attention",
    category: "Creative",
    categoryLabel: "Creative Performance",
    timestamp: "2026-09-18",
    executiveSummary: "Short product demonstrations outperformed polished brand montage creative when unfamiliar audiences needed proof before intent.",
    confidence: 92,
    impactMetrics: ["+18% CTR vs benchmark", "+11% qualified sessions"],
    takeaways: ["Lead with the product in motion within the first three seconds.", "Pair reach creative with a proof point rather than a discount."],
    supportingData: ["Three paid social variants", "14-day observation window", "Audience: new category entrants"],
    rawSource: "Experiment EXP-018: product demonstration Reels",
    connectedGuidelines: ["Evidence before urgency", "Practical, non-intimidating tone"],
  },
  {
    id: "HM-021",
    title: "Repeated direct promotion triggered fatigue",
    category: "Campaigns",
    categoryLabel: "Campaign Hindsight",
    timestamp: "2026-09-04",
    executiveSummary: "A discount-led acquisition sequence generated reach but lost conversion efficiency after the same creative appeared repeatedly.",
    confidence: 88,
    impactMetrics: ["CAC +42%", "Checkout completion -16%"],
    takeaways: ["Rotate creative before audience fatigue becomes visible in comments.", "Do not use price as the default acquisition story."],
    supportingData: ["Seven-day retargeting window", "20% discount code", "Existing followers and lookalikes"],
    rawSource: "Experiment EXP-015: 20% flash sale Reels",
    connectedGuidelines: ["Story before promotion", "Protect perceived value"],
  },
  {
    id: "HM-017",
    title: "Useful research became a sales conversation",
    category: "Audience",
    categoryLabel: "Audience Insight",
    timestamp: "2026-08-26",
    executiveSummary: "Senior B2B buyers shared original benchmark data internally and returned with implementation questions, signaling high-quality consideration.",
    confidence: 86,
    impactMetrics: ["SQL volume +35%", "CPL $48"],
    takeaways: ["Give expert buyers evidence they can circulate internally.", "Measure sales acceptance alongside lead volume."],
    supportingData: ["Founder-led distribution", "50-500 employee SaaS companies", "LinkedIn benchmark report"],
    rawSource: "Experiment EXP-011: original benchmark report",
    connectedGuidelines: ["Specific over generic", "Teach before asking"],
  },
  {
    id: "HM-013",
    title: "Message continuity removed branded-search friction",
    category: "Strategy",
    categoryLabel: "Strategic Rule",
    timestamp: "2026-08-11",
    executiveSummary: "Exact-match branded search paired with intent-matched landing pages converted efficiently because the promise stayed consistent from query to page.",
    confidence: 94,
    impactMetrics: ["ROAS 4.2x", "Conversion rate +18%"],
    takeaways: ["Keep high-intent search architecture separate from generic acquisition.", "Mirror the searched problem in the landing page headline."],
    supportingData: ["Exact-match branded terms", "Comparison messaging", "Intent-matched landing page"],
    rawSource: "Experiment EXP-009: branded search defense",
    connectedGuidelines: ["Make the next step obvious", "Respect existing intent"],
  },
];
