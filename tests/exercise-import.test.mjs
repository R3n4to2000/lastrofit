import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { validateExercises, buildImportSql } from "../scripts/exercise-import.mjs";

const fixture = () => JSON.parse(readFileSync(new URL("../data/demo-exercises.json", import.meta.url), "utf8"));

test("valida o catálogo de demonstração e gera SQL transacional de rascunhos", () => {
  const entries = validateExercises(fixture());
  const sql = buildImportSql(entries);
  assert.equal(entries.length, 4);
  assert.match(sql, /^begin;/);
  assert.match(sql, /approved exercise cannot be imported/);
  assert.match(sql, /insert into public\.exercise_substitutions/);
  assert.match(sql, /commit;$/);
  assert.doesNotMatch(sql, /approved_at\s*\)/);
});

test("não aceita aprovação no arquivo de importação", () => {
  const entries = fixture();
  entries[0].approved_at = new Date().toISOString();
  assert.throws(() => validateExercises(entries), /campos ausentes ou não permitidos/);
});

test("rejeita mídia sem proveniência e licença", () => {
  const entries = fixture();
  entries[0].media_url = "/media/exercises/../secret.svg";
  assert.throws(() => validateExercises(entries), /mídia exige importação com licença/);
});

test("rejeita substituto que não pertence ao lote", () => {
  const entries = fixture();
  entries[0].substitutes = ["71000000-0000-4000-8000-000000000099"];
  assert.throws(() => validateExercises(entries), /substituto fora do arquivo/);
});

test("rejeita id duplicado e preserva apóstrofos como dados", () => {
  const entries = fixture();
  entries[1].id = entries[0].id;
  assert.throws(() => validateExercises(entries), /id inválido ou duplicado/);
  const safe = fixture();
  safe[0].name = "Movimento d'água";
  assert.match(buildImportSql(validateExercises(safe)), /Movimento d''água/);
});
