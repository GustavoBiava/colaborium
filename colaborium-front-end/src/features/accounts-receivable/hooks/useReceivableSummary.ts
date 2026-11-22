import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { ReceivableSummary } from "../types/ReceivableSummary";

async function fetchReceivableSummary(): Promise<ReceivableSummary> {
  const { data } = await api.get<ReceivableSummary>("/contas-receber/resumo");
  return data;
}

export function useReceivableSummary() {
  const { data, isLoading, isError, error } = useQuery({
    // chave começa com "receivables": baixa/criação invalida lista e resumo juntos
    queryKey: ["receivables", "summary"],
    queryFn: fetchReceivableSummary,
  });

  return { summary: data, isLoading, isError, error };
}
