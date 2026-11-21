import { redirect } from "next/navigation";
import { Brand } from "@/components/brand";
import { AppNavigation } from "@/components/app-navigation";
import { getSupabaseConfig } from "@/lib/supabase/config";
import { getCurrentUser } from "@/lib/supabase/auth";

export const dynamic = "force-dynamic";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const configured = Boolean(getSupabaseConfig());
  const user = configured ? await getCurrentUser() : null;
  if (configured && !user) redirect("/entrar?aviso=entre-para-continuar");
  return <div className="min-h-svh bg-background lg:grid lg:grid-cols-[16rem_1fr]">
    <aside className="hidden border-r border-border bg-card px-5 py-7 lg:flex lg:flex-col">
      <Brand />
      <p className="mt-14 px-4 text-xs font-bold uppercase tracking-[.16em] text-muted-foreground">Seu espaço</p>
      <div className="mt-4"><AppNavigation /></div>
      <div className="mt-auto rounded-2xl bg-accent p-4 text-sm text-primary"><p className="font-semibold">Um passo de cada vez.</p><p className="mt-1 opacity-80">Sua jornada começa no seu ritmo.</p></div>
    </aside>
    <div className="min-w-0">
      <header className="flex h-20 items-center justify-between border-b border-border bg-card px-5 sm:px-8 lg:px-12">
        <div className="lg:hidden"><Brand /></div>
        <p className="hidden text-sm text-muted-foreground lg:block">Seu espaço para seguir em frente.</p>
        <span className="flex size-10 items-center justify-center rounded-full bg-accent text-sm font-bold text-primary" aria-label={user?.email ? `Conta de ${user.email}` : "Prévia da interface"}>{user?.email?.slice(0, 1).toUpperCase() ?? "L"}</span>
      </header>
      {!configured && <p role="status" className="border-b border-border bg-accent px-5 py-3 text-center text-xs font-medium text-primary sm:px-8">Prévia da interface · configure o Supabase para habilitar contas.</p>}
      <main id="conteudo" className="mx-auto max-w-6xl px-5 pb-28 pt-8 sm:px-8 sm:pt-10 lg:px-12 lg:pb-14">{children}</main>
      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-card/95 px-3 pb-[max(env(safe-area-inset-bottom),.75rem)] pt-2 backdrop-blur lg:hidden"><AppNavigation mobile /></div>
    </div>
  </div>;
}
