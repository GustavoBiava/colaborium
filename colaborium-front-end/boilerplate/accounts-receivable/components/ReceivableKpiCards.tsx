import { Card, CardContent } from "@/shared/components/ui/card";
import { cn } from "cn";
import type { ReceivableSummary } from "../types/ReceivableSummary";
import { formatCurrency } from "../utils/formatCurrency";

// props: totais do resumo (undefined enquanto carrega)
interface ReceivableKpiCardsProps {
  summary?: ReceivableSummary;
}

type KpiItem = {
  label: string;
  value: number;
  valueClass: string;
};

// 4 cards do topo
export function ReceivableKpiCards({ summary }: ReceivableKpiCardsProps) {
  const items: KpiItem[] = [
    {
      label: "Total a receber",
      value: summary?.total_a_receber ?? 0,
      valueClass: "text-emerald-700",
    },
    {
      label: "A vencer",
      value: summary?.a_vencer ?? 0,
      valueClass: "text-amber-600",
    },
    {
      label: "Vencido",
      value: summary?.vencido ?? 0,
      valueClass: "text-red-600",
    },
    {
      label: "Recebido no mês",
      value: summary?.recebido_mes ?? 0,
      valueClass: "text-green-600",
    },
  ];

  return (
    <div className="flex flex-row gap-2">
      {items.map((item) => (
        <Card key={item.label} className="rounded-xs w-full">
          <CardContent className="flex flex-col gap-1">
            <span className="text-sm text-neutral-500">{item.label}</span>
            <span className={cn("text-2xl font-bold", item.valueClass)}>
              {formatCurrency(item.value)}
            </span>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
