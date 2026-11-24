import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { ContractResponse } from "../types/ContractResponse";

type CreateContractPayload = {
  cliente_id: number;
  data_inicio: string;
  data_fim: string;
  valor_base: number;
  periodo: number;
  observacao?: string | null;
  salas: number[];
};

async function createContract(payload: CreateContractPayload): Promise<ContractResponse> {
  const { data } = await api.post<ContractResponse>("/contratos", payload);
  return data;
}

export function useCreateContract() {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: createContract,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contracts"] });
    },
    onError: (error: Error) => {
      console.error("Erro ao criar contrato:", error);
    },
  });

  return {
    createContract: createMutation.mutateAsync,
  };
}
