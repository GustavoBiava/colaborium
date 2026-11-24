
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { RoomResponse } from "../types/RoomResponse";

type CreateRoomPayload = Omit<RoomResponse, "id" | "ocupada">;

async function createRoom(payload: CreateRoomPayload): Promise<RoomResponse> {
  const { data } = await api.post<RoomResponse>("/salas", payload);
  return data;
}

export function useCreateRoom() {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: createRoom,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
    },
  });

  return {
    createRoom: createMutation.mutateAsync,
  };
}
