
import type { PoolClient } from "pg";
import { db } from "../../config/database";

export type ContractInput = {
  cliente_id: number;
  data_inicio: string;
  data_fim: string;
  valor_base: number;
  periodo: string;
  observacao?: string | null;
  salas: number[];
};

export type ContractFilters = {
  cliente_id?: number;
  sala_id?: number;
  status?: "A" | "F" | "C";
};

export class ContractError extends Error {
  constructor(
    public statusCode: number,
    message: string
  ) {
    super(message);
    this.name = "ContractError";
  }
}

// Utiliza uma única conexão por transação.
async function transaction<T>(
  operation: (client: PoolClient) => Promise<T>
): Promise<T> {
  const client = await db.connect();

  try {
    await client.query("BEGIN");

    const result = await operation(client);

    await client.query("COMMIT");
    return result;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

// Consulta o contrato com suas salas.
const contractSelect = `
  SELECT
    c.*,
    COALESCE(
      (
        SELECT json_agg(
          json_build_object(
            'sala_id', cs.sala_id,
            'nome', s.nome,
            'valor_negociado', cs.valor_negociado
          )
          ORDER BY cs.sala_id
        )
        FROM contrato_sala cs
        JOIN sala s ON s.id = cs.sala_id
        WHERE cs.contrato_id = c.id
      ),
      '[]'::json
    ) AS salas
  FROM contrato c
`;

export async function findContractById(id: number) {
  const result = await db.query(
    `${contractSelect} WHERE c.id = $1`,
    [id]
  );

  return result.rows[0] ?? null;
}

export async function listContracts(
  filters: ContractFilters
) {
  const result = await db.query(
    `${contractSelect}
     WHERE ($1::integer IS NULL OR c.cliente_id = $1)
       AND ($2::varchar IS NULL OR c.status = $2)
       AND (
         $3::integer IS NULL
         OR EXISTS (
           SELECT 1 FROM contrato_sala cs
           WHERE cs.contrato_id = c.id
             AND cs.sala_id = $3
         )
       )
     ORDER BY c.id`,
    [
      filters.cliente_id ?? null,
      filters.status ?? null,
      filters.sala_id ?? null,
    ]
  );

  return result.rows;
}

// Confirma se o cliente existe e está ativo.
async function checkClient(
  client: PoolClient,
  clienteId: number
) {
  const result = await client.query(
    "SELECT id, ativo FROM cliente WHERE id = $1",
    [clienteId]
  );

  if (!result.rows.length) {
    throw new ContractError(404, "Cliente não encontrado");
  }

  if (!result.rows[0].ativo) {
    throw new ContractError(409, "Cliente inativo");
  }
}

// Bloqueia as salas na transação e verifica se existem.
async function lockRooms(
  client: PoolClient,
  salas: number[]
) {
  const ids = [...new Set(salas)].sort((a, b) => a - b);

  const result = await client.query(
    `SELECT id, ativo
     FROM sala
     WHERE id = ANY($1::integer[])
     ORDER BY id
     FOR UPDATE`,
    [ids]
  );

  if (result.rows.length !== ids.length) {
    throw new ContractError(
      404,
      "Uma ou mais salas não foram encontradas"
    );
  }

  if (result.rows.some((room) => !room.ativo)) {
    throw new ContractError(
      409,
      "Não é possível contratar uma sala inativa"
    );
  }
}

// Verifica conflito de períodos.
// As datas inicial e final são inclusivas.
async function checkAvailability(
  client: PoolClient,
  salas: number[],
  inicio: string,
  fim: string,
  excludeId?: number
) {
  const result = await client.query(
    `SELECT c.id AS contrato_id, cs.sala_id
     FROM contrato c
     JOIN contrato_sala cs
       ON cs.contrato_id = c.id
     WHERE cs.sala_id = ANY($1::integer[])
       AND c.status = 'A'
       AND c.id <> COALESCE($4::integer, -1)
       AND c.data_inicio <= $3::date
       AND COALESCE(c.data_fim, 'infinity'::date)
           >= $2::date
     LIMIT 1`,
    [salas, inicio, fim, excludeId ?? null]
  );

  if (result.rows.length > 0) {
    const conflict = result.rows[0];

    throw new ContractError(
      409,
      `Sala ${conflict.sala_id} possui conflito com o contrato ${conflict.contrato_id}`
    );
  }
}

// Salva os vínculos entre contrato e salas.
async function insertContractRooms(
  client: PoolClient,
  contratoId: number,
  salas: number[]
) {
  for (const salaId of salas) {
    await client.query(
      `INSERT INTO contrato_sala
         (contrato_id, sala_id)
       VALUES ($1, $2)`,
      [contratoId, salaId]
    );
  }
}

// CADASTRAR
export async function createContract(data: ContractInput) {
  const id = await transaction(async (client) => {
    await checkClient(client, data.cliente_id);
    await lockRooms(client, data.salas);

    await checkAvailability(
      client,
      data.salas,
      data.data_inicio,
      data.data_fim
    );

    const result = await client.query(
      `INSERT INTO contrato (
        cliente_id,
        data_inicio,
        data_fim,
        valor_base,
        periodo,
        observacao,
        status,
        ativo
      )
      VALUES ($1, $2, $3, $4, $5, $6, 'A', TRUE)
      RETURNING id`,
      [
        data.cliente_id,
        data.data_inicio,
        data.data_fim,
        data.valor_base,
        data.periodo,
        data.observacao ?? null,
      ]
    );

    const contratoId = result.rows[0].id as number;

    await insertContractRooms(
      client,
      contratoId,
      data.salas
    );

    return contratoId;
  });

  return findContractById(id);
}

// ALTERAR
export async function updateContract(
  id: number,
  data: ContractInput
) {
  await transaction(async (client) => {
    const current = await client.query(
      `SELECT id, status
       FROM contrato
       WHERE id = $1
       FOR UPDATE`,
      [id]
    );

    if (!current.rows.length) {
      throw new ContractError(404, "Contrato não encontrado");
    }

    if (current.rows[0].status !== "A") {
      throw new ContractError(
        409,
        "Somente contratos ativos podem ser alterados"
      );
    }

    await checkClient(client, data.cliente_id);
    await lockRooms(client, data.salas);

    await checkAvailability(
      client,
      data.salas,
      data.data_inicio,
      data.data_fim,
      id
    );

    await client.query(
      `UPDATE contrato
       SET cliente_id = $1,
           data_inicio = $2,
           data_fim = $3,
           valor_base = $4,
           periodo = $5,
           observacao = $6
       WHERE id = $7`,
      [
        data.cliente_id,
        data.data_inicio,
        data.data_fim,
        data.valor_base,
        data.periodo,
        data.observacao ?? null,
        id,
      ]
    );

    await client.query(
      "DELETE FROM contrato_sala WHERE contrato_id = $1",
      [id]
    );

    await insertContractRooms(client, id, data.salas);
  });

  return findContractById(id);
}

// FINALIZAR OU CANCELAR
export async function changeContractStatus(
  id: number,
  status: "F" | "C",
  motivo?: string
) {
  await transaction(async (client) => {
    const result = await client.query(
      `SELECT status
       FROM contrato
       WHERE id = $1
       FOR UPDATE`,
      [id]
    );

    if (!result.rows.length) {
      throw new ContractError(404, "Contrato não encontrado");
    }

    if (result.rows[0].status !== "A") {
      throw new ContractError(
        409,
        "O contrato já foi finalizado ou cancelado"
      );
    }

    await client.query(
      `UPDATE contrato
       SET status = $1,
           ativo = FALSE,
           data_cancelamento =
             CASE WHEN $1 = 'C' THEN CURRENT_DATE
                  ELSE NULL END,
           motivo_cancelamento =
             CASE WHEN $1 = 'C' THEN $2
                  ELSE NULL END
       WHERE id = $3`,
      [status, motivo ?? null, id]
    );
  });

  return findContractById(id);
}
