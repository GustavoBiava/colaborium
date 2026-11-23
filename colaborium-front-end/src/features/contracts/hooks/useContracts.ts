import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { ContractResponse } from "../types/ContractResponse";

type ContractFilters = {
  cliente_id?: number;
  sala_id?: number;
  status?: "A" | "F" | "C";
};

async function fetchContracts(filters: ContractFilters): Promise<ContractResponse[]> {
  const { data } = await api.get<ContractResponse[]>("/contratos", { params: filters });
  return data;
}

export function useContracts(filters: ContractFilters = {}) {
  const {
    data: contracts = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["contracts", filters],
    queryFn: () => fetchContracts(filters),
  });

  return { contracts, isLoading, isError, error };
}
