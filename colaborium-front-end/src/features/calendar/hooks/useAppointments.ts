import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { AppointmentResponse } from "../types/AppointmentResponse";

async function fetchAppointments(): Promise<AppointmentResponse[]> {
  const { data } = await api.get<AppointmentResponse[]>("/agendamentos");
  return data;
}

export function useAppointments() {
  const {
    data: appointments = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["appointments"],
    queryFn: fetchAppointments,
  });

  return { appointments, isLoading, isError, error };
}
