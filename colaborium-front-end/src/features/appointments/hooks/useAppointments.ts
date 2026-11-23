import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { AppointmentResponse } from "../types/AppointmentResponse";

type AppointmentFilters = {
  incluirCancelados?: boolean;
};

async function fetchAppointments(
  filters: AppointmentFilters,
): Promise<AppointmentResponse[]> {
  const { data } = await api.get<AppointmentResponse[]>("/agendamentos");

  if (filters.incluirCancelados) return data;

  return data.filter((appointment) => appointment.status !== "CANCELADA");
}

export function useAppointments(filters: AppointmentFilters = {}) {
  const {
    data: appointments = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["appointments", filters.incluirCancelados],
    queryFn: () => fetchAppointments(filters),
  });

  return { appointments, isLoading, isError, error };
}
