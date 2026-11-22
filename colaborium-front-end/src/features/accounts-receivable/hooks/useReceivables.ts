import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type {
  ReceivableResponse,
  ReceivableStatusFilter,
} from "../types/ReceivableResponse";

type ReceivableFilters = {
  page?: number;
  limit?: number | "all";
  status?: ReceivableStatusFilter;
  search?: string;
};

type PaginatedReceivables = {
  data: ReceivableResponse[];
  pagination: {
    actual_page: number;
    limit_per_page: number | "all";
    total: number;
    total_pages: number;
    has_next: boolean;
  };
};

async function fetchReceivables(
  filters: ReceivableFilters,
): Promise<PaginatedReceivables> {
  const { data } = await api.get<PaginatedReceivables>("/contas-receber", {
    params: { ...filters, search: filters.search || undefined },
  });
  return data;
}

export function useReceivables(filters?: ReceivableFilters) {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["receivables", filters],
    queryFn: () => fetchReceivables(filters ?? {}),
    enabled: filters !== undefined,
  });

  return {
    receivables: data?.data ?? [],
    pagination: data?.pagination,
    isLoading,
    isError,
    error,
  };
}
