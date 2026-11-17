import type { AppointmentResponse } from "../types/AppointmentResponse";

type CalendarEvent = {
  id: string;
  title: string;
  start: string;
  end?: string;
  allDay?: boolean;
};

export function appointmentToEvent(ap: AppointmentResponse): CalendarEvent {
  return {
    id: String(ap.id),
    title: ap.finalidade,
    start: `${ap.data}T${ap.inicio}`,
    end: `${ap.data}T${ap.fim}`,
  };
}
