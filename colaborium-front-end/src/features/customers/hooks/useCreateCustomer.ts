import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { CustomerResponse } from "../types/CustomerResponse";

export type CreateCustomerPayload = {
  // Dados da empresa
  nome_empresa: string;
  cpf_cnpj_empresa: string;
  ie: string | null;
  email: string;
  telefone: string;

  // Endereço da empresa
  endereco_empresa: string;
  numero_empresa: string;
  complemento_empresa?: string;
  bairro_empresa: string;
  cidade_empresa: string;
  estado_empresa: string;
  cep_empresa: string;

  // Dados do representante
  nome_representante: string;
  cpf_representante: string;
  nacionalidade_representante?: string;
  estado_civil_representante: string;
  cargo_representante: string;

  // Endereço do representante
  endereco_representante: string;
  numero_representante: string;
  complemento_representante?: string;
  bairro_representante: string;
  cidade_representante: string;
  estado_representante: string;
  cep_representante: string;
};

async function createCustomer(
  payload: CreateCustomerPayload,
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
