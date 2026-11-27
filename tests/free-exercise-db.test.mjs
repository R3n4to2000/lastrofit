import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { buildDraftSql, matchVideo, normalizeSourceEntry, prepareImport, previewEntries, sourceUuid } from "../scripts/import-free-exercise-db.mjs";

const source = JSON.parse(readFileSync(new URL("../data/upstream/free-exercise-db.json", import.meta.url), "utf8"));
const videos = JSON.parse(readFileSync(new URL("../data/upstream/workout-free-videos.json", import.meta.url), "utf8"));
const translations = JSON.parse(readFileSync(new URL("../data/exercise-translations.pt-BR.json", import.meta.url), "utf8"));

test("importa 876 IDs distintos como rascunhos, preservando origem e texto original", () => {
  const result = prepareImport(source, videos, translations);
  assert.equal(result.entries.length, 876);
  assert.equal(result.report.rejected.length, 0);
  assert.equal(new Set(result.entries.map((item) => item.id)).size, 876);
  assert.equal(result.report.candidate_equivalences.length, 55);
  assert.ok(result.report.candidate_equivalences.some((item) => item.source_ids.includes("Alternate_Incline_Dumbbell_Curl") && item.source_ids.includes("Incline_Dumbbell_Curl")));
  assert.equal(result.entries.filter((item) => item.translation_status === "pending").length, 862);
  assert.equal(result.entries.filter((item) => item.translation_status === "translated").length, 14);
  assert.ok(result.entries.every((item) => item.source_name === "free-exercise-db" && item.original_name && item.source_exercise_id));
  assert.equal(sourceUuid("Leg_Press"), sourceUuid("Leg_Press"));
  assert.notEqual(sourceUuid("Leg_Press"), sourceUuid("Leg_Press_2"));
});

test("normaliza taxonomia sem agrupar movimentos por semelhança vaga", () => {
  const legPress = normalizeSourceEntry(source.find((item) => item.id === "Leg_Press"), translations);
  assert.equal(legPress.name, "Leg press");
  assert.equal(legPress.primary_muscle, "quadriceps");
  assert.equal(legPress.equipment, "machine");
  assert.equal(legPress.category, "strength");
  assert.deepEqual(legPress.alternate_names, ["Leg Press"]);
  assert.equal(normalizeSourceEntry(source.find((item) => item.id === "Push_Press"), translations).difficulty, "advanced");
});

test("rejeita ID duplicado e taxonomia desconhecida no relatório", () => {
  const duplicate = structuredClone(source[0]);
  const invalid = { ...structuredClone(source[1]), equipment: "unknown" };
  const result = prepareImport([source[0], duplicate, invalid], [], {});
  assert.equal(result.entries.length, 1);
  assert.equal(result.report.rejected.length, 2);
  assert.match(result.report.rejected[0].reason, /duplicado/);
});

test("associa somente 14 vídeos com nome, músculo, equipamento e integridade do arquivo compatíveis", () => {
  const result = prepareImport(source, videos, translations);
  assert.equal(result.media.length, 14);
  assert.equal(result.report.ambiguous_videos.length, 43);
  assert.ok(result.media.every((item) => item.license === "CC0-1.0" && item.provider === "jsdelivr" && /^[a-f0-9]{64}$/.test(item.sha256)));
  assert.deepEqual(result.entries.find((item) => item.source_exercise_id === "Dumbbell_Bench_Press").equipment_list, ["dumbbell", "bench"]);
  const goodMorning = normalizeSourceEntry(source.find((item) => item.id === "Good_Morning"), translations);
  assert.deepEqual(matchVideo(goodMorning, videos), []);
  const preview = previewEntries(result);
  assert.equal(preview.length, 14);
  assert.ok(preview.every((item) => item.media.length === 1 && item.media[0].kind === "video"));
});

test("SQL é idempotente, preserva edições existentes e nunca publica rascunhos", () => {
  const sql = buildDraftSql(prepareImport(source.slice(0, 2), [], {}));
  assert.match(sql, /^begin;/);
  assert.match(sql, /on conflict do nothing/);
  assert.doesNotMatch(sql, /on conflict.*do update/i);
  assert.doesNotMatch(sql, /approved_at/);
  assert.match(sql, /commit;$/);
});
