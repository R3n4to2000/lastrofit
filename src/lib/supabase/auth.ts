import "server-only";
import { cache } from "react";
import { createSupabaseServerClient } from "./server";

export const getCurrentUser = cache(async () => {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return null;
  const { data, error } = await supabase.auth.getUser();
  return error ? null : data.user;
});
