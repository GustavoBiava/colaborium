import { z } from "zod";

// valor numérico >= 0 (juros, multa, desconto)
const moneyField = (label: string) =>
  z
    .number({ error: () => `${label} inválido` })
    .min(0, `${label} não pode ser negativo`);

// form "Dar baixa"
export const settleReceivableSchema = z.object({
  data_pagamento: z
    .string({ error: () => "Data do pagamento obrigatória" })
    .min(1, "Data do pagamento obrigatória"),
  forma_pagamento: z
    .string({ error: () => "Forma de pagamento obrigatória" })
    .min(1, "Forma de pagamento obrigatória"),
  juros: moneyField("Juros"),
  multa: moneyField("Multa"),
  desconto: moneyField("Desconto"),
  valor_pago: z
    .number({ error: () => "Valor pago obrigatório" })
    .positive("Valor pago deve ser maior que zero"),
});

export type SettleReceivableFormData = z.infer<typeof settleReceivableSchema>;
