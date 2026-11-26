import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { resolveExerciseMedia } from "@/lib/exercises/media";
import { difficultyOptions, equipmentOptions, optionLabel } from "@/lib/exercises/options";
import type { ExerciseSummary } from "@/lib/exercises/catalog";
import { ExerciseMedia } from "./exercise-media";

export function ExerciseCard({ exercise, preview = false }: { exercise: ExerciseSummary; preview?: boolean }) {
  const href = `/exercicios/${exercise.id}${preview ? "?preview=1" : ""}`;
  return <article className="overflow-hidden rounded-3xl border border-border bg-card p-3 shadow-sm">
    <ExerciseMedia asset={resolveExerciseMedia(exercise)} />
    <div className="px-2 pb-2 pt-4">
      <Badge variant="secondary" className="text-primary">{optionLabel(difficultyOptions, exercise.difficulty)}</Badge>
      <h2 className="mt-3 text-lg font-semibold leading-snug"><Link href={href} className="rounded-sm underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">{exercise.name}</Link></h2>
      <p className="mt-2 text-sm text-muted-foreground">{optionLabel(equipmentOptions, exercise.equipment)}</p>
      <Link href={href} className="mt-4 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-primary underline-offset-4 hover:underline">Ver execução <ArrowUpRight className="size-4" aria-hidden="true" /></Link>
    </div>
  </article>;
}
