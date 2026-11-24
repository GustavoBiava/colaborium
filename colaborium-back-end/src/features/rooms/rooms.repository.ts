import { db } from "../../config/database.js";

export type RoomInput = {
  nome: string;
  descricao?: string | null;
  capacidade: number;
  valor: number;
  localizacao?: string | null;
  qtd_arcondicionado: number;
  qtd_cadeira: number;
  qtd_mesa: number;
  ocupada?: boolean;
};

export async function createRoom(data: RoomInput) {
  const result = await db.query(
    `INSERT INTO sala (
      nome, descricao, capacidade, valor,
      localizacao, qtd_arcondicionado,
      qtd_cadeira, qtd_mesa, ocupada
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
    RETURNING *`,
    [
      data.nome,
      data.descricao ?? null,
      data.capacidade,
      data.valor,
      data.localizacao ?? null,
      data.qtd_arcondicionado,
      data.qtd_cadeira,
      data.qtd_mesa,
      data.ocupada ?? false,
    ],
  );

  return result.rows[0];
}

export async function listRooms(incluirInativos: boolean) {
  const result = incluirInativos
    ? await db.query("SELECT * FROM sala ORDER BY id")
    : await db.query("SELECT * FROM sala WHERE ativo = true ORDER BY id");

  return result.rows;
}

// Lista salas ativas sem conflito de contrato no período informado.
export async function listAvailableRooms(
  dataInicio: string,
  dataFim: string
) {
  const result = await db.query(
    `SELECT s.*
     FROM sala s
     WHERE s.ativo = true
       AND NOT EXISTS (
         SELECT 1
         FROM contrato c
         JOIN contrato_sala cs ON cs.contrato_id = c.id
         WHERE cs.sala_id = s.id
           AND c.status = 'A'
           AND c.data_inicio <= $2::date
           AND COALESCE(c.data_fim, 'infinity'::date) >= $1::date
       )
     ORDER BY s.id`,
    [dataInicio, dataFim]
  );

  return result.rows;
}

export async function findRoomById(id: number) {
  const result = await db.query("SELECT * FROM sala WHERE id = $1", [id]);

  return result.rows[0] ?? null;
}

export async function updateRoom(id: number, data: RoomInput) {
  const result = await db.query(
    `UPDATE sala SET
      nome = $1,
      descricao = $2,
      capacidade = $3,
      valor = $4,
      localizacao = $5,
      qtd_arcondicionado = $6,
      qtd_cadeira = $7,
      qtd_mesa = $8
      WHERE id = $9
    RETURNING *`,
    [
      data.nome,
      data.descricao ?? null,
      data.capacidade,
      data.valor,
      data.localizacao ?? null,
      data.qtd_arcondicionado,
      data.qtd_cadeira,
      data.qtd_mesa,
      id,
    ],
  );

  return result.rows[0] ?? null;
}

export async function updateRoomActive(id: number, ativo: boolean) {
  const result = await db.query(
    `UPDATE sala
     SET ativo = $1
     WHERE id = $2
     RETURNING *`,
    [ativo, id],
  );

  return result.rows[0] ?? null;
}

export async function hasAnyContract(id: number): Promise<boolean> {
  const result = await db.query(
    `SELECT EXISTS (
       SELECT 1
       FROM contrato_sala
       WHERE sala_id = $1
     ) AS possui_contrato`,
    [id],
  );

  return result.rows[0].possui_contrato;
}

// EXCLUIR SALA
export async function deleteRoom(id: number) {
  const result = await db.query(
    `DELETE FROM sala
     WHERE id = $1
     RETURNING id`,
    [id],
  );

  return result.rows[0] ?? null;
}
