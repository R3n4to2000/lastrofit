import Link from "next/link";
import { ArrowLeft, ArrowRight, Dumbbell, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { EmptyState } from "@/components/empty-state";
import { ExerciseCard } from "@/components/exercises/exercise-card";
import { catalogHref, listExercises, PAGE_SIZE, parseCatalogFilters } from "@/lib/exercises/catalog";
import { categoryOptions, difficultyOptions, equipmentOptions, muscleGroups } from "@/lib/exercises/options";

export const metadata = { title: "Biblioteca de exercícios | LastroFit" };

export default async function ExercisesPage({ searchParams }: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const filters = parseCatalogFilters(await searchParams);
  const initial = await listExercises(filters);
  const lastPage = Math.max(1, Math.ceil(initial.total / PAGE_SIZE));
  const currentPage = Math.min(filters.page, lastPage);
  const { items, total, error } = currentPage === filters.page
    ? initial
    : await listExercises({ ...filters, page: currentPage });
  const hasFilters = Boolean(filters.q || filters.muscle || filters.equipment || filters.difficulty || filters.category);

  return <div className="space-y-7">
    <div><Link href="/inicio" className="inline-flex min-h-10 items-center gap-2 text-sm font-medium text-primary hover:underline"><ArrowLeft className="size-4" aria-hidden="true" /> Início</Link>
      <div className="mt-3 flex flex-wrap items-center gap-3"><h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Exercícios</h1><Badge variant="secondary" className="text-primary">Biblioteca</Badge></div>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">Encontre um movimento, veja instruções e assista às demonstrações disponíveis.</p>
    </div>
    {process.env.NODE_ENV === "development" && !filters.preview && <Link href="/exercicios?preview=1" className="inline-flex min-h-10 items-center text-sm font-semibold text-primary underline-offset-4 hover:underline">Abrir prévia com dados de demonstração</Link>}
    {filters.preview && <p role="status" className="rounded-2xl border border-border bg-accent p-4 text-sm leading-6 text-primary">Prévia de desenvolvimento com traduções e vídeos CC0 ainda pendentes de revisão técnica. Não são recomendações de treino.</p>}
    <form method="get" action="/exercicios" role="search" className="space-y-4 rounded-3xl border border-border bg-card p-4 sm:p-6">
      {filters.preview && <input type="hidden" name="preview" value="1" />}
      <div><label htmlFor="exercise-q" className="mb-2 block text-sm font-semibold">Buscar por nome ou termo alternativo</label><div className="relative"><Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" aria-hidden="true" /><input id="exercise-q" name="q" type="search" maxLength={80} defaultValue={filters.q} placeholder="Ex.: remada" className="h-12 w-full rounded-xl border border-input bg-background pl-11 pr-4 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring" /></div></div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div><label htmlFor="muscle" className="mb-2 block text-sm font-semibold">Grupo muscular</label><select id="muscle" name="muscle" defaultValue={filters.muscle ?? ""} className="h-12 w-full rounded-xl border border-input bg-background px-3 text-sm focus-visible:outline-2 focus-visible:outline-ring"><option value="">Todos</option>{muscleGroups.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></div>
        <div><label htmlFor="equipment" className="mb-2 block text-sm font-semibold">Equipamento</label><select id="equipment" name="equipment" defaultValue={filters.equipment ?? ""} className="h-12 w-full rounded-xl border border-input bg-background px-3 text-sm focus-visible:outline-2 focus-visible:outline-ring"><option value="">Todos</option>{equipmentOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></div>
        <div><label htmlFor="difficulty" className="mb-2 block text-sm font-semibold">Dificuldade</label><select id="difficulty" name="difficulty" defaultValue={filters.difficulty ?? ""} className="h-12 w-full rounded-xl border border-input bg-background px-3 text-sm focus-visible:outline-2 focus-visible:outline-ring"><option value="">Todas</option>{difficultyOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></div>
        <div><label htmlFor="category" className="mb-2 block text-sm font-semibold">Categoria</label><select id="category" name="category" defaultValue={filters.category ?? ""} className="h-12 w-full rounded-xl border border-input bg-background px-3 text-sm focus-visible:outline-2 focus-visible:outline-ring"><option value="">Todas</option>{categoryOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></div>
      </div>
      <div className="flex flex-wrap items-center gap-3"><Button type="submit" className="h-12 min-w-32 rounded-xl">Buscar</Button>{hasFilters && <Link href={catalogHref({ ...filters, q: "", muscle: null, equipment: null, difficulty: null, category: null })} className="inline-flex min-h-11 items-center text-sm font-semibold text-primary underline-offset-4 hover:underline">Limpar filtros</Link>}</div>
    </form>
    {error ? <p role="alert" className="rounded-2xl bg-destructive/10 p-5 text-sm text-destructive">Não foi possível carregar a biblioteca agora. Tente novamente mais tarde.</p>
      : items.length ? <section aria-label="Resultados da busca"><p role="status" className="mb-4 text-sm text-muted-foreground">{total} {total === 1 ? "exercício encontrado" : "exercícios encontrados"}</p><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{items.map((exercise) => <ExerciseCard key={exercise.id} exercise={exercise} preview={filters.preview} />)}</div>
        {lastPage > 1 && <nav aria-label="Páginas de exercícios" className="mt-7 flex items-center justify-between gap-3 text-sm"><span>Página {currentPage} de {lastPage}</span><div className="flex gap-2">{currentPage > 1 && <Link href={catalogHref(filters, currentPage - 1)} className={buttonVariants({ variant: "outline", className: "h-11" })}>Anterior</Link>}{currentPage < lastPage && <Link href={catalogHref(filters, currentPage + 1)} className={buttonVariants({ variant: "outline", className: "h-11" })}>Próxima <ArrowRight className="size-4" aria-hidden="true" /></Link>}</div></nav>}
      </section>
      : <EmptyState icon={Dumbbell} title={hasFilters ? "Nenhum exercício encontrado" : "Biblioteca ainda sem exercícios aprovados"} description={hasFilters ? "Tente outro nome ou remova alguns filtros." : "Os exercícios aparecerão aqui após a revisão e aprovação do conteúdo."} href={hasFilters ? catalogHref({ ...filters, q: "", muscle: null, equipment: null, difficulty: null, category: null }) : undefined} action={hasFilters ? "Limpar filtros" : undefined} />}
  </div>;
}
