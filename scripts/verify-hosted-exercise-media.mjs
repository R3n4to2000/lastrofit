import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { prepareImport } from "./import-free-exercise-db.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const read = (path) => JSON.parse(readFileSync(join(root, path), "utf8"));
const base = process.argv[2];
if (!base || !/^https:\/\/[a-z0-9-]+\.supabase\.co$/.test(base) || process.argv.length !== 3) {
  throw new Error("Uso: node scripts/verify-hosted-exercise-media.mjs https://<projeto>.supabase.co");
}
const prepared = prepareImport(
  read("data/upstream/free-exercise-db.json"),
  read("data/upstream/workout-free-videos.json"),
  read("data/exercise-translations.pt-BR.json"),
);
let verified = 0;
for (const media of prepared.media) {
  const response = await fetch(`${base}/storage/v1/object/public/exercise-media/media/${media.source_media_id}.mp4`, {
    signal: AbortSignal.timeout(30000),
  });
  if (!response.ok) throw new Error(`${media.source_media_id}: HTTP ${response.status}`);
  const bytes = Buffer.from(await response.arrayBuffer());
  const sha256 = createHash("sha256").update(bytes).digest("hex");
  if (bytes.length !== media.bytes || sha256 !== media.sha256) {
    throw new Error(`${media.source_media_id}: tamanho ou SHA-256 divergente`);
  }
  verified++;
}
process.stdout.write(`${verified}/${prepared.media.length} vídeos no Storage com bytes e SHA-256 confirmados.\n`);
