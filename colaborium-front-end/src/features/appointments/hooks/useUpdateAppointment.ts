import { api } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AppointmentResponse } from "../types/AppointmentResponse";

type UpdateAppointmentPayload = {
  id: number;
  data: Omit<AppointmentResponse, "id">;
};

async function updateAppointment({
  id,
  data,
}: UpdateAppointmentPayload): Promise<AppointmentResponse> {
  const { data: response } = await api.put<AppointmentResponse>(
    `/agendamentos/${id}`,
    data,
  );
  return response;
}

export function useUpdateAppointment() {
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: updateAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
    onError: (error: Error) => {
      console.error("Erro ao atualizar agendamento:", error);
    },
  });

  return {
    updateAppointment: updateMutation.mutateAsync,
  };
}
