import { getSupabaseConfig } from "@/lib/supabase/config";

export type ExerciseMediaAsset = { src: string; alt: string; kind: "image" | "video"; poster?: string };
type MediaRecord = { kind: "cover" | "video" | "animation"; provider: string; asset_path: string; alt_text: string };
type MediaInput = { media?: MediaRecord[] };

function resolvePath(record: MediaRecord): string | null {
  const path = record.asset_path;
  if (record.provider === "jsdelivr" && /^media\/video\/[a-z0-9-]+\.mp4$/.test(path)) {
    return `https://cdn.jsdelivr.net/gh/namnq/workout-free-videos@v2.0.0/${path}`;
  }
  if (record.provider === "local" && /^\/media\/exercises\/[a-z0-9-]+\.(mp4|webp|png|jpe?g)$/.test(path)) return path;
  if (record.provider === "supabase_storage" && /^exercise-media\/[a-z0-9/_-]+\.(mp4|webp|png|jpe?g)$/.test(path)) {
    const config = getSupabaseConfig();
    return config ? `${config.url}/storage/v1/object/public/${path}` : null;
  }
  return null;
}

export function resolveExerciseMedia(exercise: MediaInput): ExerciseMediaAsset | null {
  const assets = (exercise.media ?? []).filter((record) => record.alt_text.trim())
    .map((record) => ({ record, src: resolvePath(record) })).filter((item) => item.src);
  const video = assets.find((item) => item.record.kind === "video");
  const cover = assets.find((item) => item.record.kind === "cover");
  const animation = assets.find((item) => item.record.kind === "animation");
  if (video) return { src: video.src!, alt: video.record.alt_text, kind: "video", poster: cover?.src ?? undefined };
  const image = cover ?? animation;
  return image ? { src: image.src!, alt: image.record.alt_text, kind: "image" } : null;
}
