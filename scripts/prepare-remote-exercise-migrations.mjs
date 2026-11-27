import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
for (const name of [
  "20261126000100_exercise_catalog_sources",
  "20261126000200_exercise_equipment_backfill",
  "20261126000300_exercise_media_bucket",
]) {
  const version = name.slice(0, 14);
  const migrationName = name.slice(15);
  const body = readFileSync(join(root, "supabase/migrations", `${name}.sql`), "utf8");
  if (body.includes("$migration$")) throw new Error(`Delimitador reservado em ${name}`);
  const sql = `begin;\n${body}\ninsert into supabase_migrations.schema_migrations (version, name, statements)\n` +
    `values ('${version}', '${migrationName}', array[$migration$${body}$migration$])\n` +
    `on conflict (version) do nothing;\ncommit;\n`;
  const target = join(root, "data/generated", `${name}.remote.sql`);
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, sql);
  process.stdout.write(`${name}: ${body.length} caracteres preparados.\n`);
}
