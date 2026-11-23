import { useInfiniteQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { ReceivableResponse, ReceivableStatus } from "../types/ReceivableResponse";

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

const PAGE_SIZE = 10;

async function fetchReceivablesPage(
  status: ReceivableStatus,
  search: string,
  page: number,
): Promise<PaginatedReceivables> {
  const { data } = await api.get<PaginatedReceivables>("/contas-receber", {
    params: {
      status,
      page,
      limit: PAGE_SIZE,
      search: search || undefined,
    },
  });
  return data;
}

export function useReceivablesInfinite(status: ReceivableStatus, search: string) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: ["receivables-infinite", status, search],
      queryFn: ({ pageParam }) => fetchReceivablesPage(status, search, pageParam),
      initialPageParam: 1,
      getNextPageParam: (lastPage) =>
        lastPage.pagination.has_next
          ? lastPage.pagination.actual_page + 1
          : undefined,
    });

  const receivables = data?.pages.flatMap((p) => p.data) ?? [];
  const total = data?.pages[0]?.pagination.total ?? 0;

  return {
    receivables,
    total,
    fetchNextPage,
    hasNextPage: hasNextPage ?? false,
    isFetchingNextPage,
    isLoading,
  };
}
