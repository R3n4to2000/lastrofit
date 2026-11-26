import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function proxy(request: NextRequest) {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return NextResponse.next({ request });

  let response = NextResponse.next({ request });
  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() { return request.cookies.getAll(); },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });
  const { data } = await supabase.auth.getUser();
  if (!data.user && /^\/(inicio|semana|perfil|exercicios)(\/|$)/.test(request.nextUrl.pathname)) {
    const login = request.nextUrl.clone();
    login.pathname = "/entrar";
    login.searchParams.set("aviso", "entre-para-continuar");
    return NextResponse.redirect(login);
  }
  return response;
}

export const config = { matcher: ["/inicio/:path*", "/semana/:path*", "/perfil/:path*", "/exercicios/:path*"] };
