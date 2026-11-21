import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { RoomResponse } from "../types/RoomResponse";

async function fetchRooms(): Promise<RoomResponse[]> {
  const { data } = await api.get<RoomResponse[]>("/salas");
  return data;
}

export function useRooms() {
  const {
    data: rooms = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["rooms"],
    queryFn: fetchRooms,
  });

  return { rooms, isLoading, isError, error };
}
