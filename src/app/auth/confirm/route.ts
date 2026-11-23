import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const type = url.searchParams.get("type");
  const tokenHash = url.searchParams.get("token_hash");
  const code = url.searchParams.get("code");
  if ((type !== "email" && type !== "recovery") ||
      (!tokenHash && !code) ||
      (tokenHash && tokenHash.length > 2048) ||
      (code && code.length > 2048)) {
    return NextResponse.redirect(new URL("/entrar?aviso=link-invalido", url.origin));
  }

  // E-mail clients may prefetch GET links. Verification must happen after a user action.
  const next = new URL("/auth/verificar", url.origin);
  next.searchParams.set("type", type);
  if (tokenHash) next.searchParams.set("token_hash", tokenHash);
  else if (code) next.searchParams.set("code", code);
  const response = NextResponse.redirect(next);
  response.headers.set("Referrer-Policy", "no-referrer");
  return response;
}
