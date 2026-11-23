import { redirect } from "next/navigation";
import { updatePassword } from "../actions";
import { AuthShell } from "@/components/auth-shell";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getCurrentUser } from "@/lib/supabase/auth";

export default async function ResetPasswordPage({ searchParams }: { searchParams: Promise<{ erro?: string }> }) {
  if (!await getCurrentUser()) redirect("/entrar?aviso=link-invalido");
  const { erro } = await searchParams;
  return <AuthShell title="Nova senha" description="Escolha uma nova senha para sua conta.">
    {erro && <p role="alert" className="mb-5 rounded-xl bg-destructive/10 p-4 text-sm text-destructive">{erro === "campos" ? "As senhas precisam coincidir e ter ao menos 8 caracteres." : "Não foi possível atualizar a senha. Solicite outro link se o problema continuar."}</p>}
    <form action={updatePassword} className="space-y-5">
      <div className="space-y-2"><Label htmlFor="password">Nova senha</Label><Input id="password" name="password" type="password" autoComplete="new-password" minLength={8} required className="h-12" /></div>
      <div className="space-y-2"><Label htmlFor="confirmation">Confirme a senha</Label><Input id="confirmation" name="confirmation" type="password" autoComplete="new-password" minLength={8} required className="h-12" /></div>
      <SubmitButton>Atualizar senha</SubmitButton>
    </form>
  </AuthShell>;
}
