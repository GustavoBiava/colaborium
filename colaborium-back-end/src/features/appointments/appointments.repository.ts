
import type { PoolClient } from "pg";
import { db } from "../../config/database";

export type AppointmentInput = {
  cliente_id: number;
  sala_id: number;
  data: string;
  inicio: string;
  fim: string;
  finalidade?: string | null;
  observacao?: string | null;
  contratual: boolean;
};

export type AppointmentFilters = {
  cliente_id?: number;
  sala_id?: number;
  data?: string;
  status?: "AGENDADA" | "CONCLUIDA" | "CANCELADA";
};

export type AppointmentStatus = "CONCLUIDA" | "CANCELADA";

export class AppointmentError extends Error {
  constructor(
    public statusCode: number,
    message: string
  ) {
    super(message);
    this.name = "AppointmentError";
  }
}

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

// Consulta com informações de cliente e sala.
const selectAppointment = `
  SELECT
    a.*,
    c.nome AS cliente_nome,
    s.nome AS sala_nome
  FROM agenda_reuniao a
  JOIN cliente c ON c.id = a.cliente_id
  JOIN sala s ON s.id = a.sala_id
`;

export async function findAppointmentById(id: number) {
  const result = await db.query(
    `${selectAppointment} WHERE a.id = $1`,
    [id]
  );

  return result.rows[0] ?? null;
}

export async function listAppointments(
  filters: AppointmentFilters
) {
  const result = await db.query(
    `${selectAppointment}
     WHERE ($1::integer IS NULL OR a.cliente_id = $1)
       AND ($2::integer IS NULL OR a.sala_id = $2)
       AND ($3::date IS NULL OR a.data = $3)
       AND ($4::varchar IS NULL OR a.status = $4)
     ORDER BY a.data, a.inicio, a.id`,
    [
      filters.cliente_id ?? null,
      filters.sala_id ?? null,
      filters.data ?? null,
      filters.status ?? null,
    ]
  );

  return result.rows;
}

async function checkClient(
  client: PoolClient,
  clienteId: number
) {
  const result = await client.query(
    "SELECT ativo FROM cliente WHERE id = $1",
    [clienteId]
  );

  if (!result.rows.length) {
    throw new AppointmentError(
      404,
      "Cliente não encontrado"
    );
  }

  if (!result.rows[0].ativo) {
    throw new AppointmentError(
      409,
      "Cliente inativo"
    );
  }
}

// Bloqueia a sala durante a operação.
// Isso serializa reservas concorrentes da mesma sala.
async function lockRooms(
  client: PoolClient,
  roomIds: number[]
) {
  const ids = [...new Set(roomIds)].sort((a, b) => a - b);

  const result = await client.query(
    `SELECT id, ativo
     FROM sala
     WHERE id = ANY($1::integer[])
     ORDER BY id
     FOR UPDATE`,
    [ids]
  );

  if (result.rows.length !== ids.length) {
    throw new AppointmentError(
      404,
      "Sala não encontrada"
    );
  }

  if (result.rows.some((room) => !room.ativo)) {
    throw new AppointmentError(
      409,
      "A sala está inativa"
    );
  }
}

// Impede reuniões sobrepostas.
// Uma reunião terminando às 15h permite outra às 15h.
async function checkAvailability(
  client: PoolClient,
  data: AppointmentInput,
  excludeId?: number
) {
  const result = await client.query(
    `SELECT id
     FROM agenda_reuniao
     WHERE sala_id = $1
       AND data = $2::date
       AND status <> 'CANCELADA'
       AND inicio < $4::time
       AND fim > $3::time
       AND id <> COALESCE($5::integer, -1)
     LIMIT 1`,
    [
      data.sala_id,
      data.data,
      data.inicio,
      data.fim,
      excludeId ?? null,
    ]
  );

  if (result.rows.length) {
    throw new AppointmentError(
      409,
      `A sala já possui agendamento nesse horário (ID ${result.rows[0].id})`
    );
  }
}

export async function createAppointment(
  data: AppointmentInput
) {
  const id = await transaction(async (client) => {
    await checkClient(client, data.cliente_id);
    await lockRooms(client, [data.sala_id]);
    await checkAvailability(client, data);

    const result = await client.query(
      `INSERT INTO agenda_reuniao (
         cliente_id, sala_id, data, inicio, fim,
         finalidade, observacao, contratual, status
       )
       VALUES (
         $1, $2, $3, $4, $5, $6, $7, $8, 'AGENDADA'
       )
       RETURNING id`,
      [
        data.cliente_id,
        data.sala_id,
        data.data,
        data.inicio,
        data.fim,
        data.finalidade ?? null,
        data.observacao ?? null,
        data.contratual,
      ]
    );

    return result.rows[0].id as number;
  });

  return findAppointmentById(id);
}

export async function updateAppointment(
  id: number,
  data: AppointmentInput
) {
  await transaction(async (client) => {
    // Impede duas alterações simultâneas do mesmo agendamento.
    await client.query(
      "SELECT pg_advisory_xact_lock(400, $1)",
      [id]
    );

    const existing = await client.query(
      `SELECT sala_id, status
       FROM agenda_reuniao
       WHERE id = $1`,
      [id]
    );

    if (!existing.rows.length) {
      throw new AppointmentError(
        404,
        "Agendamento não encontrado"
      );
    }

    if (existing.rows[0].status !== "AGENDADA") {
      throw new AppointmentError(
        409,
        "Somente agendamentos pendentes podem ser alterados"
      );
    }

    await checkClient(client, data.cliente_id);

    // Bloqueia a sala antiga e a nova, em ordem fixa.
    await lockRooms(client, [
      existing.rows[0].sala_id,
      data.sala_id,
    ]);

    await checkAvailability(client, data, id);

    await client.query(
      `UPDATE agenda_reuniao SET
         cliente_id = $1,
         sala_id = $2,
         data = $3,
         inicio = $4,
         fim = $5,
         finalidade = $6,
         observacao = $7,
         contratual = $8
       WHERE id = $9`,
      [
        data.cliente_id,
        data.sala_id,
        data.data,
        data.inicio,
        data.fim,
        data.finalidade ?? null,
        data.observacao ?? null,
        data.contratual,
        id,
      ]
    );
  });

  return findAppointmentById(id);
}

export async function changeAppointmentStatus(
  id: number,
  status: AppointmentStatus
) {
  await transaction(async (client) => {
    await client.query(
      "SELECT pg_advisory_xact_lock(400, $1)",
      [id]
    );

    const result = await client.query(
      `SELECT status
       FROM agenda_reuniao
       WHERE id = $1
       FOR UPDATE`,
      [id]
    );

    if (!result.rows.length) {
      throw new AppointmentError(
        404,
        "Agendamento não encontrado"
      );
    }

    if (result.rows[0].status !== "AGENDADA") {
      throw new AppointmentError(
        409,
        "Agendamento já concluído ou cancelado"
      );
    }

    await client.query(
      `UPDATE agenda_reuniao
       SET status = $1
       WHERE id = $2`,
      [status, id]
    );
  });

  return findAppointmentById(id);
}
