import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { ReceivableResponse } from "../types/ReceivableResponse";
import type { SettleReceivableFormData } from "../schema/settleReceivableSchema";

type SettleReceivablePayload = {
  id: number;
  data: SettleReceivableFormData;
};

async function settleReceivable({
  id,
  data,
}: SettleReceivablePayload): Promise<ReceivableResponse> {
  const { data: response } = await api.patch<ReceivableResponse>(
    `/contas-receber/${id}/baixa`,
    data,
  );
  return response;
}

export function useSettleReceivable() {
  const queryClient = useQueryClient();

  const settleMutation = useMutation({
    mutationFn: settleReceivable,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["receivables"] });
    },
    onError: (error: Error) => {
      console.error("Erro ao dar baixa na conta:", error);
    },
  });

  return {
    settleReceivable: settleMutation.mutateAsync,
  };
}
