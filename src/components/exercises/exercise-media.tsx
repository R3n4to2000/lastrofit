"use client";

import { useState } from "react";
import Image from "next/image";
import { ImageOff } from "lucide-react";
import type { ExerciseMediaAsset } from "@/lib/exercises/media";

export function ExerciseMedia({ asset, eager = false }: { asset: ExerciseMediaAsset | null; eager?: boolean }) {
  const [failed, setFailed] = useState(false);
  if (!asset || failed) return <div role="status" className="flex aspect-[20/13] flex-col items-center justify-center gap-2 rounded-2xl bg-secondary px-5 text-center text-sm text-muted-foreground">
    <ImageOff className="size-7" aria-hidden="true" />
    <span>Demonstração visual indisponível. Consulte as instruções abaixo.</span>
  </div>;

  return <figure className="overflow-hidden rounded-2xl bg-secondary">
    {asset.kind === "video"
      ? <video controls preload="metadata" playsInline aria-label={asset.alt} onError={() => setFailed(true)} className="aspect-[20/13] w-full object-contain"><source src={asset.src} type="video/mp4" />Seu navegador não consegue reproduzir esta demonstração.</video>
      : <Image src={asset.src} alt={asset.alt} width={400} height={260} unoptimized priority={eager} loading={eager ? "eager" : "lazy"} onError={() => setFailed(true)} className="aspect-[20/13] w-full object-contain" />}
  </figure>;
}
