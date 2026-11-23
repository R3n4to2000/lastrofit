import { CircleUserRound, LockKeyhole, Mail } from "lucide-react";
import { signOut } from "@/app/(auth)/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentUser } from "@/lib/supabase/auth";
import { getSupabaseConfig } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function ProfilePage() {
  const configured = Boolean(getSupabaseConfig());
  const user = configured ? await getCurrentUser() : null;
  const supabase = user ? await createSupabaseServerClient() : null;
  const { data: profile } = supabase ? await supabase.from("profiles").select("full_name").eq("user_id", user!.id).maybeSingle() : { data: null };
  const name = profile?.full_name ?? (typeof user?.user_metadata?.full_name === "string" ? user.user_metadata.full_name : null);
  return <div className="space-y-8"><div><Badge variant="secondary" className="rounded-full px-3 py-1 text-primary">Sua conta</Badge><h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">Perfil</h1><p className="mt-2 leading-7 text-muted-foreground">Seu espaço pessoal para acompanhar seus dados.</p></div><Card className="shadow-none"><CardHeader><CardTitle className="flex items-center gap-3 text-lg"><span className="flex size-11 items-center justify-center rounded-2xl bg-accent text-primary"><CircleUserRound className="size-5" aria-hidden="true" /></span>Dados da conta</CardTitle></CardHeader><CardContent className="space-y-0"><div className="flex items-start gap-3 border-t border-border py-5"><CircleUserRound className="mt-0.5 size-5 text-muted-foreground" aria-hidden="true" /><div><p className="text-xs font-medium text-muted-foreground">Nome</p><p className="mt-1 font-medium">{name ?? "Ainda não informado"}</p></div></div><div className="flex items-start gap-3 border-t border-border py-5"><Mail className="mt-0.5 size-5 text-muted-foreground" aria-hidden="true" /><div><p className="text-xs font-medium text-muted-foreground">E-mail</p><p className="mt-1 break-all font-medium">{user?.email ?? "Disponível após configurar a conta"}</p></div></div></CardContent></Card>{configured && <div><form action={signOut}><Button type="submit" variant="outline" className="h-11 rounded-xl px-5"><LockKeyhole className="size-4" aria-hidden="true" /> Sair da conta</Button></form></div>}</div>;
}
