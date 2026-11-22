import { Button } from "@/shared/components/ui/button";
import type { ReceivableResponse } from "../types/ReceivableResponse";
import { formatCurrency } from "../utils/formatCurrency";
import { formatDate } from "../utils/formatDate";
import { ReceivableStatusBadge } from "./ReceivableStatusBadge";

// props: conta e ação de baixa
interface ReceivableKanbanCardProps {
  receivable: ReceivableResponse;
  onSettle: (receivable: ReceivableResponse) => void;
}

// card de uma conta dentro da coluna
export function ReceivableKanbanCard({
  receivable,
  onSettle,
}: ReceivableKanbanCardProps) {
  return (
    <div className="flex flex-col gap-1 rounded-xs border border-neutral-200 bg-white p-3 shadow-xs">
      <div className="flex items-center justify-between">
        <span className="font-semibold">{receivable.cliente_nome}</span>
        <ReceivableStatusBadge status={receivable.status} />
      </div>
      <span className="text-xs text-neutral-500">
        {receivable.descricao ?? "-"} · vence{" "}
        {formatDate(receivable.data_vencimento)}
      </span>
      <span className="mt-1 font-bold">{formatCurrency(receivable.valor)}</span>

      {receivable.status !== "recebido" && (
        <Button
          variant="ghost"
          size="xs"
          className="mt-1 self-start"
          onClick={() => onSettle(receivable)}
        >
          Dar baixa
        </Button>
      )}
    </div>
  );
}
