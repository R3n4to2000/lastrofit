import { getSupabaseConfig } from "@/lib/supabase/config";

export type ExerciseMediaAsset = { src: string; alt: string; kind: "image" | "video" };
type MediaInput = { media_url: string | null; media_alt: string | null };
type MediaProvider = { supports: (value: string) => boolean; resolve: (value: string) => string | null };

const localProvider: MediaProvider = {
  supports: (value) => value.startsWith("/media/exercises/"),
  resolve: (value) => /^\/media\/exercises\/[a-z0-9-]+\.svg$/.test(value) ? value : null,
};

const storageProvider: MediaProvider = {
  supports: (value) => value.startsWith("storage:"),
  resolve: (value) => {
    const config = getSupabaseConfig();
    const key = value.slice("storage:".length);
    if (!config || !/^exercise-media\/[a-z0-9/_-]+\.(webp|png|jpg|mp4)$/.test(key)) return null;
    return `${config.url}/storage/v1/object/public/${key}`;
  },
};

const providers = [localProvider, storageProvider];

export function resolveExerciseMedia(exercise: MediaInput): ExerciseMediaAsset | null {
  if (!exercise.media_url || !exercise.media_alt?.trim()) return null;
  const provider = providers.find((candidate) => candidate.supports(exercise.media_url!));
  const src = provider?.resolve(exercise.media_url);
  return src ? { src, alt: exercise.media_alt, kind: src.endsWith(".mp4") ? "video" : "image" } : null;
}
