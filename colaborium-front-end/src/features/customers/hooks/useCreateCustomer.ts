import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { CustomerResponse } from "../types/CustomerResponse";

async function createCustomer(
  payload: Omit<CustomerResponse, "id">,
): Promise<CustomerResponse> {
  const { data } = await api.post<CustomerResponse>("/clientes", payload);
  return data;
}

export function useCreateCustomer() {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: createCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
    },
    onError: (error: Error) => {
      console.error("Erro ao criar cliente:", error);
    },
  });

  return {
    createCustomer: createMutation.mutateAsync,
  };
}
