import Link from "next/link";
import { signIn } from "../actions";
import { AuthShell } from "@/components/auth-shell";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getSupabaseConfig } from "@/lib/supabase/config";

const errors: Record<string, string> = {
  campos: "Preencha o e-mail e a senha para continuar.",
  credenciais: "Não foi possível entrar. Confira seus dados e tente novamente.",
  configuracao: "A autenticação ainda não está configurada.",
};
const notices: Record<string, string> = {
  "confirme-email": "Conta criada. Confira seu e-mail para confirmar o cadastro antes de entrar.",
  "entre-para-continuar": "Entre na sua conta para acessar esse espaço.",
  "senha-alterada": "Senha atualizada. Entre com a nova senha.",
  "link-invalido": "O link expirou ou é inválido. Solicite outro e-mail de recuperação.",
};

export default async function SignInPage({ searchParams }: { searchParams: Promise<{ erro?: string; aviso?: string }> }) {
  const { erro, aviso } = await searchParams;
  const configured = Boolean(getSupabaseConfig());
  return <AuthShell title="Bom ter você de volta." description="Entre na sua conta e continue sua jornada.">
    {!configured && <p role="status" className="mb-5 rounded-xl border border-border bg-secondary p-4 text-sm text-secondary-foreground">A autenticação estará disponível após configurar o Supabase. Você pode conhecer a interface enquanto isso.</p>}
    {erro && errors[erro] && <p role="alert" className="mb-5 rounded-xl bg-destructive/10 p-4 text-sm text-destructive">{errors[erro]}</p>}
    {aviso && notices[aviso] && <p role="status" className="mb-5 rounded-xl bg-accent p-4 text-sm text-primary">{notices[aviso]}</p>}
    <form action={signIn} className="space-y-5">
      <div className="space-y-2"><Label htmlFor="email">E-mail</Label><Input id="email" name="email" type="email" autoComplete="email" inputMode="email" required placeholder="voce@exemplo.com" className="h-12" /></div>
      <div className="space-y-2"><Label htmlFor="password">Senha</Label><Input id="password" name="password" type="password" autoComplete="current-password" required placeholder="Sua senha" className="h-12" /></div>
      <SubmitButton disabled={!configured}>Entrar</SubmitButton>
    </form>
    <p className="mt-4 text-center text-sm"><Link href="/recuperar-senha" className="font-semibold text-primary underline-offset-4 hover:underline">Esqueceu a senha?</Link></p>
    <p className="mt-6 text-center text-sm text-muted-foreground">Ainda não tem uma conta? <Link href="/cadastro" className="font-semibold text-primary underline-offset-4 hover:underline">Cadastre-se</Link></p>
    {!configured && <p className="mt-5 text-center text-sm"><Link href="/inicio" className="font-semibold text-primary underline-offset-4 hover:underline">Conhecer a interface</Link></p>}
  </AuthShell>;
}
