import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { AppointmentResponse } from "../types/AppointmentResponse";
import type { AppointmentFormData } from "../schema/appointmentSchema";

async function createAppointments(
  payload: AppointmentFormData,
): Promise<AppointmentResponse> {
  const { data } = await api.post<AppointmentResponse>(
    "/agendamentos",
    payload,
  );
  return data;
}

export function useCreateAppointments() {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: createAppointments,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
    onError: (error: Error) => {
      console.error("Erro ao criar agendamento:", error);
    },
  });

  return {
    createAppointments: createMutation.mutateAsync,
  };
}
