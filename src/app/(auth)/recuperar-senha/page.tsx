import Link from "next/link";
import { requestPasswordReset } from "../actions";
import { AuthShell } from "@/components/auth-shell";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getSupabaseConfig } from "@/lib/supabase/config";

export default async function RecoveryPage({ searchParams }: { searchParams: Promise<{ erro?: string; aviso?: string }> }) {
  const { erro, aviso } = await searchParams;
  const configured = Boolean(getSupabaseConfig() && process.env.APP_URL);
  return <AuthShell title="Recuperar senha" description="Enviaremos um link para criar uma nova senha.">
    {!configured && <p role="status" className="mb-5 rounded-xl bg-secondary p-4 text-sm">A recuperação estará disponível após configurar o Supabase e APP_URL.</p>}
    {erro && <p role="alert" className="mb-5 rounded-xl bg-destructive/10 p-4 text-sm text-destructive">{erro === "campos" ? "Informe um e-mail válido." : erro === "envio" ? "Não foi possível enviar agora. Tente novamente mais tarde." : "A recuperação ainda não está configurada."}</p>}
    {aviso === "enviado" && <p role="status" className="mb-5 rounded-xl bg-accent p-4 text-sm text-primary">Se houver uma conta para esse e-mail, enviaremos um link de recuperação.</p>}
    <form action={requestPasswordReset} className="space-y-5">
      <div className="space-y-2"><Label htmlFor="email">E-mail</Label><Input id="email" name="email" type="email" autoComplete="email" required maxLength={254} className="h-12" /></div>
      <SubmitButton disabled={!configured}>Enviar link</SubmitButton>
    </form>
    <p className="mt-6 text-center text-sm"><Link href="/entrar" className="font-semibold text-primary">Voltar para entrar</Link></p>
  </AuthShell>;
}
