import { z } from "zod";

const isoDate = z.iso.date("Data inválida (use AAAA-MM-DD)");

export const receivableStatusSchema = z.enum([
  "todos",
  "pendente",
  "vencido",
  "recebido",
]);

export const listReceivablesQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z
    .union([z.literal("all"), z.coerce.number().int().positive().max(100)])
    .optional()
    .default(10),
  status: receivableStatusSchema.optional().default("todos"),
  search: z.string().trim().max(150).optional(),
});

export const createReceivableSchema = z.object({
  cliente_id: z.number().int().positive(),
  contrato_id: z.number().int().positive().nullable().optional(),
  pagamento_id: z.number().int().positive().nullable().optional(),
  descricao: z.string().trim().max(255).nullable().optional(),
  valor: z.number().positive("Valor deve ser maior que zero"),
  data_emissao: isoDate.nullable().optional(),
  data_vencimento: isoDate,
});

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

export type ReceivableStatus = "pendente" | "vencido" | "recebido";

export type ReceivableRow = {
  id: number;
  cliente_id: number;
  cliente_nome: string;
  contrato_id: number | null;
  pagamento_id: number | null;
  descricao: string | null;
  valor: number;
  data_emissao: string | null;
  data_vencimento: string | null;
  data_pagamento: string | null;
  status: ReceivableStatus;
  forma_pagamento: string | null;
  juros: number;
  multa: number;
  desconto: number;
  valor_pago: number;
};

export type ReceivableSummary = {
  total_a_receber: number;
  a_vencer: number;
  vencido: number;
  recebido_mes: number;
};

export type PaginatedReceivables = {
  data: ReceivableRow[];
  pagination: {
    actual_page: number;
    limit_per_page: number | "all";
    total: number;
    total_pages: number;
    has_next: boolean;
  };
};
