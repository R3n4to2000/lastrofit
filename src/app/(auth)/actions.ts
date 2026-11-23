"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createPasswordResetClient } from "@/lib/supabase/password-reset";

function appUrl() {
  return process.env.APP_URL?.replace(/\/$/, "");
}

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
  const adultConfirmed = formData.get("adult_confirmed") === "on";
  if (!name || name.length > 80 || !email || email.length > 254 || password.length < 8 || !adultConfirmed) redirect("/cadastro?erro=campos");
  const supabase = await createSupabaseServerClient();
  if (!supabase) redirect("/cadastro?erro=configuracao");
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: name, adult_confirmed: true } },
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

export async function requestPasswordReset(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  if (!email || email.length > 254) redirect("/recuperar-senha?erro=campos");
  const supabase = createPasswordResetClient();
  const origin = appUrl();
  if (!supabase || !origin) redirect("/recuperar-senha?erro=configuracao");
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/verificar`,
  });
  if (error) redirect("/recuperar-senha?erro=envio");
  // Keep the response identical for existing and unknown addresses.
  redirect("/recuperar-senha?aviso=enviado");
}

export async function updatePassword(formData: FormData) {
  const password = String(formData.get("password") ?? "");
  const confirmation = String(formData.get("confirmation") ?? "");
  if (password.length < 8 || password !== confirmation) redirect("/redefinir-senha?erro=campos");
  const supabase = await createSupabaseServerClient();
  if (!supabase) redirect("/redefinir-senha?erro=configuracao");
  const { data } = await supabase.auth.getUser();
  if (!data.user) redirect("/entrar?aviso=link-invalido");
  const { error } = await supabase.auth.updateUser({ password });
  if (error) redirect("/redefinir-senha?erro=atualizacao");
  await supabase.auth.signOut();
  redirect("/entrar?aviso=senha-alterada");
}
