import { z } from "zod";

// form "Nova conta"
export const receivableSchema = z
  .object({
    cliente_id: z
      .number({ error: () => "Cliente obrigatório" })
      .int()
      .positive("Cliente obrigatório"),
    descricao: z.string().trim().max(255, "Máximo 255 caracteres").optional(),
    valor: z
      .number({ error: () => "Valor obrigatório" })
      .positive("Valor deve ser maior que zero"),
    data_emissao: z
      .string({ error: () => "Emissão obrigatória" })
      .min(1, "Emissão obrigatória"),
    data_vencimento: z
      .string({ error: () => "Vencimento obrigatório" })
      .min(1, "Vencimento obrigatório"),
  })
  .refine((data) => data.data_vencimento >= data.data_emissao, {
    message: "Vencimento não pode ser antes da emissão",
    path: ["data_vencimento"],
  });

export type ReceivableFormData = z.infer<typeof receivableSchema>;
