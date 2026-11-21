import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { AppointmentResponse } from "../types/AppointmentResponse";

type ChangeAppointmentStatusPayload = {
  id: number;
  status: "CONCLUIDA" | "CANCELADA";
};

async function changeAppointmentStatus({
  id,
  status,
}: ChangeAppointmentStatusPayload): Promise<AppointmentResponse> {
  const { data } = await api.patch<AppointmentResponse>(
    `/agendamentos/${id}/status`,
    { status },
  );
  return data;
}

export function useChangeAppointmentStatus() {
  const queryClient = useQueryClient();

  const changeStatusMutation = useMutation({
    mutationFn: changeAppointmentStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
    onError: (error: Error) => {
      console.error("Erro ao alterar status do agendamento:", error);
    },
  });

  return {
    changeAppointmentStatus: changeStatusMutation.mutateAsync,
  };
}
