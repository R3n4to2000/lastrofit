import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CircleAlert, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ExerciseMedia } from "@/components/exercises/exercise-media";
import { ExerciseCard } from "@/components/exercises/exercise-card";
import { getExercise, getSubstitutes } from "@/lib/exercises/catalog";
import { resolveExerciseMedia } from "@/lib/exercises/media";
import { categoryOptions, difficultyOptions, equipmentOptions, muscleGroups, optionLabel } from "@/lib/exercises/options";

export default async function ExerciseDetailPage({ params, searchParams }: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ preview?: string }>;
}) {
  const { id } = await params;
  const preview = process.env.NODE_ENV === "development" && (await searchParams).preview === "1";
  const { exercise, error } = await getExercise(id, preview);
  if (!exercise && !error) notFound();
  if (!exercise) return <p role="alert" className="rounded-2xl bg-destructive/10 p-5 text-sm text-destructive">Não foi possível carregar este exercício agora.</p>;
  const substitutes = await getSubstitutes(id, preview);
  const back = preview ? "/exercicios?preview=1" : "/exercicios";
  const media = resolveExerciseMedia(exercise);
  const steps = exercise.instructions.split(/(?<=[.!?])\s+/).filter(Boolean);

  return <div className="mx-auto max-w-4xl space-y-7">
    <Link href={back} className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-primary hover:underline"><ArrowLeft className="size-4" aria-hidden="true" /> Voltar à biblioteca</Link>
    {preview && <p role="status" className="rounded-2xl border border-border bg-accent p-4 text-sm leading-6 text-primary">Prévia com tradução e vídeo CC0 pendentes de revisão técnica. Consulte um profissional para adaptar o movimento à sua condição.</p>}
    <header><div className="flex flex-wrap gap-2"><Badge variant="secondary" className="text-primary">{optionLabel(difficultyOptions, exercise.difficulty)}</Badge>{exercise.category && <Badge variant="outline">{optionLabel(categoryOptions, exercise.category)}</Badge>}</div><h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">{exercise.name}</h1><dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2"><div><dt className="font-semibold">Grupo principal</dt><dd className="text-muted-foreground">{optionLabel(muscleGroups, exercise.primary_muscle)}</dd></div><div><dt className="font-semibold">Músculos secundários</dt><dd className="text-muted-foreground">{exercise.secondary_muscles.length ? exercise.secondary_muscles.map((group) => optionLabel(muscleGroups, group)).join(", ") : "Não informados"}</dd></div><div><dt className="font-semibold">Equipamentos</dt><dd className="text-muted-foreground">{exercise.equipment_list.length ? exercise.equipment_list.map((item) => optionLabel(equipmentOptions, item)).join(", ") : optionLabel(equipmentOptions, exercise.equipment)}</dd></div></dl></header>
    <div className="grid gap-7 md:grid-cols-[1.2fr_1fr]"><div><ExerciseMedia asset={media} eager /><p className="mt-2 text-xs text-muted-foreground">{media ? preview ? "Vídeo CC0 candidato, ainda não aprovado para publicação." : "Demonstração visual do exercício." : "Não há demonstração animada autorizada para este exercício."}</p></div>
      <section aria-labelledby="instructions-title" className="rounded-3xl border border-border bg-card p-5 sm:p-6"><h2 id="instructions-title" className="text-xl font-semibold">Como fazer</h2>{steps.length ? <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-7 text-muted-foreground">{steps.map((step) => <li key={step}>{step}</li>)}</ol> : <p className="mt-3 text-sm leading-7 text-muted-foreground">Instruções em revisão. Consulte um profissional habilitado.</p>}{exercise.precautions && <div className="mt-5 flex gap-3 rounded-2xl bg-secondary p-4 text-sm leading-6"><CircleAlert className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" /><p>{exercise.precautions}</p></div>}</section></div>
    <section aria-labelledby="mistakes-title" className="rounded-3xl border border-border bg-card p-5 sm:p-6"><h2 id="mistakes-title" className="text-xl font-semibold">Erros comuns</h2>{exercise.common_mistakes.length ? <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-6 text-muted-foreground">{exercise.common_mistakes.map((mistake) => <li key={mistake}>{mistake}</li>)}</ul> : <p className="mt-3 text-sm text-muted-foreground">Este conteúdo ainda está em revisão.</p>}</section>
    <section aria-labelledby="substitutes-title"><div className="mb-4 flex items-center gap-2"><ShieldCheck className="size-5 text-primary" aria-hidden="true" /><h2 id="substitutes-title" className="text-xl font-semibold">Substitutos aprovados</h2></div>{substitutes.length ? <div className="grid gap-4 sm:grid-cols-2">{substitutes.map((item) => <ExerciseCard key={item.id} exercise={item} preview={preview} />)}</div> : <p className="rounded-2xl border border-dashed border-border p-5 text-sm text-muted-foreground">Nenhum substituto aprovado disponível para este exercício.</p>}</section>
  </div>;
}
