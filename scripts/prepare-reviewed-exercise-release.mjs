import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { prepareImport } from "./import-free-exercise-db.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const read = (path) => JSON.parse(readFileSync(join(root, path), "utf8"));
const quote = (value) => `'${String(value).replaceAll("'", "''")}'`;
const prepared = prepareImport(
  read("data/upstream/free-exercise-db.json"),
  read("data/upstream/workout-free-videos.json"),
  read("data/exercise-translations.pt-BR.json"),
);
const report = read("data/generated/video-integrity-report.json");
const translated = prepared.entries.filter((entry) => entry.translation_status === "translated");
const verified = new Set(report.results.filter((item) => item.status === "verified").map((item) => item.source_media_id));
if (translated.length !== 14 || prepared.media.length !== 14 || verified.size !== 14) {
  throw new Error("A liberação exige exatamente 14 traduções, 14 mídias e 14 hashes verificados.");
}

const rows = translated.map((entry) => {
  const media = prepared.media.find((item) => item.exercise_id === entry.id);
  if (!media || !verified.has(media.source_media_id)) throw new Error(`Vídeo ausente: ${entry.source_exercise_id}`);
  const bytes = readFileSync(join(root, "data/generated/media", `${media.source_media_id}.mp4`));
  if (bytes.length !== media.bytes || createHash("sha256").update(bytes).digest("hex") !== media.sha256) {
    throw new Error(`Integridade do vídeo divergente: ${media.source_media_id}`);
  }
  return [entry.source_exercise_id, entry.id, entry.name, entry.instructions,
    media.source_media_id, media.source_url, media.alt_text];
});

const values = rows.map((row) => `  (${row.map(quote).join(", ")})`).join(",\n");
const sql = `-- Execute apenas após importar os rascunhos e verificar os 14 arquivos no Storage hospedado.
-- A autorização de publicação foi dada pelo responsável em 2026-11-26.
begin;
create temporary table exercise_release (
  source_id text primary key, exercise_id uuid not null unique,
  name text not null, instructions text not null, video_slug text not null unique,
  source_url text not null, alt_text text not null
) on commit drop;
insert into exercise_release values
${values};

do $$
begin
  if (select count(*) from exercise_release) <> 14 then
    raise exception 'release count mismatch';
  end if;
  if (select count(*) from public.exercises e join exercise_release r
      on e.id = r.exercise_id and e.source_name = 'free-exercise-db'
      and e.source_exercise_id = r.source_id and e.name = r.name
      and e.instructions = r.instructions
      where e.translation_status in ('translated', 'reviewed')) <> 14 then
    raise exception 'reviewed exercise data mismatch';
  end if;
  if (select count(*) from public.exercise_media m join exercise_release r
      on m.exercise_id = r.exercise_id and m.source_name = 'workout-free-videos@v2.0.0'
      and m.source_media_id = r.video_slug and m.source_url = r.source_url
      and m.alt_text = r.alt_text and m.kind = 'video' and m.license = 'CC0-1.0'
      and (m.provider = 'jsdelivr' and m.asset_path = 'media/video/' || r.video_slug || '.mp4'
        or m.provider = 'supabase_storage' and m.asset_path = 'exercise-media/media/' || r.video_slug || '.mp4')) <> 14 then
    raise exception 'reviewed media data mismatch';
  end if;
  if not exists (select 1 from storage.buckets where id = 'exercise-media' and public) then
    raise exception 'public exercise-media bucket missing';
  end if;
  if (select count(*) from storage.objects o join exercise_release r
      on o.bucket_id = 'exercise-media' and o.name = 'media/' || r.video_slug || '.mp4') <> 14 then
    raise exception 'one or more approved videos are missing from Storage';
  end if;
end;
$$;

update public.exercises e
set translation_status = 'reviewed', approved_at = coalesce(e.approved_at, now()), updated_at = now()
from exercise_release r where e.id = r.exercise_id;

update public.exercise_media m
set provider = 'supabase_storage', asset_path = 'exercise-media/media/' || r.video_slug || '.mp4',
    validation_status = 'approved', approved_at = coalesce(m.approved_at, now()), updated_at = now()
from exercise_release r where m.exercise_id = r.exercise_id
  and m.source_name = 'workout-free-videos@v2.0.0' and m.source_media_id = r.video_slug;

do $$
begin
  if (select count(*) from public.exercises e join exercise_release r on e.id = r.exercise_id
      where e.approved_at is not null and e.translation_status = 'reviewed') <> 14
    or (select count(*) from public.exercise_media m join exercise_release r on m.exercise_id = r.exercise_id
      where m.validation_status = 'approved' and m.approved_at is not null
        and m.provider = 'supabase_storage') <> 14 then
    raise exception 'release approval count mismatch';
  end if;
end;
$$;
commit;
`;
const target = join(root, "supabase/seed/20261126_publish_reviewed_exercises.sql");
writeFileSync(target, sql);
process.stdout.write(`Release SQL preparado para ${rows.length} exercícios com vídeos íntegros.\n`);
