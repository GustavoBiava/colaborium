import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { CustomerResponse } from "../types/CustomerResponse";

type UpdateCustomerPayload = {
  id: number;
  data: Omit<CustomerResponse, "id"> & {
    ativo: boolean;
  };
};

async function updateCustomer({
  id,
  data,
}: UpdateCustomerPayload): Promise<CustomerResponse> {
  const { data: response } = await api.put<CustomerResponse>(
    `/clientes/${id}`,
    data,
  );
  return response;
}

export function useUpdateCustomer() {
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: updateCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
    },
    onError: (error: Error) => {
      console.error("Erro ao atualizar cliente:", error);
    },
  });

  return {
    updateCustomer: updateMutation.mutateAsync,
  };
}
