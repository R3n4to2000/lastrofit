import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { prepareImport } from "./import-free-exercise-db.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const read = (name) => JSON.parse(readFileSync(join(root, name), "utf8"));
const prepared = prepareImport(read("data/upstream/free-exercise-db.json"), read("data/upstream/workout-free-videos.json"), read("data/exercise-translations.pt-BR.json"));
const base = "https://cdn.jsdelivr.net/gh/namnq/workout-free-videos@v2.0.0/";
const save = process.argv.includes("--save");
if (process.argv.slice(2).some((arg) => arg !== "--save")) throw new Error("Uso: node scripts/verify-exercise-videos.mjs [--save]");
const results = [];
let cursor = 0;

async function worker() {
  while (cursor < prepared.media.length) {
    const item = prepared.media[cursor++];
    try {
      const response = await fetch(base + item.asset_path, { signal: AbortSignal.timeout(30000) });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const bytes = Buffer.from(await response.arrayBuffer());
      const actualHash = createHash("sha256").update(bytes).digest("hex");
      const verified = bytes.length === item.bytes && actualHash === item.sha256;
      if (verified && save) {
        const destination = join(root, "data/generated/media", `${item.source_media_id}.mp4`);
        mkdirSync(dirname(destination), { recursive: true });
        writeFileSync(destination, bytes);
      }
      results.push({ source_media_id: item.source_media_id, status: verified ? "verified" : "mismatch", bytes: bytes.length });
    } catch (error) {
      results.push({ source_media_id: item.source_media_id, status: "unavailable", reason: error instanceof Error ? error.message : "request failed" });
    }
  }
}

await Promise.all(Array.from({ length: 4 }, worker));
results.sort((a, b) => a.source_media_id.localeCompare(b.source_media_id));
const target = join(root, "data/generated/video-integrity-report.json");
mkdirSync(dirname(target), { recursive: true });
writeFileSync(target, JSON.stringify({ checked: results.length, verified: results.filter((item) => item.status === "verified").length, results }, null, 2) + "\n");
process.stdout.write(`${results.filter((item) => item.status === "verified").length}/${results.length} vídeos candidatos com bytes e SHA-256 confirmados.\n`);
if (results.some((item) => item.status !== "verified")) process.exitCode = 1;
