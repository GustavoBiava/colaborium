import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { RoomResponse } from "../types/RoomResponse";

async function fetchAvailableRooms(
  dataInicio: string,
  dataFim: string
): Promise<RoomResponse[]> {
  const { data } = await api.get<RoomResponse[]>("/salas/disponiveis", {
    params: { data_inicio: dataInicio, data_fim: dataFim },
  });
  return data;
}

export function useAvailableRooms(dataInicio?: string, dataFim?: string) {
  const enabled = Boolean(dataInicio && dataFim);

  const {
    data: rooms = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["rooms", "disponiveis", dataInicio, dataFim],
    queryFn: () => fetchAvailableRooms(dataInicio!, dataFim!),
    enabled,
  });

  return { rooms, isLoading, isError, error, enabled };
}
