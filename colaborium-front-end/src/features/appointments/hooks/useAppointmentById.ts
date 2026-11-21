import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { AppointmentResponse } from "../types/AppointmentResponse";

async function fetchAppointmentById(
  id: number,
): Promise<AppointmentResponse> {
  const { data } = await api.get<AppointmentResponse>(`/agendamentos/${id}`);
  return data;
}

export function useAppointmentById(id: number) {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["appointments", id],
    queryFn: () => fetchAppointmentById(id),
    enabled: Number.isFinite(id) && id > 0,
  });

  return { appointment: data, isLoading, isError, error };
}
