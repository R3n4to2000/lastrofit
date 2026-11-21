"use client";

import { useFormStatus } from "react-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SubmitButton({ children, disabled = false }: { children: React.ReactNode; disabled?: boolean }) {
  const { pending } = useFormStatus();
  return <Button type="submit" size="lg" disabled={disabled || pending} className="h-12 w-full rounded-xl text-base">{pending ? "Aguarde..." : children}{!pending && <ArrowRight className="size-4" aria-hidden="true" />}</Button>;
}
