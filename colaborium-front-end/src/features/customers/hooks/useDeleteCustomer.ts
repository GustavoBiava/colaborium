import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

async function deleteCustomer(id: number): Promise<void> {
  await api.delete(`/clientes/${id}`);
}

export function useDeleteCustomer() {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: deleteCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
    },
    onError: (error: Error) => {
      console.error("Erro ao excluir cliente:", error);
    },
  });

  return {
    deleteCustomer: deleteMutation.mutateAsync,
  };
}
