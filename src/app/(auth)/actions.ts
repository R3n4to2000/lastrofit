"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function signIn(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) redirect("/entrar?erro=campos");
  const supabase = await createSupabaseServerClient();
  if (!supabase) redirect("/entrar?erro=configuracao");
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) redirect("/entrar?erro=credenciais");
  redirect("/inicio");
}

export async function signUp(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  if (!name || name.length > 80 || !email || email.length > 254 || password.length < 8) redirect("/cadastro?erro=campos");
  const supabase = await createSupabaseServerClient();
  if (!supabase) redirect("/cadastro?erro=configuracao");
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: name } },
  });
  if (error) redirect("/cadastro?erro=cadastro");
  if (data.session) redirect("/inicio");
  redirect("/entrar?aviso=confirme-email");
}

export async function signOut() {
  const supabase = await createSupabaseServerClient();
  if (supabase) await supabase.auth.signOut();
  redirect("/");
}
