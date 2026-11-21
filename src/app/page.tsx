import Link from "next/link";
import { ArrowRight, Check, HeartPulse, ShieldCheck, Sparkles } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Brand } from "@/components/brand";

const benefits = [
  { icon: HeartPulse, title: "Comece no seu ritmo", text: "Uma experiência pensada para quem está dando os primeiros passos." },
  { icon: Sparkles, title: "Clareza em cada etapa", text: "Encontre o que precisa sem menus complicados ou excesso de informação." },
  { icon: ShieldCheck, title: "Seus dados, com cuidado", text: "Uma base preparada para proteger sua conta e suas informações." },
];

export default function WelcomePage() {
  return (
    <main id="conteudo" className="min-h-svh bg-background">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <header className="flex h-20 items-center justify-between gap-4" aria-label="Cabeçalho">
          <Brand />
          <Link href="/entrar" className="text-sm font-semibold text-primary underline-offset-4 hover:underline focus-visible:underline">Entrar</Link>
        </header>
        <section className="grid items-center gap-12 py-12 sm:py-20 lg:grid-cols-[1fr_.9fr] lg:gap-20 lg:py-28">
          <div>
            <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-4 py-2 text-xs font-bold uppercase tracking-[.16em] text-primary">
              <span className="size-2 rounded-full bg-accent-strong" /> Seu começo é aqui
            </p>
            <h1 className="max-w-2xl text-5xl font-bold leading-[1.06] tracking-tight text-foreground sm:text-6xl lg:text-7xl">
              Treinar começa com um <span className="text-primary">passo possível.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-muted-foreground">
              Um espaço simples para organizar sua jornada de treinos, acompanhar sua semana e avançar com confiança.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href="/cadastro" className={buttonVariants({ size: "lg", className: "h-13 rounded-full px-7 text-base" })}>
                Criar minha conta <ArrowRight aria-hidden="true" className="size-4" />
              </Link>
              <Link href="/inicio" className={buttonVariants({ variant: "outline", size: "lg", className: "h-13 rounded-full px-7 text-base" })}>
                Conhecer a interface
              </Link>
            </div>
            <p className="mt-5 text-sm text-muted-foreground">Sem pressa. O importante é começar.</p>
          </div>
          <div className="relative mx-auto w-full max-w-md" aria-label="Prévia da experiência Lastrofit">
            <div className="absolute -inset-5 rounded-[3rem] bg-accent/30 blur-3xl" aria-hidden="true" />
            <div className="relative overflow-hidden rounded-[2.5rem] border border-primary/10 bg-primary p-6 text-primary-foreground shadow-2xl shadow-primary/20 sm:p-8">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-[.2em] text-primary-foreground/60">LASTROFIT</span>
                <span className="flex size-10 items-center justify-center rounded-full bg-white/10"><HeartPulse className="size-5" aria-hidden="true" /></span>
              </div>
              <div className="mt-16">
                <p className="text-sm text-primary-foreground/70">Sua jornada, no seu tempo</p>
                <h2 className="mt-2 text-4xl font-semibold leading-tight tracking-tight">Um lugar para<br />seguir em frente.</h2>
              </div>
              <div className="mt-12 rounded-3xl bg-white p-6 text-foreground">
                <p className="text-xs font-bold uppercase tracking-[.16em] text-primary">Primeiro passo</p>
                <div className="mt-5 flex items-center gap-4">
                  <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-accent text-primary"><Check className="size-6" aria-hidden="true" /></span>
                  <div><p className="font-semibold">Crie seu espaço</p><p className="mt-1 text-sm text-muted-foreground">Tudo começa com você.</p></div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="grid gap-4 border-t border-border py-12 md:grid-cols-3 md:py-16" aria-label="O que esperar">
          {benefits.map(({ icon: Icon, title, text }) => (
            <div key={title} className="rounded-3xl bg-card p-6 sm:p-7">
              <span className="flex size-11 items-center justify-center rounded-2xl bg-accent text-primary"><Icon className="size-5" aria-hidden="true" /></span>
              <h2 className="mt-5 text-lg font-semibold">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p>
            </div>
          ))}
        </section>
        <footer className="border-t border-border py-7 text-sm text-muted-foreground">© {new Date().getFullYear()} Lastrofit. Feito para começar.</footer>
      </div>
    </main>
  );
}
