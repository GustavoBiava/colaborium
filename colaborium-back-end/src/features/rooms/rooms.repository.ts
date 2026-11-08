
import { db } from "../../config/database";

export type RoomInput = {
  nome: string;
  descricao?: string | null;
  capacidade: number;
  valor: number;
  localizacao?: string | null;
  qtd_arcondicionado: number;
  qtd_cadeira: number;
  qtd_mesa: number;
};

export async function createRoom(data: RoomInput) {
  const result = await db.query(
    `INSERT INTO sala (
      nome, descricao, capacidade, valor,
      localizacao, qtd_arcondicionado,
      qtd_cadeira, qtd_mesa
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
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
    ]
  );

  return result.rows[0];
}

export async function listRooms() {
  const result = await db.query(
    "SELECT * FROM sala ORDER BY id"
  );

  return result.rows;
}

export async function findRoomById(id: number) {
  const result = await db.query(
    "SELECT * FROM sala WHERE id = $1",
    [id]
  );

  return result.rows[0] ?? null;
}

export async function updateRoom(
  id: number,
  data: RoomInput
) {
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
    ]
  );

  return result.rows[0] ?? null;
}

export async function updateRoomActive(
  id: number,
  ativo: boolean
) {
  const result = await db.query(
    `UPDATE sala
     SET ativo = $1
     WHERE id = $2
     RETURNING *`,
    [ativo, id]
  );

  return result.rows[0] ?? null;
}
