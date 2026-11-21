export const AppointmentStatus = {
  AGENDADA: "AGENDADA",
  REALIZADA: "REALIZADA",
  CANCELADA: "CANCELADA",
} as const;

export type AppointmentStatus =
  (typeof AppointmentStatus)[keyof typeof AppointmentStatus];

export const APPOINTMENT_STATUS_LABELS: Record<AppointmentStatus, string> = {
  AGENDADA: "Agendada",
  REALIZADA: "Realizada",
  CANCELADA: "Cancelada",
};
