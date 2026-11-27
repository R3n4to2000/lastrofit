import "server-only";
import previewData from "../../../data/generated/exercise-preview.json";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { categoryOptions, difficultyOptions, equipmentOptions, muscleGroups, validOption } from "./options";

export const PAGE_SIZE = 12;
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export type ExerciseSummary = {
  id: string; name: string; muscle_groups: string[]; equipment: string | null;
  difficulty: string; media_url: string | null; media_alt: string | null;
  category: string | null; media: ExerciseMediaRecord[];
};
export type ExerciseMediaRecord = { kind: "cover" | "video" | "animation"; provider: string; asset_path: string; alt_text: string };
export type ExerciseDetail = ExerciseSummary & {
  alternate_names: string[]; instructions: string; common_mistakes: string[]; precautions: string | null;
  primary_muscle: string | null; secondary_muscles: string[]; equipment_list: string[];
};
export type CatalogFilters = { q: string; muscle: string | null; equipment: string | null; difficulty: string | null; category: string | null; page: number; preview: boolean };
type RawFilters = Record<string, string | string[] | undefined>;

export function parseCatalogFilters(raw: RawFilters): CatalogFilters {
  const one = (value: string | string[] | undefined) => typeof value === "string" ? value : "";
  const page = Number(one(raw.page));
  return {
    q: one(raw.q).trim().slice(0, 80),
    muscle: validOption(muscleGroups, raw.muscle),
    equipment: validOption(equipmentOptions, raw.equipment),
    difficulty: validOption(difficultyOptions, raw.difficulty),
    category: validOption(categoryOptions, raw.category),
    page: Number.isSafeInteger(page) && page > 0 && page <= 1000 ? page : 1,
    preview: process.env.NODE_ENV === "development" && one(raw.preview) === "1",
  };
}

function matches(exercise: ExerciseDetail, filters: CatalogFilters) {
  const nameMatches = !filters.q || [exercise.name, ...exercise.alternate_names].some((name) => name.toLocaleLowerCase("pt-BR").includes(filters.q.toLocaleLowerCase("pt-BR")));
  return nameMatches && (!filters.muscle || exercise.muscle_groups.includes(filters.muscle)) &&
    (!filters.equipment || exercise.equipment_list.includes(filters.equipment)) &&
    (!filters.difficulty || exercise.difficulty === filters.difficulty) &&
    (!filters.category || exercise.category === filters.category);
}

export function catalogHref(filters: CatalogFilters, page = 1) {
  const params = new URLSearchParams();
  if (filters.q) params.set("q", filters.q);
  if (filters.muscle) params.set("muscle", filters.muscle);
  if (filters.equipment) params.set("equipment", filters.equipment);
  if (filters.difficulty) params.set("difficulty", filters.difficulty);
  if (filters.category) params.set("category", filters.category);
  if (filters.preview) params.set("preview", "1");
  if (page > 1) params.set("page", String(page));
  const query = params.toString();
  return `/exercicios${query ? `?${query}` : ""}`;
}

export async function listExercises(filters: CatalogFilters): Promise<{ items: ExerciseSummary[]; total: number; error: boolean }> {
  if (filters.preview) {
    const matched = (previewData as ExerciseDetail[]).filter((item) => matches(item, filters));
    return { items: matched.slice((filters.page - 1) * PAGE_SIZE, filters.page * PAGE_SIZE), total: matched.length, error: false };
  }
  const supabase = await createSupabaseServerClient();
  if (!supabase) return { items: [], total: 0, error: false };
  const runQuery = (legacy: boolean) => {
    const columns: string = legacy ? "id,name,muscle_groups,equipment,difficulty,media_url,media_alt,alternate_names" :
      "id,name,muscle_groups,equipment,difficulty,media_url,media_alt,alternate_names,category";
    let query = supabase.from("exercises")
      .select(columns, { count: "exact" })
      .not("approved_at", "is", null);
    if (filters.q) query = query.ilike(legacy ? "name" : "search_text", `%${filters.q.replace(/[\\%_]/g, "\\$&")}%`);
    if (filters.muscle) query = query.contains("muscle_groups", [filters.muscle]);
    if (filters.equipment) query = legacy ? query.eq("equipment", filters.equipment) : query.contains("equipment_list", [filters.equipment]);
    if (filters.difficulty) query = query.eq("difficulty", filters.difficulty);
    if (filters.category && !legacy) query = query.eq("category", filters.category);
    return query.order("name").range((filters.page - 1) * PAGE_SIZE, filters.page * PAGE_SIZE - 1);
  };
  let result = await runQuery(false);
  if (result.error?.code === "42703" || result.error?.code === "PGRST204") result = await runQuery(true);
  if (result.error) return { items: [], total: 0, error: true };
  if (filters.category && result.data?.some((item) => !("category" in item))) return { items: [], total: 0, error: false };
  return { items: await attachMedia(supabase, (result.data ?? []) as unknown as ExerciseSummary[]), total: result.count ?? 0, error: false };
}

async function attachMedia(supabase: NonNullable<Awaited<ReturnType<typeof createSupabaseServerClient>>>, items: ExerciseSummary[]) {
  if (!items.length) return items;
  const { data } = await supabase.from("exercise_media")
    .select("exercise_id,kind,provider,asset_path,alt_text")
    .in("exercise_id", items.map((item) => item.id)).eq("validation_status", "approved");
  return items.map((item) => ({ ...item, category: item.category ?? null,
    media: (data ?? []).filter((asset) => asset.exercise_id === item.id) as ExerciseMediaRecord[] }));
}

export async function getExercise(id: string, preview: boolean): Promise<{ exercise: ExerciseDetail | null; error: boolean }> {
  if (!uuid.test(id)) return { exercise: null, error: false };
  if (preview && process.env.NODE_ENV === "development") {
    return { exercise: (previewData as ExerciseDetail[]).find((item) => item.id === id) ?? null, error: false };
  }
  const supabase = await createSupabaseServerClient();
  if (!supabase) return { exercise: null, error: false };
  const runQuery = (legacy: boolean) => {
    const columns: string = legacy ? "id,name,alternate_names,muscle_groups,equipment,difficulty,instructions,common_mistakes,precautions,media_url,media_alt" :
      "id,name,alternate_names,muscle_groups,equipment,difficulty,instructions,common_mistakes,precautions,media_url,media_alt,category,primary_muscle,secondary_muscles,equipment_list";
    return supabase.from("exercises").select(columns)
    .eq("id", id).not("approved_at", "is", null).maybeSingle();
  };
  let result = await runQuery(false);
  if (result.error?.code === "42703" || result.error?.code === "PGRST204") result = await runQuery(true);
  if (!result.data) return { exercise: null, error: Boolean(result.error) };
  const exercise = result.data as unknown as ExerciseDetail;
  return { exercise: { ...exercise, category: exercise.category ?? null,
    primary_muscle: exercise.primary_muscle ?? exercise.muscle_groups[0] ?? null,
    secondary_muscles: exercise.secondary_muscles ?? exercise.muscle_groups.slice(1),
    equipment_list: exercise.equipment_list?.length ? exercise.equipment_list : exercise.equipment ? [exercise.equipment] : [],
    media: (await attachMedia(supabase, [exercise]))[0].media }, error: false };
}

export async function getSubstitutes(id: string, preview: boolean): Promise<ExerciseSummary[]> {
  if (!uuid.test(id)) return [];
  if (preview && process.env.NODE_ENV === "development") return [];
  const supabase = await createSupabaseServerClient();
  if (!supabase) return [];
  const { data: edges, error } = await supabase.from("exercise_substitutions")
    .select("substitute_exercise_id").eq("exercise_id", id).not("approved_at", "is", null);
  if (error || !edges?.length) return [];
  const ids = edges.map((edge) => edge.substitute_exercise_id);
  const { data } = await supabase.from("exercises")
    .select("id,name,muscle_groups,equipment,difficulty,media_url,media_alt")
    .in("id", ids).not("approved_at", "is", null).order("name");
  return attachMedia(supabase, (data ?? []) as ExerciseSummary[]);
}
