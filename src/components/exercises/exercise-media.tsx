"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ImageOff } from "lucide-react";
import type { ExerciseMediaAsset } from "@/lib/exercises/media";

export function ExerciseMedia({ asset, eager = false, card = false }: { asset: ExerciseMediaAsset | null; eager?: boolean; card?: boolean }) {
  const [failed, setFailed] = useState(false);
  const [visible, setVisible] = useState(!card);
  const [reducedMotion, setReducedMotion] = useState(false);
  const container = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!card || !container.current) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { rootMargin: "80px" });
    observer.observe(container.current);
    return () => observer.disconnect();
  }, [card, asset]);

  useEffect(() => {
    if (!video.current || !card) return;
    if (visible && !reducedMotion) void video.current.play().catch(() => {});
    else video.current.pause();
  }, [card, visible, reducedMotion, asset]);

  if (failed && asset?.poster) return <figure className="overflow-hidden rounded-2xl bg-secondary"><Image src={asset.poster} alt={asset.alt} width={400} height={260} unoptimized priority={eager} loading={eager ? "eager" : "lazy"} className="aspect-[20/13] w-full object-contain" /><figcaption className="p-2 text-xs text-muted-foreground">Vídeo indisponível. Imagem do exercício.</figcaption></figure>;
  if (!asset || failed) return <div role="status" className="flex aspect-[20/13] flex-col items-center justify-center gap-2 rounded-2xl bg-secondary px-5 text-center text-sm text-muted-foreground">
    <ImageOff className="size-7" aria-hidden="true" />
    <span>Demonstração visual indisponível. Abra o exercício para ler as instruções.</span>
  </div>;

  return <figure ref={container} className="overflow-hidden rounded-2xl bg-secondary">
    {asset.kind === "video"
      ? card && (!visible || reducedMotion)
        ? asset.poster
          ? <Image src={asset.poster} alt={asset.alt} width={400} height={260} unoptimized loading="lazy" className="aspect-[20/13] w-full object-contain" />
          : <div className="flex aspect-[20/13] items-center justify-center px-5 text-center text-sm text-muted-foreground">Vídeo disponível ao abrir o exercício.</div>
        : <video ref={video} controls={!card} preload={card ? "none" : "metadata"} muted={card} loop={card} playsInline poster={asset.poster} aria-label={asset.alt} onError={() => setFailed(true)} className="aspect-[20/13] w-full object-contain" src={asset.src}>Seu navegador não consegue reproduzir esta demonstração.</video>
      : <Image src={asset.src} alt={asset.alt} width={400} height={260} unoptimized priority={eager} loading={eager ? "eager" : "lazy"} onError={() => setFailed(true)} className="aspect-[20/13] w-full object-contain" />}
  </figure>;
}
