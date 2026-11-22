import type { ReceivableResponse } from "../types/ReceivableResponse";
import { KANBAN_COLUMNS } from "../utils/receivableStatus";
import { ReceivableKanbanColumn } from "./ReceivableKanbanColumn";

// props: todas as contas (sem paginar) e ação de baixa
interface ReceivableKanbanProps {
  receivables: ReceivableResponse[];
  onSettle: (receivable: ReceivableResponse) => void;
}

// 3 colunas por status. só separação visual, sem arrastar
export function ReceivableKanban({
  receivables,
  onSettle,
}: ReceivableKanbanProps) {
  return (
    <div className="flex flex-row gap-3 w-full">
      {KANBAN_COLUMNS.map((column) => (
        <ReceivableKanbanColumn
          key={column.status}
          title={column.title}
          dotClass={column.dotClass}
          receivables={receivables.filter((r) => r.status === column.status)}
          onSettle={onSettle}
        />
      ))}
    </div>
  );
}
