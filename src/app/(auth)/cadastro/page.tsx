import Link from "next/link";
import { signUp } from "../actions";
import { AuthShell } from "@/components/auth-shell";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getSupabaseConfig } from "@/lib/supabase/config";

const errors: Record<string, string> = {
  campos: "Preencha os dados, use uma senha de ao menos 8 caracteres e confirme que tem 18 anos ou mais.",
  cadastro: "Não foi possível criar a conta. Confira os dados e tente novamente.",
  configuracao: "A autenticação ainda não está configurada.",
};

export default async function SignUpPage({ searchParams }: { searchParams: Promise<{ erro?: string }> }) {
  const { erro } = await searchParams;
  const configured = Boolean(getSupabaseConfig());
  return <AuthShell title="Seu primeiro passo." description="Crie uma conta para ter um espaço só seu.">
    {!configured && <p role="status" className="mb-5 rounded-xl border border-border bg-secondary p-4 text-sm text-secondary-foreground">O cadastro estará disponível após configurar o Supabase. Você pode conhecer a interface enquanto isso.</p>}
    {erro && errors[erro] && <p role="alert" className="mb-5 rounded-xl bg-destructive/10 p-4 text-sm text-destructive">{errors[erro]}</p>}
    <form action={signUp} className="space-y-5">
      <div className="space-y-2"><Label htmlFor="name">Seu nome</Label><Input id="name" name="name" type="text" autoComplete="name" maxLength={80} required placeholder="Como podemos chamar você?" className="h-12" /></div>
      <div className="space-y-2"><Label htmlFor="email">E-mail</Label><Input id="email" name="email" type="email" autoComplete="email" inputMode="email" required placeholder="voce@exemplo.com" className="h-12" /></div>
      <div className="space-y-2"><Label htmlFor="password">Senha</Label><Input id="password" name="password" type="password" autoComplete="new-password" minLength={8} required placeholder="Pelo menos 8 caracteres" className="h-12" /><p className="text-xs text-muted-foreground">Use pelo menos 8 caracteres.</p></div>
      <label className="flex items-start gap-3 text-sm"><input name="adult_confirmed" type="checkbox" required className="mt-1 size-4 accent-primary" /><span>Confirmo que tenho 18 anos ou mais.</span></label>
      <SubmitButton disabled={!configured}>Criar conta</SubmitButton>
    </form>
    <p className="mt-6 text-center text-sm text-muted-foreground">Já tem uma conta? <Link href="/entrar" className="font-semibold text-primary underline-offset-4 hover:underline">Entrar</Link></p>
    {!configured && <p className="mt-5 text-center text-sm"><Link href="/inicio" className="font-semibold text-primary underline-offset-4 hover:underline">Conhecer a interface</Link></p>}
  </AuthShell>;
}
