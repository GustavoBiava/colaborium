import { DataTable } from "@/shared/components/DataTable";
import { Pagination } from "@/shared/components/Pagination";
import { Button } from "@/shared/components/ui/button";
import {
  createColumnHelper,
  createSortedRowModel,
  rowPaginationFeature,
  rowSortingFeature,
  sortFn_alphanumeric,
  tableFeatures,
  useTable,
  type SortingState,
} from "@tanstack/react-table";
import { useState } from "react";
import type { ReceivableResponse } from "../types/ReceivableResponse";
import { formatCurrency } from "../utils/formatCurrency";
import { formatDate } from "../utils/formatDate";
import { ReceivableStatusBadge } from "./ReceivableStatusBadge";

// mesmas features da tabela de clientes (DataTable espera esse tipo)
export const features = tableFeatures({
  rowSortingFeature,
  rowPaginationFeature,
  sortedRowModel: createSortedRowModel(),
  sortFns: { alphanumeric: sortFn_alphanumeric },
});

// colunas que a lista usa
interface ReceivableColumns extends Pick<
  ReceivableResponse,
  | "id"
  | "cliente_nome"
  | "descricao"
  | "data_vencimento"
  | "valor"
  | "status"
> {}

const helper = createColumnHelper<typeof features, ReceivableColumns>();

type PaginationInfo = {
  actual_page: number;
  total_pages: number;
};

// props: dados da página, paginação server-side e ação de baixa
interface ReceivableListProps {
  receivables: ReceivableResponse[];
  pagination?: PaginationInfo;
  limit: number | "all";
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number | "all") => void;
  onSettle: (receivable: ReceivableResponse) => void;
}

// tabela de contas + paginação
export function ReceivableList({
  receivables,
  pagination,
  limit,
  onPageChange,
  onLimitChange,
  onSettle,
}: ReceivableListProps) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const columns = helper.columns([
    helper.accessor("cliente_nome", {
      header: "Cliente",
      cell: (info) => <span className="font-semibold">{info.getValue()}</span>,
    }),
    helper.accessor("descricao", {
      header: "Documento",
      cell: (info) => info.getValue() ?? "-",
    }),
    helper.accessor("data_vencimento", {
      header: "Vencimento",
      cell: (info) => formatDate(info.getValue()),
    }),
    helper.accessor("valor", {
      header: "Valor",
      cell: (info) => (
        <span className="font-semibold">{formatCurrency(info.getValue())}</span>
      ),
    }),
    helper.accessor("status", {
      header: "Status",
      cell: (info) => <ReceivableStatusBadge status={info.getValue()} />,
    }),
    helper.display({
      id: "actions",
      header: "Ações",
      cell: (info) => {
        const receivable = receivables.find((r) => r.id === info.row.original.id);
        if (!receivable || receivable.status === "recebido") return null;

        return (
          <Button
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              onSettle(receivable);
            }}
          >
            Dar baixa
          </Button>
        );
      },
    }),
  ]);

  const table = useTable({
    features,
    columns,
    data: receivables,
    state: { sorting },
    onSortingChange: setSorting,
  });

  return (
    <div className="flex flex-col gap-5">
      {/* linha não é clicável nesta tela */}
      <DataTable table={table} onRowClick={() => {}} />
      <Pagination
        page={pagination?.actual_page ?? 1}
        totalPages={pagination?.total_pages ?? 1}
        onPageChange={onPageChange}
        limit={limit}
        onLimitChange={onLimitChange}
      />
    </div>
  );
}
