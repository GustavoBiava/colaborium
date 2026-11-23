import { z } from "zod";

export const contractSchema = z.object({
  cliente_id: z
    .number({ message: "O cliente é obrigatório" })
    .min(1, "O cliente é obrigatório"),
  salas: z
    .array(z.number().min(1, "Sala inválida"))
    .min(1, "Selecione ao menos uma sala"),
  periodo: z
    .number({ message: "O período é obrigatório" })
    .int("O período deve ser um número inteiro")
    .min(1, "O período deve ser entre 1 e 12 meses")
    .max(12, "O período deve ser entre 1 e 12 meses"),
  valor_base: z
    .number({ message: "O valor é obrigatório" })
    .nonnegative("O valor não pode ser negativo"),
  data_inicio: z
    .string({ message: "A data de início é obrigatória" })
    .min(1, "A data de início é obrigatória"),
  data_fim: z
    .string({ message: "A data de fim é obrigatória" })
    .min(1, "A data de fim é obrigatória"),
  observacao: z.string().max(500).optional(),
});

export type ContractFormData = z.infer<typeof contractSchema>;
