import type { AppointmentFormData } from "../schema/appointmentSchema";
import type { AppointmentResponse } from "../types/AppointmentResponse";

interface AppointmentCalendarEvent {
  id: string;
  title: string;
  start: string;
  end?: string;
  allDay?: boolean;
  extendedProps: AppointmentFormData;
}

export function appointmentToEvent(
  ap: AppointmentResponse,
): AppointmentCalendarEvent {
  return {
    id: String(ap.id),
    title: ap.finalidade,
    start: `${ap.data.split("T")[0]}T${ap.inicio}`,
    end: `${ap.data.split("T")[0]}T${ap.fim}`,
    extendedProps: {
      cliente_id: ap.cliente_id,
      sala_id: ap.sala_id,
      data: new Date(ap.data),
      inicio: ap.inicio.slice(0, 5),
      fim: ap.fim.slice(0, 5),
      finalidade: ap.finalidade,
      status: ap.status,
      observacao: ap.observacao,
      contratual: ap.contratual,
    },
  };
}
