import { ArrowRight, Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function EmptyState({ title, description, action, onAction }: { title: string; description: string; action: string; onAction?: () => void }) {
  return <Card className="border-dashed"><CardContent className="flex flex-col items-center justify-center px-6 py-12 text-center"><span className="flex h-12 w-12 items-center justify-center rounded-full bg-intelligence/10 text-intelligence"><Inbox className="h-5 w-5" /></span><h2 className="mt-5 font-display text-2xl">{title}</h2><p className="mt-2 max-w-md text-sm leading-relaxed text-muted">{description}</p><Button type="button" variant="intelligence" className="mt-6" onClick={onAction}>{action}<ArrowRight className="h-4 w-4" /></Button></CardContent></Card>;
}
