
import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

import * as controller from "./contracts.controller";

// Valida uma data real no formato AAAA-MM-DD.
const dateSchema = z.string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Use AAAA-MM-DD")
  .refine((value) => {
    const date = new Date(`${value}T00:00:00.000Z`);

    return !Number.isNaN(date.getTime())
      && date.toISOString().slice(0, 10) === value;
  }, "Data inválida");

// Valida o ID da URL.
const idSchema = z.object({
  id: z.coerce.number().int().positive().max(2147483647),
});

// Dados para cadastrar ou alterar contrato.
const contractSchema = z.object({
  cliente_id: z.number().int().positive(),
  data_inicio: dateSchema,
  data_fim: dateSchema,
  valor_base: z.number().nonnegative(),
  periodo: z.string().trim().min(1).max(50),

  observacao: z.string().nullable().optional(),

  salas: z.array(
    z.number().int().positive()
  ).min(1, "Informe pelo menos uma sala"),
});

// Filtros de listagem.
const filtersSchema = z.object({
  cliente_id: z.coerce.number().int().positive().optional(),
  sala_id: z.coerce.number().int().positive().optional(),
  status: z.enum(["A", "F", "C"]).optional(),
});

// Finalização ou cancelamento.
const statusSchema = z.object({
  status: z.enum(["F", "C"]),
  motivo_cancelamento: z.string().max(255).optional(),
});

export async function contractsRoutes(
  instance: FastifyInstance
) {
  const app = instance.withTypeProvider<ZodTypeProvider>();

  // CADASTRAR CONTRATO
  app.post("/contratos", {
    schema: {
      tags: ["Contratos"],
      summary: "Cadastrar contrato",
      description:
        "Cria um contrato e vincula uma ou mais salas.",
      body: contractSchema,
    },
  }, async (request, reply) => {
    return controller.cadastrar(request.body, reply);
  });

  // LISTAR CONTRATOS
  app.get("/contratos", {
    schema: {
      tags: ["Contratos"],
      summary: "Listar contratos",
      description:
        "Permite filtrar por cliente, sala e status.",
      querystring: filtersSchema,
    },
  }, async (request, reply) => {
    return controller.listar(request.query, reply);
  });

  // CONSULTAR POR ID
  app.get("/contratos/:id", {
    schema: {
      tags: ["Contratos"],
      summary: "Consultar contrato por ID",
      params: idSchema,
    },
  }, async (request, reply) => {
    return controller.buscar(request.params.id, reply);
  });

  // ALTERAR CONTRATO
  app.put("/contratos/:id", {
    schema: {
      tags: ["Contratos"],
      summary: "Alterar contrato",
      description:
        "Altera os dados e os vínculos das salas.",
      params: idSchema,
      body: contractSchema,
    },
  }, async (request, reply) => {
    return controller.alterar(
      request.params.id,
      request.body,
      reply
    );
  });

  // FINALIZAR OU CANCELAR
  app.patch("/contratos/:id/status", {
    schema: {
      tags: ["Contratos"],
      summary: "Finalizar ou cancelar contrato",
      description:
        "F = Finalizado, C = Cancelado.",
      params: idSchema,
      body: statusSchema,
    },
  }, async (request, reply) => {
    return controller.alterarStatus(
      request.params.id,
      request.body.status,
      request.body.motivo_cancelamento,
      reply
    );
  });
}
