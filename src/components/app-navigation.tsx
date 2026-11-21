"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarDays, House, UserRound } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { href: "/inicio", label: "Início", icon: House },
  { href: "/semana", label: "Semana", icon: CalendarDays },
  { href: "/perfil", label: "Perfil", icon: UserRound },
];

export function AppNavigation({ mobile = false }: { mobile?: boolean }) {
  const pathname = usePathname();
  return <nav aria-label="Navegação principal" className={mobile ? "grid grid-cols-3 gap-1" : "space-y-1"}>
    {items.map(({ href, label, icon: Icon }) => {
      const active = pathname === href;
      return <Link key={href} href={href} aria-current={active ? "page" : undefined} className={cn(
        "flex items-center justify-center gap-3 rounded-2xl font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        mobile ? "min-h-14 flex-col gap-1 px-2 py-2 text-xs" : "min-h-12 justify-start px-4 text-sm",
        active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary hover:text-foreground",
      )}><Icon className="size-5" aria-hidden="true" />{label}</Link>;
    })}
  </nav>;
}
