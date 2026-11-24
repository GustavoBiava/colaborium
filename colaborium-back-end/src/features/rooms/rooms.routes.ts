
import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

import * as controller from "./rooms.controller.js";

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

// Validação da querystring de listagem
const listarSalasQuerySchema = z.object({
  incluirInativos: z.enum(["true", "false"]).default("false").transform((value) => value === "true"),
});

// Valida uma data real no formato AAAA-MM-DD.
const dateSchema = z.string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Use AAAA-MM-DD")
  .refine((value) => {
    const date = new Date(`${value}T00:00:00.000Z`);

    return !Number.isNaN(date.getTime())
      && date.toISOString().slice(0, 10) === value;
  }, "Data inválida");

// Validação da querystring de disponibilidade
const disponibilidadeQuerySchema = z.object({
  data_inicio: dateSchema,
  data_fim: dateSchema,
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
      querystring: listarSalasQuerySchema,
    },
  }, async (request, reply) => {
    return controller.listar(request.query.incluirInativos, reply);
  });

  // LISTAR SALAS DISPONÍVEIS NO PERÍODO
  app.get("/salas/disponiveis", {
    schema: {
      tags: ["Salas"],
      summary: "Listar salas disponíveis em um período",
      querystring: disponibilidadeQuerySchema,
    },
  }, async (request, reply) => {
    return controller.listarDisponiveis(
      request.query.data_inicio,
      request.query.data_fim,
      reply
    );
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

  // EXCLUIR SALA
  app.delete("/salas/:id", {
    schema: {
      tags: ["Salas"],
      summary: "Excluir sala",
      params: idSchema,
    },
  }, async (request, reply) => {
    return controller.excluir(
      request.params.id,
      reply
    );
  });

}
