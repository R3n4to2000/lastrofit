import "server-only";
import demo from "../../../data/demo-exercises.json";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { difficultyOptions, equipmentOptions, muscleGroups, validOption } from "./options";

export const PAGE_SIZE = 12;
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export type ExerciseSummary = {
  id: string; name: string; muscle_groups: string[]; equipment: string | null;
  difficulty: string; media_url: string | null; media_alt: string | null;
};
export type ExerciseDetail = ExerciseSummary & {
  alternate_names: string[]; instructions: string; common_mistakes: string[]; precautions: string | null;
};
export type CatalogFilters = { q: string; muscle: string | null; equipment: string | null; difficulty: string | null; page: number; preview: boolean };
type RawFilters = Record<string, string | string[] | undefined>;

export function parseCatalogFilters(raw: RawFilters): CatalogFilters {
  const one = (value: string | string[] | undefined) => typeof value === "string" ? value : "";
  const page = Number(one(raw.page));
  return {
    q: one(raw.q).trim().slice(0, 80),
    muscle: validOption(muscleGroups, raw.muscle),
    equipment: validOption(equipmentOptions, raw.equipment),
    difficulty: validOption(difficultyOptions, raw.difficulty),
    page: Number.isSafeInteger(page) && page > 0 && page <= 1000 ? page : 1,
    preview: process.env.NODE_ENV === "development" && one(raw.preview) === "1",
  };
}

function matches(exercise: ExerciseSummary, filters: CatalogFilters) {
  const nameMatches = !filters.q || exercise.name.toLocaleLowerCase("pt-BR").includes(filters.q.toLocaleLowerCase("pt-BR"));
  return nameMatches && (!filters.muscle || exercise.muscle_groups.includes(filters.muscle)) &&
    (!filters.equipment || exercise.equipment === filters.equipment) &&
    (!filters.difficulty || exercise.difficulty === filters.difficulty);
}

export function catalogHref(filters: CatalogFilters, page = 1) {
  const params = new URLSearchParams();
  if (filters.q) params.set("q", filters.q);
  if (filters.muscle) params.set("muscle", filters.muscle);
  if (filters.equipment) params.set("equipment", filters.equipment);
  if (filters.difficulty) params.set("difficulty", filters.difficulty);
  if (filters.preview) params.set("preview", "1");
  if (page > 1) params.set("page", String(page));
  const query = params.toString();
  return `/exercicios${query ? `?${query}` : ""}`;
}

export async function listExercises(filters: CatalogFilters): Promise<{ items: ExerciseSummary[]; total: number; error: boolean }> {
  if (filters.preview) {
    const matched = (demo as ExerciseDetail[]).filter((item) => matches(item, filters));
    return { items: matched.slice((filters.page - 1) * PAGE_SIZE, filters.page * PAGE_SIZE), total: matched.length, error: false };
  }
  const supabase = await createSupabaseServerClient();
  if (!supabase) return { items: [], total: 0, error: false };
  let query = supabase.from("exercises")
    .select("id,name,muscle_groups,equipment,difficulty,media_url,media_alt", { count: "exact" })
    .not("approved_at", "is", null);
  if (filters.q) query = query.ilike("name", `%${filters.q.replace(/[\\%_]/g, "\\$&")}%`);
  if (filters.muscle) query = query.contains("muscle_groups", [filters.muscle]);
  if (filters.equipment) query = query.eq("equipment", filters.equipment);
  if (filters.difficulty) query = query.eq("difficulty", filters.difficulty);
  const { data, count, error } = await query.order("name").range((filters.page - 1) * PAGE_SIZE, filters.page * PAGE_SIZE - 1);
  return { items: (data ?? []) as ExerciseSummary[], total: count ?? 0, error: Boolean(error) };
}

export async function getExercise(id: string, preview: boolean): Promise<{ exercise: ExerciseDetail | null; error: boolean }> {
  if (!uuid.test(id)) return { exercise: null, error: false };
  if (preview && process.env.NODE_ENV === "development") {
    return { exercise: (demo as ExerciseDetail[]).find((item) => item.id === id) ?? null, error: false };
  }
  const supabase = await createSupabaseServerClient();
  if (!supabase) return { exercise: null, error: false };
  const { data, error } = await supabase.from("exercises")
    .select("id,name,alternate_names,muscle_groups,equipment,difficulty,instructions,common_mistakes,precautions,media_url,media_alt")
    .eq("id", id).not("approved_at", "is", null).maybeSingle();
  return { exercise: data as ExerciseDetail | null, error: Boolean(error) };
}

export async function getSubstitutes(id: string, preview: boolean): Promise<ExerciseSummary[]> {
  if (!uuid.test(id)) return [];
  if (preview && process.env.NODE_ENV === "development") {
    const source = demo.find((item) => item.id === id);
    return (demo as ExerciseDetail[]).filter((item) => source?.substitutes.includes(item.id));
  }
  const supabase = await createSupabaseServerClient();
  if (!supabase) return [];
  const { data: edges, error } = await supabase.from("exercise_substitutions")
    .select("substitute_exercise_id").eq("exercise_id", id).not("approved_at", "is", null);
  if (error || !edges?.length) return [];
  const ids = edges.map((edge) => edge.substitute_exercise_id);
  const { data } = await supabase.from("exercises")
    .select("id,name,muscle_groups,equipment,difficulty,media_url,media_alt")
    .in("id", ids).not("approved_at", "is", null).order("name");
  return (data ?? []) as ExerciseSummary[];
}
