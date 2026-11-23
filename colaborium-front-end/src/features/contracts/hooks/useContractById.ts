import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { ContractResponse } from "../types/ContractResponse";

async function fetchContractById(id: number): Promise<ContractResponse> {
  const { data } = await api.get<ContractResponse>(`/contratos/${id}`);
  return data;
}

export function useContractById(id: number) {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["contracts", id],
    queryFn: () => fetchContractById(id),
    enabled: Number.isFinite(id) && id > 0,
  });

  return { contract: data, isLoading, isError, error };
}
