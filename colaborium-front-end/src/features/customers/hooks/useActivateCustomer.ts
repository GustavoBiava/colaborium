import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { CustomerResponse } from "../types/CustomerResponse";

type ActivateCustomerPayload = {
  id: number;
};

async function activateCustomer({
  id,
}: ActivateCustomerPayload): Promise<CustomerResponse> {
  const { data } = await api.patch<CustomerResponse>(`/clientes/${id}/ativo`, {
    ativo: true,
  });
  return data;
}

export function useActivateCustomer() {
  const queryClient = useQueryClient();

  const activateMutation = useMutation({
    mutationFn: activateCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
    },
    onError: (error: Error) => {
      console.error("Erro ao ativar cliente:", error);
    },
  });

  return {
    activateCustomer: activateMutation.mutateAsync,
  };
}
