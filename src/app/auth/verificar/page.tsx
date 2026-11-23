import type { Metadata } from "next";
import Link from "next/link";
import { AuthShell } from "@/components/auth-shell";
import { SubmitButton } from "@/components/submit-button";
import { verifyEmailLink } from "./actions";
import { RecoveryFragment } from "./recovery-fragment";

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function VerifyEmailPage({ searchParams }: {
  searchParams: Promise<{ type?: string; token_hash?: string; code?: string }>;
}) {
  const { type, token_hash: tokenHash, code } = await searchParams;
  const recoveryFragment = !tokenHash && !code && (type === "recovery" || type === undefined);
  const valid = (type === "email" || type === "recovery") &&
    Boolean(tokenHash || code) &&
    (!tokenHash || tokenHash.length <= 2048) &&
    (!code || code.length <= 2048);

  return <AuthShell
    title={type === "recovery" || recoveryFragment ? "Confirme a recuperação" : "Confirme seu e-mail"}
    description="Continue para validar o link com segurança."
  >
    {valid ? <form action={verifyEmailLink} className="space-y-5">
      <input type="hidden" name="type" value={type} />
      <input type="hidden" name="token_hash" value={tokenHash ?? ""} />
      <input type="hidden" name="code" value={code ?? ""} />
      <SubmitButton>Continuar</SubmitButton>
    </form> : recoveryFragment ? <RecoveryFragment /> : <p role="alert" className="rounded-xl bg-destructive/10 p-4 text-sm text-destructive">Este link está incompleto ou expirou. Solicite outro e-mail.</p>}
    <p className="mt-6 text-center text-sm"><Link href={type === "recovery" || recoveryFragment ? "/recuperar-senha" : "/entrar"} className="font-semibold text-primary">Voltar</Link></p>
  </AuthShell>;
}
