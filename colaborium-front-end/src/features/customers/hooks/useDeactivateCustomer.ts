import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { CustomerResponse } from "../types/CustomerResponse";

type DeactivateCustomerPayload = {
  id: number;
};

async function deactivateCustomer({
  id,
}: DeactivateCustomerPayload): Promise<CustomerResponse> {
  const { data } = await api.patch<CustomerResponse>(`/clientes/${id}/ativo`, {
    ativo: false,
  });
  return data;
}

export function useDeactivateCustomer() {
  const queryClient = useQueryClient();

  const deactivateMutation = useMutation({
    mutationFn: deactivateCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
    },
    onError: (error: Error) => {
      console.error("Erro ao desativar cliente:", error);
    },
  });

  return {
    deactivateCustomer: deactivateMutation.mutateAsync,
  };
}
