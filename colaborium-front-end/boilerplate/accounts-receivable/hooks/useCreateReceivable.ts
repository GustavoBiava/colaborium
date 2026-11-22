import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { ReceivableResponse } from "../types/ReceivableResponse";

// body do POST /contas-receber
type CreateReceivablePayload = {
  cliente_id: number;
  descricao?: string | null;
  valor: number;
  data_emissao?: string | null;
  data_vencimento: string;
};

async function createReceivable(
  payload: CreateReceivablePayload,
): Promise<ReceivableResponse> {
  const { data } = await api.post<ReceivableResponse>(
    "/contas-receber",
    payload,
  );
  return data;
}

export function useCreateReceivable() {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: createReceivable,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["receivables"] });
    },
    onError: (error: Error) => {
      console.error("Erro ao criar conta a receber:", error);
    },
  });

  return {
    createReceivable: createMutation.mutateAsync,
  };
}
