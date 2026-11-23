import { Button } from "@/shared/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";
import { Download } from "lucide-react";
import type { ReceivableResponse } from "../types/ReceivableResponse";
import { formatCurrency } from "../utils/formatCurrency";
import { formatDate } from "../utils/formatDate";

interface ReceivableKanbanCardProps {
  receivable: ReceivableResponse;
  onSettle: (receivable: ReceivableResponse) => void;
}

export function ReceivableKanbanCard({
  receivable,
  onSettle,
}: ReceivableKanbanCardProps) {
  return (
    <div className="flex flex-col gap-2 rounded-xs border border-neutral-200 bg-white p-3 shadow-xs items-start justify-center relative">
      <div className="flex items-center justify-between">
        <span className="font-semibold ">{receivable.cliente_nome}</span>
      </div>
      <span className="text-xs text-neutral-500 text-left">
        {receivable.descricao ?? "-"} · vence{" "}
        {formatDate(receivable.data_vencimento)}
      </span>
      <span className="text-xs">Valor: {formatCurrency(receivable.valor)}</span>

      <div className="absolute right-3 bottom-2">
        {receivable.status !== "recebido" && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="xs"
                className="mt-1 self-start"
                onClick={() => onSettle(receivable)}
              >
                <Download />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Dar baixa</TooltipContent>
          </Tooltip>
        )}
      </div>
    </div>
  );
}
