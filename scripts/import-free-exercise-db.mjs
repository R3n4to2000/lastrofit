import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const sourceFile = join(root, "data/upstream/free-exercise-db.json");
const videoFile = join(root, "data/upstream/workout-free-videos.json");
const translationFile = join(root, "data/exercise-translations.pt-BR.json");
const sourceName = "free-exercise-db";
const videoSource = "workout-free-videos@v2.0.0";

const muscles = {
  abdominals: "core", abductors: "abductors", adductors: "adductors",
  biceps: "biceps", calves: "calves", chest: "chest", forearms: "forearms",
  glutes: "glutes", hamstrings: "hamstrings", lats: "back",
  "lower back": "lower_back", "middle back": "back", neck: "neck",
  quadriceps: "quadriceps", shoulders: "shoulders", traps: "traps", triceps: "triceps",
};
const videoMuscles = {
  abs: "core", biceps: "biceps", calves: "calves", chest: "chest",
  forearms: "forearms", glutes: "glutes", hamstrings: "hamstrings",
  lats: "back", lowerBack: "lower_back", quads: "quadriceps",
  shoulders: "shoulders", traps: "traps", triceps: "triceps",
};
const equipment = {
  bands: "band", barbell: "barbell", "body only": "bodyweight", cable: "cable",
  dumbbell: "dumbbell", "e-z curl bar": "ez_bar", "exercise ball": "exercise_ball",
  "foam roll": "foam_roller", kettlebells: "kettlebell", machine: "machine",
  "medicine ball": "medicine_ball", other: "other", null: "other",
};
const videoEquipment = {
  barbell: "barbell", bench: "bench", bodyweight: "bodyweight", cable: "cable", dumbbell: "dumbbell",
  ezBar: "ez_bar", machine: "machine", plate: "plate", ball: "exercise_ball",
};
const categories = new Set(["cardio", "olympic weightlifting", "plyometrics", "powerlifting", "strength", "stretching", "strongman"]);
const levels = new Set(["beginner", "intermediate", "expert"]);
const clean = (value) => typeof value === "string" ? value.trim() : "";
const sameName = (value) => clean(value).toLocaleLowerCase("en").normalize("NFKD").replace(/[^a-z0-9]/g, "");
const nameTokens = (value) => new Set(clean(value).toLocaleLowerCase("en").split(/[^a-z0-9]+/).filter((token) => token.length > 2 && !["the", "and", "with", "from"].includes(token)));

export function findEquivalenceCandidates(entries) {
  const candidates = [];
  for (let i = 0; i < entries.length; i++) {
    for (let j = i + 1; j < entries.length; j++) {
      const left = entries[i], right = entries[j];
      if (left.equipment !== right.equipment || left.primary_muscle !== right.primary_muscle || left.category !== right.category) continue;
      const a = nameTokens(left.original_name), b = nameTokens(right.original_name);
      const shared = [...a].filter((token) => b.has(token)).length;
      const score = shared / new Set([...a, ...b]).size;
      if (shared >= 2 && score >= 0.7) candidates.push({ source_ids: [left.source_exercise_id, right.source_exercise_id], score: Number(score.toFixed(2)) });
    }
  }
  return candidates;
}

export function sourceUuid(id) {
  const hex = createHash("sha256").update(`${sourceName}:${id}`).digest("hex").slice(0, 32).split("");
  hex[12] = "5";
  hex[16] = ((Number.parseInt(hex[16], 16) & 3) | 8).toString(16);
  return `${hex.slice(0, 8).join("")}-${hex.slice(8, 12).join("")}-${hex.slice(12, 16).join("")}-${hex.slice(16, 20).join("")}-${hex.slice(20).join("")}`;
}

export function normalizeSourceEntry(entry, translations = {}) {
  if (!entry || typeof entry !== "object" || !clean(entry.id) || !clean(entry.name) || entry.name.length > 120 ||
      !levels.has(entry.level) || !categories.has(entry.category) || !(String(entry.equipment) in equipment) ||
      !Array.isArray(entry.primaryMuscles) || entry.primaryMuscles.length === 0 ||
      !Array.isArray(entry.secondaryMuscles) || !Array.isArray(entry.instructions) ||
      entry.instructions.some((line) => typeof line !== "string") ||
      [...entry.primaryMuscles, ...entry.secondaryMuscles].some((muscle) => !(muscle in muscles))) {
    throw new Error("metadados obrigatórios ou taxonomia inválidos");
  }
  const translation = translations[entry.id];
  if (translation && (!clean(translation.name) || translation.name.length > 120 || !clean(translation.instructions))) {
    throw new Error("tradução pt-BR inválida");
  }
  const primary = muscles[entry.primaryMuscles[0]];
  const secondary = [...new Set(entry.secondaryMuscles.map((muscle) => muscles[muscle]))].filter((muscle) => muscle !== primary);
  return {
    id: sourceUuid(entry.id), source_name: sourceName, source_exercise_id: entry.id,
    original_name: entry.name, name: translation?.name ?? entry.name,
    alternate_names: translation ? [entry.name] : [],
    muscle_groups: [...new Set([...entry.primaryMuscles, ...entry.secondaryMuscles].map((muscle) => muscles[muscle]))],
    primary_muscle: primary, secondary_muscles: secondary,
    equipment: equipment[String(entry.equipment)], equipment_list: [equipment[String(entry.equipment)]],
    difficulty: entry.level === "expert" ? "advanced" : entry.level, category: entry.category,
    source_instructions: entry.instructions.filter(clean), instructions: translation?.instructions ?? "",
    translation_status: translation ? "translated" : "pending",
  };
}

export function matchVideo(entry, videos) {
  return videos.filter((video) => {
    if (sameName(video.name) !== sameName(entry.original_name) ||
        videoMuscles[video.primaryMuscle] !== entry.primary_muscle ||
        !Array.isArray(video.equipment) ||
        !video.equipment.some((item) => videoEquipment[item] === entry.equipment)) return false;
    return typeof video.slug === "string" && /^[a-z0-9-]+$/.test(video.slug) &&
      video.video?.path === `media/video/${video.slug}.mp4` &&
      Number.isSafeInteger(video.video.bytes) && video.video.bytes > 0 &&
      /^[a-f0-9]{64}$/i.test(video.video.sha256);
  });
}

export function prepareImport(source, videos, translations) {
  if (!Array.isArray(source) || !Array.isArray(videos) || !translations || typeof translations !== "object") {
    throw new Error("Arquivos de origem inválidos");
  }
  const entries = [];
  const rejected = [];
  const seenIds = new Set();
  for (const row of source) {
    try {
      const entry = normalizeSourceEntry(row, translations);
      if (seenIds.has(entry.source_exercise_id)) throw new Error("id de origem duplicado");
      seenIds.add(entry.source_exercise_id);
      entries.push(entry);
    } catch (error) {
      rejected.push({ source_id: clean(row?.id) || null, reason: error.message });
    }
  }
  const candidateEquivalences = findEquivalenceCandidates(entries);
  const media = [];
  const ambiguousVideos = [];
  for (const video of videos) {
    const matches = entries.filter((entry) => matchVideo(entry, [video]).length === 1);
    if (matches.length !== 1 || media.some((item) => item.source_media_id === video.slug)) {
      ambiguousVideos.push({ slug: clean(video.slug), matching_source_ids: matches.map((entry) => entry.source_exercise_id) });
      continue;
    }
    matches[0].equipment_list = [...new Set([...matches[0].equipment_list,
      ...video.equipment.map((item) => videoEquipment[item]).filter(Boolean)])];
    media.push({
      exercise_id: matches[0].id, kind: "video", provider: "jsdelivr",
      asset_path: video.video.path, source_name: videoSource, source_media_id: video.slug,
      source_url: `https://github.com/namnq/workout-free-videos/blob/v2.0.0/${video.video.path}`,
      author: "namnq / workout-free-videos", license: "CC0-1.0", attribution: null,
      alt_text: `Demonstração em vídeo: ${matches[0].name}`,
      bytes: video.video.bytes, sha256: video.video.sha256,
    });
  }
  return { entries, media, report: {
    source_records: source.length, accepted_drafts: entries.length, rejected,
    translated_pending_review: entries.filter((entry) => entry.translation_status === "translated").length,
    pending_translation: entries.filter((entry) => entry.translation_status === "pending").length,
    video_records: videos.length, video_candidates: media.length, ambiguous_videos: ambiguousVideos,
    candidate_equivalences: candidateEquivalences, approved: 0, photos: 0,
    without_media_candidate: entries.length - media.length,
    without_approved_media: entries.length,
    video_bytes_if_mirrored: media.reduce((sum, item) => sum + item.bytes, 0),
  } };
}

const quote = (value) => value == null ? "null" : `'${String(value).replaceAll("'", "''")}'`;
const textArray = (items) => `ARRAY[${items.map(quote).join(",")}]::text[]`;

export function buildDraftSql({ entries, media }) {
  const columns = ["id", "source_name", "source_exercise_id", "original_name", "name", "alternate_names",
    "muscle_groups", "primary_muscle", "secondary_muscles", "equipment", "equipment_list",
    "difficulty", "category", "source_instructions", "instructions", "translation_status"];
  const arrays = new Set(["alternate_names", "muscle_groups", "secondary_muscles", "equipment_list", "source_instructions"]);
  const rows = entries.map((entry) => `(${columns.map((column) => arrays.has(column) ? textArray(entry[column]) : quote(entry[column])).join(",")})`);
  const mediaColumns = ["exercise_id", "kind", "provider", "asset_path", "source_name", "source_media_id", "source_url", "author", "license", "attribution", "alt_text"];
  const mediaRows = media.map((item) => `(${mediaColumns.map((column) => quote(item[column])).join(",")})`);
  return [
    "begin;",
    "-- Drafts only. Existing rows, administrative edits and approval are preserved.",
    `insert into public.exercises (${columns.join(",")}) values\n${rows.join(",\n")}\non conflict do nothing;`,
    mediaRows.length ? `insert into public.exercise_media (${mediaColumns.join(",")}) values\n${mediaRows.join(",\n")}\non conflict do nothing;` : "",
    "commit;", "",
  ].filter(Boolean).join("\n");
}

export function previewEntries({ entries, media }) {
  return entries.filter((entry) => entry.translation_status === "translated" && media.some((item) => item.exercise_id === entry.id))
    .map((entry) => ({ ...entry, common_mistakes: [], precautions: null, media_url: null, media_alt: null,
      media: media.filter((item) => item.exercise_id === entry.id).map(({ kind, provider, asset_path, alt_text }) => ({ kind, provider, asset_path, alt_text })),
      substitutes: [], }));
}

function run() {
  const input = JSON.parse(readFileSync(sourceFile, "utf8"));
  const videos = JSON.parse(readFileSync(videoFile, "utf8"));
  const translations = JSON.parse(readFileSync(translationFile, "utf8"));
  const prepared = prepareImport(input, videos, translations);
  const sqlFile = join(root, "supabase/seed/20261126_free_exercise_db_drafts.sql");
  const reportFile = join(root, "data/generated/exercise-import-report.json");
  const previewFile = join(root, "data/generated/exercise-preview.json");
  for (const file of [sqlFile, reportFile, previewFile]) mkdirSync(dirname(file), { recursive: true });
  writeFileSync(sqlFile, buildDraftSql(prepared));
  writeFileSync(reportFile, JSON.stringify(prepared.report, null, 2) + "\n");
  writeFileSync(previewFile, JSON.stringify(previewEntries(prepared), null, 2) + "\n");
  process.stdout.write(`Rascunhos: ${prepared.entries.length}; rejeitados: ${prepared.report.rejected.length}; vídeos candidatos: ${prepared.media.length}; aprovados: 0. Nenhuma conexão ao banco foi feita.\n`);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) run();
