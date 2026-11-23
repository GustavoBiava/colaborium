import type { ReceivableResponse } from "../types/ReceivableResponse";
import { KANBAN_COLUMNS } from "../utils/receivableStatus";
import { ReceivableKanbanColumn } from "./ReceivableKanbanColumn";

interface ReceivableKanbanProps {
  search: string;
  onSettle: (receivable: ReceivableResponse) => void;
}

export function ReceivableKanban({ search, onSettle }: ReceivableKanbanProps) {
  return (
    <div className="flex flex-row gap-3 w-full min-h-0 flex-1">
      {KANBAN_COLUMNS.map((column) => (
        <ReceivableKanbanColumn
          key={column.status}
          title={column.title}
          dotClass={column.dotClass}
          status={column.status}
          search={search}
          onSettle={onSettle}
        />
      ))}
    </div>
  );
}
