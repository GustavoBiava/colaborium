import { db } from "../../src/config/database";
import { ReceivableError } from "./receivables.errors";
import { withTransaction } from "./receivables.transaction";
import { PAYMENT_PAID_STATUS } from "./receivables.constants";
import type { ReceivableRow, ReceivableSummary } from "./receivables.types";
import type {
  CreateReceivableDTO,
  ReceivableStatusFilter,
  SettleReceivableDTO,
} from "./receivables.schemas";

// filtros já validados pela rota
type ReceivableFilters = {
  status: ReceivableStatusFilter;
  search?: string;
};

// status calculado: pago > vencido (data passou) > pendente
const STATUS_SQL = `
  CASE
    WHEN cr.data_pagamento IS NOT NULL THEN 'recebido'
    WHEN cr.data_vencimento < CURRENT_DATE THEN 'vencido'
    ELSE 'pendente'
  END
`;

// conta cancelada nunca aparece na tela
const NOT_CANCELED_SQL = `COALESCE(cr.status, '') <> 'cancelado'`;

// numeric vira float8 e date vira texto, pra json sair limpo
const SELECT_ROW = `
  SELECT
    cr.id,
    cr.cliente_id,
    c.nome_empresa AS cliente_nome,
    cr.contrato_id,
    cr.pagamento_id,
    cr.descricao,
    cr.valor::float8 AS valor,
    to_char(cr.data_emissao, 'YYYY-MM-DD') AS data_emissao,
    to_char(cr.data_vencimento, 'YYYY-MM-DD') AS data_vencimento,
    to_char(cr.data_pagamento, 'YYYY-MM-DD') AS data_pagamento,
    ${STATUS_SQL} AS status,
    cr.forma_pagamento,
    cr.juros::float8 AS juros,
    cr.multa::float8 AS multa,
    cr.desconto::float8 AS desconto,
    cr.valor_pago::float8 AS valor_pago
  FROM public.conta_receber cr
  JOIN public.cliente c ON c.id = cr.cliente_id
`;

// monta WHERE + params a partir dos filtros
function buildWhere(filters: ReceivableFilters) {
  const conditions: string[] = [NOT_CANCELED_SQL];
  const params: unknown[] = [];

  if (filters.status !== "todos") {
    params.push(filters.status);
    conditions.push(`(${STATUS_SQL}) = $${params.length}`);
  }

  if (filters.search) {
    params.push(`%${filters.search}%`);
    conditions.push(
      `(c.nome_empresa ILIKE $${params.length} OR cr.descricao ILIKE $${params.length})`,
    );
  }

  return { where: `WHERE ${conditions.join(" AND ")}`, params };
}

class ReceivableRepository {
  // lista página. limit null = sem paginar
  async list(
    filters: ReceivableFilters,
    limit: number | null,
    offset: number,
  ): Promise<ReceivableRow[]> {
    const { where, params } = buildWhere(filters);
    let query = `${SELECT_ROW} ${where} ORDER BY cr.data_vencimento ASC NULLS LAST, cr.id ASC`;

    if (limit !== null) {
      params.push(limit, offset);
      query += ` LIMIT $${params.length - 1} OFFSET $${params.length}`;
    }

    const result = await db.query<ReceivableRow>(query, params);
    return result.rows;
  }

  // total de registros com os mesmos filtros
  async count(filters: ReceivableFilters): Promise<number> {
    const { where, params } = buildWhere(filters);
    const result = await db.query<{ total: number }>(
      `SELECT COUNT(*)::int AS total
       FROM public.conta_receber cr
       JOIN public.cliente c ON c.id = cr.cliente_id
       ${where}`,
      params,
    );
    return result.rows[0]?.total ?? 0;
  }

  // 4 totais dos cards
  async summary(): Promise<ReceivableSummary> {
    const result = await db.query<ReceivableSummary>(
      `SELECT
         COALESCE(SUM(valor) FILTER (WHERE status <> 'recebido'), 0)::float8 AS total_a_receber,
         COALESCE(SUM(valor) FILTER (WHERE status = 'pendente'), 0)::float8 AS a_vencer,
         COALESCE(SUM(valor) FILTER (WHERE status = 'vencido'), 0)::float8 AS vencido,
         COALESCE(SUM(valor_pago) FILTER (
           WHERE status = 'recebido'
           AND date_trunc('month', data_pagamento)::date = date_trunc('month', CURRENT_DATE)::date
         ), 0)::float8 AS recebido_mes
       FROM (
         SELECT cr.valor, cr.valor_pago, cr.data_pagamento, ${STATUS_SQL} AS status
         FROM public.conta_receber cr
         WHERE ${NOT_CANCELED_SQL}
       ) t`,
    );
    return (
      result.rows[0] ?? {
        total_a_receber: 0,
        a_vencer: 0,
        vencido: 0,
        recebido_mes: 0,
      }
    );
  }

  // busca uma conta pelo id (com nome do cliente)
  async findById(id: number): Promise<ReceivableRow | null> {
    const result = await db.query<ReceivableRow>(
      `${SELECT_ROW} WHERE cr.id = $1`,
      [id],
    );
    return result.rows[0] ?? null;
  }

  // confere se cliente existe
  async clientExists(clienteId: number): Promise<boolean> {
    const result = await db.query(
      `SELECT 1 FROM public.cliente WHERE id = $1`,
      [clienteId],
    );
    return result.rowCount !== 0;
  }

  // confere se contrato existe
  async contractExists(contratoId: number): Promise<boolean> {
    const result = await db.query(
      `SELECT 1 FROM public.contrato WHERE id = $1`,
      [contratoId],
    );
    return result.rowCount !== 0;
  }

  // confere se parcela (pagamento) existe
  async paymentExists(pagamentoId: number): Promise<boolean> {
    const result = await db.query(
      `SELECT 1 FROM public.pagamento WHERE id = $1`,
      [pagamentoId],
    );
    return result.rowCount !== 0;
  }

  // cria conta manual, nasce pendente
  async create(data: CreateReceivableDTO): Promise<number> {
    const result = await db.query<{ id: number }>(
      `INSERT INTO public.conta_receber (
         cliente_id, contrato_id, pagamento_id, descricao,
         valor, data_emissao, data_vencimento, status
       )
       VALUES ($1, $2, $3, $4, $5, COALESCE($6::date, CURRENT_DATE), $7, 'pendente')
       RETURNING id`,
      [
        data.cliente_id,
        data.contrato_id ?? null,
        data.pagamento_id ?? null,
        data.descricao ?? null,
        data.valor,
        data.data_emissao ?? null,
        data.data_vencimento,
      ],
    );
    const id = result.rows[0]?.id;
    if (!id) throw new ReceivableError(500, "Falha ao criar conta");
    return id;
  }

  // dá baixa na conta e marca parcela ligada como paga. tudo numa transação
  async settle(id: number, data: SettleReceivableDTO): Promise<void> {
    await withTransaction(async (client) => {
      // trava a linha pra evitar baixa dupla
      const current = await client.query<{
        pagamento_id: number | null;
        data_pagamento: string | null;
        status: string | null;
      }>(
        `SELECT pagamento_id, data_pagamento, status
         FROM public.conta_receber
         WHERE id = $1
         FOR UPDATE`,
        [id],
      );

      const row = current.rows[0];

      if (!row) throw new ReceivableError(404, "Conta não encontrada");
      if (row.status === "cancelado")
        throw new ReceivableError(409, "Conta cancelada não pode receber baixa");
      if (row.data_pagamento)
        throw new ReceivableError(409, "Conta já recebida");

      await client.query(
        `UPDATE public.conta_receber
         SET status = 'recebido',
             data_pagamento = $2,
             forma_pagamento = $3,
             juros = $4,
             multa = $5,
             desconto = $6,
             valor_pago = $7
         WHERE id = $1`,
        [
          id,
          data.data_pagamento,
          data.forma_pagamento,
          data.juros,
          data.multa,
          data.desconto,
          data.valor_pago,
        ],
      );

      if (row.pagamento_id) {
        // mesma transação da baixa: se falhar, nada é gravado
        await client.query(
          `UPDATE public.pagamento SET status = $2 WHERE id = $1`,
          [row.pagamento_id, PAYMENT_PAID_STATUS],
        );
      }
    });
  }
}

export default new ReceivableRepository();
