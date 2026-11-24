import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { RoomResponse } from "../types/RoomResponse";

type UseRoomsFilters = {
  incluirInativos?: boolean;
};

async function fetchRooms(incluirInativos?: boolean): Promise<RoomResponse[]> {
  const { data } = await api.get<RoomResponse[]>("/salas", {
    params: { incluirInativos },
  });
  return data;
}

export function useRooms(filters?: UseRoomsFilters) {
  const {
    data: rooms = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["rooms", filters?.incluirInativos],
    queryFn: () => fetchRooms(filters?.incluirInativos),
  });

  return { rooms, isLoading, isError, error };
}
