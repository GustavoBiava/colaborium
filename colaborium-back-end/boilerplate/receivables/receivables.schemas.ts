import { z } from "zod";

// data no formato YYYY-MM-DD
const isoDate = z.iso.date("Data inválida (use AAAA-MM-DD)");

// status que a tela enxerga (calculado, não é o valor cru da coluna)
export const receivableStatusSchema = z.enum([
  "todos",
  "pendente",
  "vencido",
  "recebido",
]);

// querystring da listagem
export const listReceivablesQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z
    .union([
      z.literal("all"),
      z.coerce.number().int().positive().max(100),
    ])
    .optional()
    .default(10),
  status: receivableStatusSchema.optional().default("todos"),
  search: z.string().trim().max(150).optional(),
});

// body: nova conta manual
export const createReceivableSchema = z.object({
  cliente_id: z.number().int().positive(),
  contrato_id: z.number().int().positive().nullable().optional(),
  pagamento_id: z.number().int().positive().nullable().optional(),
  descricao: z.string().trim().max(255).nullable().optional(),
  valor: z.number().positive("Valor deve ser maior que zero"),
  data_emissao: isoDate.nullable().optional(),
  data_vencimento: isoDate,
});

// body: dar baixa
export const settleReceivableSchema = z.object({
  data_pagamento: isoDate,
  forma_pagamento: z.string().trim().min(1).max(50),
  juros: z.number().min(0).default(0),
  multa: z.number().min(0).default(0),
  desconto: z.number().min(0).default(0),
  valor_pago: z.number().positive("Valor pago deve ser maior que zero"),
});

export const receivableIdParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export type ReceivableStatusFilter = z.infer<typeof receivableStatusSchema>;
export type ListReceivablesQuery = z.infer<typeof listReceivablesQuerySchema>;
export type CreateReceivableDTO = z.infer<typeof createReceivableSchema>;
export type SettleReceivableDTO = z.infer<typeof settleReceivableSchema>;
