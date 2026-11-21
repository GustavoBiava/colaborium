
import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

import * as controller from "./appointments.controller";

const dateSchema = z.string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Use AAAA-MM-DD")
  .refine((value) => {
    const date = new Date(`${value}T00:00:00.000Z`);

    return !Number.isNaN(date.getTime())
      && date.toISOString().slice(0, 10) === value;
  }, "Data inválida");

const timeSchema = z.string()
  .regex(
    /^([01]\d|2[0-3]):[0-5]\d$/,
    "Use HH:MM"
  );

const idSchema = z.object({
  id: z.coerce.number().int().positive().max(2147483647),
});

const appointmentSchema = z.object({
  cliente_id: z.number().int().positive(),
  sala_id: z.number().int().positive(),
  data: dateSchema,
  inicio: timeSchema,
  fim: timeSchema,

  finalidade: z.string().max(255).nullable().optional(),
  observacao: z.string().nullable().optional(),
  contratual: z.boolean().default(false),
});

const filtersSchema = z.object({
  cliente_id: z.coerce.number().int().positive().optional(),
  sala_id: z.coerce.number().int().positive().optional(),
  data: dateSchema.optional(),
  status: z.enum([
    "AGENDADA",
    "CONCLUIDA",
    "CANCELADA",
  ]).optional(),
});

const statusSchema = z.object({
  status: z.enum(["CONCLUIDA", "CANCELADA"]),
});

export async function appointmentsRoutes(
  instance: FastifyInstance
) {
  const app = instance.withTypeProvider<ZodTypeProvider>();

  // CADASTRAR AGENDAMENTO
  app.post("/agendamentos", {
    schema: {
      tags: ["Agendamentos"],
      summary: "Cadastrar agendamento",
      body: appointmentSchema,
    },
  }, async (request, reply) => {
    return controller.cadastrar(request.body, reply);
  });

  // LISTAR AGENDAMENTOS
  app.get("/agendamentos", {
    schema: {
      tags: ["Agendamentos"],
      summary: "Listar agendamentos",
      querystring: filtersSchema,
    },
  }, async (request, reply) => {
    return controller.listar(request.query, reply);
  });

  // CONSULTAR AGENDAMENTO POR ID
  app.get("/agendamentos/:id", {
    schema: {
      tags: ["Agendamentos"],
      summary: "Consultar agendamento por ID",
      params: idSchema,
    },
  }, async (request, reply) => {
    return controller.buscar(request.params.id, reply);
  });

  // ALTERAR AGENDAMENTO
  app.put("/agendamentos/:id", {
    schema: {
      tags: ["Agendamentos"],
      summary: "Alterar agendamento",
      params: idSchema,
      body: appointmentSchema,
    },
  }, async (request, reply) => {
    return controller.alterar(
      request.params.id,
      request.body,
      reply
    );
  });

  // CANCELAR OU CONCLUIR
  app.patch("/agendamentos/:id/status", {
    schema: {
      tags: ["Agendamentos"],
      summary: "Cancelar ou concluir agendamento",
      params: idSchema,
      body: statusSchema,
    },
  }, async (request, reply) => {
    return controller.alterarStatus(
      request.params.id,
      request.body.status,
      reply
    );
  });
}
