import { z } from "zod";

export const appointmentSchema = z.object({
  cliente_id: z.number({ message: "O cliente é obrigatório" }),
  sala_id: z.number().min(1, "Sala é obrigatória"),
  data: z
    .date({ message: "A data é obrigatória" })
    .refine((date) => date >= new Date(), {
      message: "A data não pode ser anterior à data atual",
    }),
  inicio: z.string({ message: "O horário de início é obrigatório" }).min(1, {
    message: "O horário de início é obrigatório",
  }),
  fim: z.string({ message: "O horário de fim é obrigatório" }).min(1, {
    message: "O horário de fim é obrigatório",
  }),
  finalidade: z.string({ message: "A finalidade é obrigatória" }),
  status: z.string({ message: "O status é obrigatório" }),
  observacao: z.string().optional(),
  contratual: z.boolean().optional(),
});

export type AppointmentFormData = z.infer<typeof appointmentSchema>;
