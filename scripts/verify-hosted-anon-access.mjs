import { readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const local = readFileSync(join(root, ".env.local"), "utf8");
const env = Object.fromEntries(local.split(/\r?\n/).filter((line) => /^[A-Za-z_][A-Za-z0-9_]*=/.test(line))
  .map((line) => { const index = line.indexOf("="); return [line.slice(0, index), line.slice(index + 1).replace(/^['"]|['"]$/g, "")]; }));
const url = env.SUPABASE_URL;
const key = env.SUPABASE_PUBLISHABLE_KEY;
if (!url || !/^https:\/\/[a-z0-9-]+\.supabase\.co\/?$/.test(url) || !key) {
  throw new Error("SUPABASE_URL ou SUPABASE_PUBLISHABLE_KEY inválidos em .env.local");
}
for (const table of ["exercises", "exercise_media"]) {
  const response = await fetch(`${url.replace(/\/$/, "")}/rest/v1/${table}?select=id&limit=1`, {
    headers: { apikey: key, Authorization: `Bearer ${key}` },
    signal: AbortSignal.timeout(15000),
  });
  if (![401, 403].includes(response.status)) {
    throw new Error(`Acesso anônimo a ${table} retornou HTTP ${response.status}; esperado 401/403`);
  }
  process.stdout.write(`${table}: acesso anônimo negado (HTTP ${response.status}).\n`);
}
