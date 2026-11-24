import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { ContractResponse } from "../types/ContractResponse";

type UpdateContractData = {
  cliente_id: number;
  data_inicio: string;
  data_fim: string;
  valor_base: number;
  periodo: number;
  observacao?: string | null;
  salas: number[];
};

type UpdateContractPayload = {
  id: number;
  data: UpdateContractData;
};

async function updateContract({ id, data }: UpdateContractPayload): Promise<ContractResponse> {
  const { data: response } = await api.put<ContractResponse>(`/contratos/${id}`, data);
  return response;
}

export function useUpdateContract() {
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: updateContract,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contracts"] });
    },
    onError: (error: Error) => {
      console.error("Erro ao atualizar contrato:", error);
    },
  });

  return {
    updateContract: updateMutation.mutateAsync,
  };
}
