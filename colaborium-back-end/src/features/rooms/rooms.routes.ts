
import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { db } from "../../config/database";

export async function roomsRoutes(app: FastifyInstance) {

  // CADASTRAR SALA
  app.post("/salas", {
    schema: {
      tags: ["Salas"],
      summary: "Cadastrar nova sala",
      body: z.object({
        nome: z.string().min(1).max(100),
        descricao: z.string().optional(),
        capacidade: z.number().int().positive(),
        valor: z.number().nonnegative(),
        localizacao: z.string().optional(),
        qtd_arcondicionado: z.number().int().nonnegative().default(0),
        qtd_cadeira: z.number().int().nonnegative().default(0),
        qtd_mesa: z.number().int().nonnegative().default(0),
      }),
    },
  }, async (request, reply) => {
    const dados = request.body as {
      nome: string;
      descricao?: string;
      capacidade: number;
      valor: number;
      localizacao?: string;
      qtd_arcondicionado: number;
      qtd_cadeira: number;
      qtd_mesa: number;
    };

    const resultado = await db.query(
      `INSERT INTO sala (
        nome, descricao, capacidade, valor,
        localizacao, qtd_arcondicionado,
        qtd_cadeira, qtd_mesa
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *`,
      [
        dados.nome,
        dados.descricao ?? null,
        dados.capacidade,
        dados.valor,
        dados.localizacao ?? null,
        dados.qtd_arcondicionado,
        dados.qtd_cadeira,
        dados.qtd_mesa,
      ]
    );

    return reply.status(201).send(resultado.rows[0]);
  });

  // LISTAR SALAS
  app.get("/salas", {
    schema: {
      tags: ["Salas"],
      summary: "Listar todas as salas",
    },
  }, async () => {
    const resultado = await db.query(
      "SELECT * FROM sala ORDER BY id"
    );

    return resultado.rows;
  });
}
