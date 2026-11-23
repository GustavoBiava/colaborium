import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

async function deleteRoom(id: number) {
  const { data } = await api.delete(`/salas/${id}`);
  return data;
}

export function useDeleteRoom() {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: deleteRoom,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
    },
  });

  return {
    deleteRoom: deleteMutation.mutateAsync,
  };
}
