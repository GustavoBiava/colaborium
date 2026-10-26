import { z } from "zod";

export const calendarSchema = z.object({
  cliente_id: z.string().min(1, "Cliente obrigatório"),
  data: z.string().min(1, "Data obrigatória"),
  inicio: z.string().min(1, "Horário de início obrigatório"),
  fim: z.string().min(1, "Horário de fim obrigatório"),
  finalidade: z.string().min(1, "Finalidade obrigatória"),
  status: z.string().min(1, "Status obrigatório"),
  observacao: z.string().optional(),
  contratual: z.boolean().optional(),
});

export type CalendarFormData = z.infer<typeof calendarSchema>;
