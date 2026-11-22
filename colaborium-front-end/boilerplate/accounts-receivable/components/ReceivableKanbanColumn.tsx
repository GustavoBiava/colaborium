import { cn } from "cn";
import type { ReceivableResponse } from "../types/ReceivableResponse";
import { formatCurrency } from "../utils/formatCurrency";
import { ReceivableKanbanCard } from "./ReceivableKanbanCard";

// props: título, cor do ponto, contas da coluna e ação de baixa
interface ReceivableKanbanColumnProps {
  title: string;
  dotClass: string;
  receivables: ReceivableResponse[];
  onSettle: (receivable: ReceivableResponse) => void;
}

// coluna do kanban: cabeçalho com contagem e total + cards
export function ReceivableKanbanColumn({
  title,
  dotClass,
  receivables,
  onSettle,
}: ReceivableKanbanColumnProps) {
  const total = receivables.reduce((sum, r) => sum + r.valor, 0);

  return (
    <div className="flex flex-col gap-3 w-full rounded-xs border border-neutral-200 bg-neutral-50 p-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={cn("size-2.5 rounded-full", dotClass)} />
          <span className="font-semibold">{title}</span>
          <span className="rounded-full bg-white px-2 text-xs text-neutral-500">
            {receivables.length}
          </span>
        </div>
        <span className="text-xs text-neutral-500">
          {formatCurrency(total)}
        </span>
      </div>

      {receivables.length === 0 ? (
        <span className="py-4 text-center text-xs text-neutral-400">
          Nenhuma conta
        </span>
      ) : (
        receivables.map((receivable) => (
          <ReceivableKanbanCard
            key={receivable.id}
            receivable={receivable}
            onSettle={onSettle}
          />
        ))
      )}
    </div>
  );
}
