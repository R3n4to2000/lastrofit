import { ArrowRight, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";

export function EmptyState({ icon: Icon, title, description, href, action }: { icon: LucideIcon; title: string; description: string; href?: string; action?: string }) {
  return <Card className="border-dashed bg-card shadow-none"><CardContent className="flex min-h-72 flex-col items-center justify-center px-6 py-12 text-center">
    <span className="flex size-16 items-center justify-center rounded-3xl bg-accent text-primary"><Icon className="size-7" aria-hidden="true" /></span>
    <h2 className="mt-6 text-xl font-semibold tracking-tight">{title}</h2>
    <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">{description}</p>
    {href && action && <Link href={href} className={buttonVariants({ variant: "outline", className: "mt-6 h-10 rounded-full px-5" })}>{action}<ArrowRight className="size-4" aria-hidden="true" /></Link>}
  </CardContent></Card>;
}
