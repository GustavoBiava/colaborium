import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { ContractResponse } from "../types/ContractResponse";

type ChangeContractStatusPayload = {
  id: number;
  status: "F" | "C";
  motivo_cancelamento?: string;
};

async function changeContractStatus({
  id,
  status,
  motivo_cancelamento,
}: ChangeContractStatusPayload): Promise<ContractResponse> {
  const { data } = await api.patch<ContractResponse>(`/contratos/${id}/status`, {
    status,
    motivo_cancelamento,
  });
  return data;
}

export function useChangeContractStatus() {
  const queryClient = useQueryClient();

  const changeStatusMutation = useMutation({
    mutationFn: changeContractStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contracts"] });
    },
    onError: (error: Error) => {
      console.error("Erro ao alterar status do contrato:", error);
    },
  });

  return {
    changeContractStatus: changeStatusMutation.mutateAsync,
  };
}
