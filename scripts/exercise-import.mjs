import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, isAbsolute, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const options = JSON.parse(readFileSync(join(root, "data/exercise-options.json"), "utf8"));
const allowed = Object.fromEntries(Object.entries(options).map(([key, values]) => [key, new Set(values.map(({ value }) => value))]));
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const fields = ["id", "name", "alternate_names", "muscle_groups", "equipment", "difficulty", "instructions", "common_mistakes", "precautions", "media_url", "media_alt", "substitutes"];

function text(value, min, max, label) {
  if (typeof value !== "string" || value !== value.trim() || value.length < min || value.length > max) {
    throw new Error(`${label}: texto inválido (esperado ${min}–${max} caracteres, sem espaços externos)`);
  }
  return value;
}

function stringArray(value, min, max, itemMax, label) {
  if (!Array.isArray(value) || value.length < min || value.length > max) throw new Error(`${label}: lista inválida`);
  const items = value.map((item, index) => text(item, 1, itemMax, `${label}[${index}]`));
  if (new Set(items.map((item) => item.toLocaleLowerCase("pt-BR"))).size !== items.length) throw new Error(`${label}: valores duplicados`);
  return items;
}

export function validateExercises(input) {
  if (!Array.isArray(input) || input.length < 1 || input.length > 500) throw new Error("Esperada uma lista de 1 a 500 exercícios");
  const ids = new Set();
  const names = new Set();
  const result = input.map((entry, index) => {
    const label = `Exercício ${index + 1}`;
    if (!entry || typeof entry !== "object" || Array.isArray(entry) ||
        Object.keys(entry).some((key) => !fields.includes(key)) || fields.some((key) => !(key in entry))) {
      throw new Error(`${label}: campos ausentes ou não permitidos`);
    }
    if (!uuid.test(entry.id) || ids.has(entry.id)) throw new Error(`${label}: id inválido ou duplicado`);
    ids.add(entry.id);
    const name = text(entry.name, 1, 120, `${label}.name`);
    const normalized = name.toLocaleLowerCase("pt-BR");
    if (names.has(normalized)) throw new Error(`${label}: nome duplicado`);
    names.add(normalized);
    const alternateNames = stringArray(entry.alternate_names, 0, 10, 120, `${label}.alternate_names`);
    const muscleGroups = stringArray(entry.muscle_groups, 1, 4, 30, `${label}.muscle_groups`);
    if (muscleGroups.some((value) => !allowed.muscle_groups.has(value))) throw new Error(`${label}: grupo muscular desconhecido`);
    if (!allowed.equipment.has(entry.equipment) || !allowed.difficulty.has(entry.difficulty)) throw new Error(`${label}: equipamento ou dificuldade desconhecidos`);
    const instructions = text(entry.instructions, 1, 1000, `${label}.instructions`);
    const commonMistakes = stringArray(entry.common_mistakes, 1, 6, 160, `${label}.common_mistakes`);
    const precautions = text(entry.precautions, 1, 500, `${label}.precautions`);
    if (entry.media_url !== null || entry.media_alt !== null) throw new Error(`${label}: mídia exige importação com licença e proveniência`);
    const url = null;
    const alt = null;
    const substitutes = stringArray(entry.substitutes, 0, 20, 36, `${label}.substitutes`);
    if (substitutes.some((id) => !uuid.test(id) || id === entry.id)) throw new Error(`${label}: substituto inválido`);
    return { id: entry.id, name, alternate_names: alternateNames, muscle_groups: muscleGroups,
      equipment: entry.equipment, difficulty: entry.difficulty, instructions, common_mistakes: commonMistakes,
      precautions, media_url: url, media_alt: alt, substitutes };
  });
  for (const entry of result) {
    if (entry.substitutes.some((id) => !ids.has(id))) throw new Error(`${entry.name}: substituto fora do arquivo`);
  }
  return result;
}

const quote = (value) => value === null ? "null" : `'${value.replaceAll("'", "''")}'`;
const sqlArray = (values) => values.length ? `ARRAY[${values.map(quote).join(", ")}]::text[]` : "ARRAY[]::text[]";

export function buildImportSql(entries) {
  const ids = entries.map(({ id }) => quote(id)).join(", ");
  const columns = ["id", "name", "alternate_names", "muscle_groups", "equipment", "difficulty", "instructions", "common_mistakes", "precautions", "media_url", "media_alt"];
  const rows = entries.map((entry) => `  (${[
    quote(entry.id), quote(entry.name), sqlArray(entry.alternate_names), sqlArray(entry.muscle_groups),
    quote(entry.equipment), quote(entry.difficulty), quote(entry.instructions), sqlArray(entry.common_mistakes),
    quote(entry.precautions), quote(entry.media_url), quote(entry.media_alt),
  ].join(", ")})`).join(",\n");
  const updates = columns.slice(1).map((column) => `  ${column} = excluded.${column}`).join(",\n");
  const substitutions = entries.flatMap((entry) => entry.substitutes.map((id) => `  (${quote(entry.id)}, ${quote(id)})`));
  return [
    "begin;",
    "-- Abort rather than modify content that has already been approved.",
    `do $$ begin if exists (select 1 from public.exercises where id in (${ids}) and approved_at is not null) then raise exception 'approved exercise cannot be imported'; end if; end $$;`,
    `insert into public.exercises (${columns.join(", ")}) values\n${rows}\non conflict (id) do update set\n${updates}\nwhere public.exercises.approved_at is null;`,
    substitutions.length ? `insert into public.exercise_substitutions (exercise_id, substitute_exercise_id) values\n${substitutions.join(",\n")}\non conflict do nothing;` : "",
    "commit;",
    "",
  ].filter(Boolean).join("\n");
}

function run() {
  const args = process.argv.slice(2);
  const input = args[0];
  const outIndex = args.indexOf("--out");
  if (!input || args.some((arg, index) => index > 0 && arg !== "--out" && index !== outIndex + 1) ||
      (outIndex !== -1 && !args[outIndex + 1])) {
    throw new Error("Uso: node scripts/exercise-import.mjs <arquivo.json> [--out <arquivo.sql>]");
  }
  const data = validateExercises(JSON.parse(readFileSync(resolve(input), "utf8")));
  if (outIndex !== -1) {
    const target = resolve(args[outIndex + 1]);
    const inside = relative(root, target);
    if (isAbsolute(inside) || inside.startsWith("..") || inside.startsWith(".git")) throw new Error("O SQL deve ser gerado dentro do projeto");
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, buildImportSql(data), { flag: "wx" });
    process.stdout.write(`SQL transacional gerado para ${data.length} rascunhos: ${target}\n`);
  } else {
    process.stdout.write(`${data.length} exercícios e ${data.reduce((sum, item) => sum + item.substitutes.length, 0)} relações válidos; nenhuma gravação realizada.\n`);
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try { run(); } catch (error) { process.stderr.write(`${error instanceof Error ? error.message : "Importação inválida"}\n`); process.exitCode = 1; }
}
