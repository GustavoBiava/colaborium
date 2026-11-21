import type { AppointmentFormData } from "../schema/appointmentSchema";

export type AppointmentResponse = Omit<AppointmentFormData, "data"> & {
  data: string;
  id: string;
};
