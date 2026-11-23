import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { CustomerResponse } from "../types/CustomerResponse";

type CustomerFilters = {
  page?: number;
  limit?: number | "all";
  incluirInativos?: boolean;
};

type PaginatedCustomers = {
  data: CustomerResponse[];
  pagination: {
    actual_page: number;
    limit_per_page: number | "all";
    total: number;
    total_pages: number;
    has_next: boolean;
  };
};

async function fetchCustomers(
  filters: CustomerFilters,
): Promise<PaginatedCustomers> {
  const { data } = await api.get<PaginatedCustomers>("/clientes", {
    params: filters,
  });
  return data;
}

export function useCustomers(filters: CustomerFilters = {}) {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["customers", filters],
    queryFn: () => fetchCustomers(filters),
  });

  return {
    customers: data?.data ?? [],
    pagination: data?.pagination,
    isLoading,
    isError,
    error,
  };
}
