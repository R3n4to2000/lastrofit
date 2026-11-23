"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { completeImplicitRecovery } from "./actions";

export function RecoveryFragment() {
  const router = useRouter();
  const started = useRef(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    const fragment = new URLSearchParams(window.location.hash.slice(1));
    const accessToken = fragment.get("access_token");
    const refreshToken = fragment.get("refresh_token");
    const recovery = fragment.get("type") === "recovery";
    window.history.replaceState(null, "", window.location.pathname + window.location.search);

    if (!recovery || !accessToken || !refreshToken) {
      queueMicrotask(() => setFailed(true));
      return;
    }

    void completeImplicitRecovery(accessToken, refreshToken)
      .then((ok) => {
        if (ok) router.replace("/redefinir-senha");
        else setFailed(true);
      })
      .catch(() => setFailed(true));
  }, [router]);

  return failed
    ? <p role="alert" className="rounded-xl bg-destructive/10 p-4 text-sm text-destructive">Este link está incompleto ou expirou. Solicite outro e-mail.</p>
    : <p role="status" className="text-sm text-muted-foreground">Validando o link de recuperação…</p>;
}
