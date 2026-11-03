
import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

import * as controller from "./rooms.controller";

// Validação dos dados da sala
const salaSchema = z.object({
  nome: z.string().trim().min(1).max(100),
  descricao: z.string().nullable().optional(),
  capacidade: z.number().int().positive(),
  valor: z.number().nonnegative(),
  localizacao: z.string().max(150).nullable().optional(),
  qtd_arcondicionado: z.number().int().nonnegative().default(0),
  qtd_cadeira: z.number().int().nonnegative().default(0),
  qtd_mesa: z.number().int().nonnegative().default(0),
});

// Validação do ID
const idSchema = z.object({
  id: z.coerce.number().int().positive(),
});

// Validação da situação
const situacaoSchema = z.object({
  ativo: z.boolean(),
});

export async function roomsRoutes(instance: FastifyInstance) {
  const app = instance.withTypeProvider<ZodTypeProvider>();

  // CADASTRAR SALA
  app.post("/salas", {
    schema: {
      tags: ["Salas"],
      summary: "Cadastrar nova sala",
      body: salaSchema,
    },
  }, async (request, reply) => {
    return controller.cadastrar(request.body, reply);
  });

  // LISTAR SALAS
  app.get("/salas", {
    schema: {
      tags: ["Salas"],
      summary: "Listar todas as salas",
    },
  }, async (_request, reply) => {
    return controller.listar(reply);
  });

  // CONSULTAR SALA POR ID
  app.get("/salas/:id", {
    schema: {
      tags: ["Salas"],
      summary: "Consultar sala por ID",
      params: idSchema,
    },
  }, async (request, reply) => {
    return controller.buscar(request.params.id, reply);
  });

  // ALTERAR SALA
  app.put("/salas/:id", {
    schema: {
      tags: ["Salas"],
      summary: "Alterar dados de uma sala",
      params: idSchema,
      body: salaSchema,
    },
  }, async (request, reply) => {
    return controller.alterar(
      request.params.id,
      request.body,
      reply
    );
  });

  // ATIVAR OU DESATIVAR SALA
  app.patch("/salas/:id/ativo", {
    schema: {
      tags: ["Salas"],
      summary: "Ativar ou desativar uma sala",
      params: idSchema,
      body: situacaoSchema,
    },
  }, async (request, reply) => {
    return controller.alterarSituacao(
      request.params.id,
      request.body.ativo,
      reply
    );
  });
}
