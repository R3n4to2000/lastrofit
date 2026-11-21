import { CalendarDays } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/empty-state";

const days = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

export default function WeekPage() {
  return <div className="space-y-8"><div><Badge variant="secondary" className="rounded-full px-3 py-1 text-primary">Planejamento</Badge><h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">Sua semana</h1><p className="mt-2 max-w-2xl leading-7 text-muted-foreground">Um lugar para visualizar sua rotina de treinos quando ela estiver disponível.</p></div><section aria-label="Dias da semana" className="grid grid-cols-7 gap-1.5 sm:gap-3">{days.map((day) => <div key={day} className="flex min-h-20 flex-col items-center justify-center rounded-2xl border border-border bg-card p-2 sm:min-h-28"><span className="text-xs font-semibold text-muted-foreground sm:text-sm">{day}</span><span className="mt-3 size-1.5 rounded-full bg-border" aria-hidden="true" /></div>)}</section><EmptyState icon={CalendarDays} title="Sua semana ainda está vazia" description="Os treinos e o acompanhamento semanal serão disponibilizados em uma próxima etapa." href="/inicio" action="Voltar ao início" /></div>;
}
