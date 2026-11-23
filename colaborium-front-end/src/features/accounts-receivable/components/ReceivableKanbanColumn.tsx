import { cn } from "cn";
import { useEffect, useRef } from "react";
import type { ReceivableResponse, ReceivableStatus } from "../types/ReceivableResponse";
import { formatCurrency } from "../utils/formatCurrency";
import { useReceivablesInfinite } from "../hooks/useReceivablesInfinite";
import { ReceivableKanbanCard } from "./ReceivableKanbanCard";

interface ReceivableKanbanColumnProps {
  title: string;
  dotClass: string;
  status: ReceivableStatus;
  search: string;
  onSettle: (receivable: ReceivableResponse) => void;
}

export function ReceivableKanbanColumn({
  title,
  dotClass,
  status,
  search,
  onSettle,
}: ReceivableKanbanColumnProps) {
  const {
    receivables,
    total,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useReceivablesInfinite(status, search);

  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { root: sentinel.parentElement, threshold: 0.1 },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const valorTotal = receivables.reduce((sum, r) => sum + r.valor, 0);

  return (
    <div className="flex flex-col gap-3 w-full min-h-0 rounded-xs border border-neutral-200 bg-neutral-50 p-3">
      <div className="flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <span className={cn("size-2.5 rounded-full", dotClass)} />
          <span className="font-semibold">{title}</span>
          <span className="rounded-full bg-white px-2 text-xs text-neutral-500">
            {total}
          </span>
        </div>
        <span className="text-xs text-neutral-500">
          {formatCurrency(valorTotal)}
        </span>
      </div>

      <div className="flex flex-col gap-3 min-h-0 flex-1 overflow-y-auto pr-1">
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

        <div ref={sentinelRef} className="h-px shrink-0" />

        {isFetchingNextPage && (
          <span className="pb-2 text-center text-xs text-neutral-400">
            Carregando...
          </span>
        )}
      </div>
    </div>
  );
}
