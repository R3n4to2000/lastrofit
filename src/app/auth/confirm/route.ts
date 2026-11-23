import { type EmailOtpType } from "@supabase/supabase-js";
import { type NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const type = url.searchParams.get("type");
  const tokenHash = url.searchParams.get("token_hash");
  const code = url.searchParams.get("code");
  const supabase = await createSupabaseServerClient();
  let valid = false;
  if (supabase && tokenHash && (type === "email" || type === "recovery")) {
    const { error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type: type as EmailOtpType });
    valid = !error;
  } else if (supabase && code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    valid = !error;
  }
  const destination = valid ? (type === "recovery" ? "/redefinir-senha" : "/inicio") : "/entrar?aviso=link-invalido";
  return NextResponse.redirect(new URL(destination, url.origin));
}
