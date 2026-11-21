import Link from "next/link";
import { ArrowLeft, MoveUpRight } from "lucide-react";
import { Brand } from "@/components/brand";

export function AuthShell({ children, title, description }: { children: React.ReactNode; title: string; description: string }) {
  return (
    <main id="conteudo" className="grid min-h-svh lg:grid-cols-[1fr_1fr]">
      <div className="flex min-h-svh flex-col px-5 py-6 sm:px-10 lg:px-16 lg:py-10">
        <div className="flex items-center justify-between"><Brand /><Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"><ArrowLeft className="size-4" aria-hidden="true" /> Voltar</Link></div>
        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-12">
          <p className="mb-3 text-xs font-bold uppercase tracking-[.18em] text-primary">Seu espaço começa aqui</p>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">{title}</h1>
          <p className="mt-3 text-base leading-7 text-muted-foreground">{description}</p>
          <div className="mt-8">{children}</div>
        </div>
        <p className="text-xs text-muted-foreground">Lastrofit · Um passo de cada vez.</p>
      </div>
      <div className="relative hidden overflow-hidden bg-primary p-12 text-primary-foreground lg:flex lg:flex-col lg:justify-between">
        <div className="absolute -right-20 top-20 size-96 rounded-full border-[70px] border-white/5" aria-hidden="true" />
        <div className="absolute -bottom-40 -left-28 size-[32rem] rounded-full border-[90px] border-accent/15" aria-hidden="true" />
        <span className="relative flex size-12 items-center justify-center rounded-2xl bg-white/10"><MoveUpRight className="size-5" aria-hidden="true" /></span>
        <div className="relative max-w-lg"><p className="text-sm font-semibold uppercase tracking-[.2em] text-accent">Movimento com propósito</p><p className="mt-5 text-5xl font-semibold leading-tight tracking-tight">Toda jornada forte começa de algum lugar.</p><p className="mt-5 text-lg text-primary-foreground/70">Encontre espaço para avançar no seu ritmo.</p></div>
        <p className="relative text-sm text-primary-foreground/60">Feito para quem está começando.</p>
      </div>
    </main>
  );
}
