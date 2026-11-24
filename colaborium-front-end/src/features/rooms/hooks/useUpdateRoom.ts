
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { RoomResponse } from "../types/RoomResponse";

type UpdateRoomPayload = {
  id: number;
  data: Omit<RoomResponse, "id" | "ocupada">;
};

async function updateRoom({
  id,
  data,
}: UpdateRoomPayload): Promise<RoomResponse> {
  const response = await api.put<RoomResponse>(`/salas/${id}`, data);
  return response.data;
}

export function useUpdateRoom() {
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: updateRoom,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
    },
  });

  return {
    updateRoom: updateMutation.mutateAsync,
  };
}
