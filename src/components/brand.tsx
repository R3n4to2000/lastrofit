import Link from "next/link";
import { Activity } from "lucide-react";

export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="inline-flex items-center gap-2.5 rounded-md font-bold tracking-tight text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring" aria-label="Lastrofit, página inicial">
      <span className="flex size-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground"><Activity className="size-5" strokeWidth={2.5} aria-hidden="true" /></span>
      {!compact && <span className="text-xl">lastro<span className="text-primary">fit</span></span>}
    </Link>
  );
}
