import { PageLayout } from "@/shared/components/layout/PageLayout";
import { Wallet } from "lucide-react";
import { useCallback, useState } from "react";

import { ReceivableDialog } from "./components/ReceivableDialog";
import { ReceivableKanban } from "./components/ReceivableKanban";
import { ReceivableKpiCards } from "./components/ReceivableKpiCards";
import { ReceivableList } from "./components/ReceivableList";
import {
  ReceivableToolbar,
  type ReceivableView,
} from "./components/ReceivableToolbar";
import { SettleDialog } from "./components/SettleDialog";
import { useCreateReceivable } from "./hooks/useCreateReceivable";
import { useReceivables } from "./hooks/useReceivables";
import { useReceivableSummary } from "./hooks/useReceivableSummary";
import { useSettleReceivable } from "./hooks/useSettleReceivable";
import type { ReceivableFormData } from "./schema/receivableSchema";
import type { SettleReceivableFormData } from "./schema/settleReceivableSchema";
import type {
  ReceivableResponse,
  ReceivableStatusFilter,
} from "./types/ReceivableResponse";

export function AccountsReceivablePage() {
  const [status, setStatus] = useState<ReceivableStatusFilter>("todos");
  const [search, setSearch] = useState("");
  const [view, setView] = useState<ReceivableView>("lista");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState<number | "all">(10);

  const [createOpen, setCreateOpen] = useState(false);
  const [settleOpen, setSettleOpen] = useState(false);
  const [settleTarget, setSettleTarget] = useState<ReceivableResponse | null>(
    null,
  );

  const isKanban = view === "kanban";

  const { receivables, pagination } = useReceivables(
    isKanban ? undefined : { page, limit, status, search },
  );
  const { summary } = useReceivableSummary();
  const { createReceivable } = useCreateReceivable();
  const { settleReceivable } = useSettleReceivable();

  const handleSearchChange = useCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, []);

  const handleStatusChange = (value: ReceivableStatusFilter) => {
    setStatus(value);
    setPage(1);
  };

  const handleLimitChange = (value: number | "all") => {
    setLimit(value);
    setPage(1);
  };

  const handleOpenSettle = (receivable: ReceivableResponse) => {
    setSettleTarget(receivable);
    setSettleOpen(true);
  };

  const handleCreate = (data: ReceivableFormData) =>
    createReceivable({
      ...data,
      descricao: data.descricao?.trim() || null,
    });

  const handleSettle = (data: SettleReceivableFormData) => {
    if (!settleTarget) return Promise.resolve();
    return settleReceivable({ id: settleTarget.id, data });
  };

  return (
    <PageLayout
      pageTitle="Contas a Receber"
      Icon={Wallet}
      subtitle="Gerencie suas contas a receber"
      fullHeight
    >
      <ReceivableKpiCards summary={summary} />
      <div className="flex flex-col gap-5 min-h-0 flex-1">
        <div className="shrink-0">
          <ReceivableToolbar
            search={search}
            onSearchChange={handleSearchChange}
            status={status}
            onStatusChange={handleStatusChange}
            view={view}
            onViewChange={setView}
          />
        </div>

        {isKanban ? (
          <ReceivableKanban search={search} onSettle={handleOpenSettle} />
        ) : (
          <ReceivableList
            receivables={receivables}
            pagination={pagination}
            limit={limit}
            onPageChange={setPage}
            onLimitChange={handleLimitChange}
            onSettle={handleOpenSettle}
          />
        )}
      </div>

      <ReceivableDialog
        open={createOpen}
        setOpen={setCreateOpen}
        onSubmit={handleCreate}
      />

      <SettleDialog
        open={settleOpen}
        setOpen={setSettleOpen}
        receivable={settleTarget}
        onSubmit={handleSettle}
      />
    </PageLayout>
  );
}
