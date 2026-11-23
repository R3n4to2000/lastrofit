"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function verifyEmailLink(formData: FormData) {
  const type = formData.get("type");
  const tokenHash = formData.get("token_hash");
  const code = formData.get("code");
  if ((type !== "email" && type !== "recovery") ||
      (typeof tokenHash !== "string" || tokenHash.length > 2048) ||
      (typeof code !== "string" || code.length > 2048) ||
      (!tokenHash && !code)) {
    redirect("/entrar?aviso=link-invalido");
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) redirect("/entrar?aviso=link-invalido");

  const { error } = tokenHash
    ? await supabase.auth.verifyOtp({ token_hash: tokenHash, type })
    : await supabase.auth.exchangeCodeForSession(code);
  if (error) redirect("/entrar?aviso=link-invalido");
  redirect(type === "recovery" ? "/redefinir-senha" : "/inicio");
}

export async function completeImplicitRecovery(accessToken: string, refreshToken: string) {
  if (!accessToken || !refreshToken || accessToken.length > 8192 || refreshToken.length > 8192) {
    return false;
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) return false;
  const { error } = await supabase.auth.setSession({
    access_token: accessToken,
    refresh_token: refreshToken,
  });
  if (error) return false;

  const { data, error: userError } = await supabase.auth.getUser();
  if (userError || !data.user) {
    await supabase.auth.signOut();
    return false;
  }
  return true;
}
