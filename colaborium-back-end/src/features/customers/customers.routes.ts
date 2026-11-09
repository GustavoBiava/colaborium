
import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { db } from "../../config/database";
import customerController from "./customers.controller";
import { createCustomerSchema, updateCustomerSchema } from "./customers.schemas";

export async function customerRoutes(app: FastifyInstance) {

  // LISTAR CLIENTES
  app.get(
    "/clientes", {
    schema: {
      tags: ["Clientes"],
      summary: "Listar todos os clientes",
      querystring: z.object({
        page: z.coerce.number().int().positive().optional().default(1),
        limit: z.coerce.number().int().positive().max(100).optional().default(10)
      })
    },
  }, customerController.getCustomersHandler.bind(customerController));

  // CADASTRAR CLIENTE
  app.post("/clientes", {
    schema: {
      tags: ["Clientes"],
      summary: "Cadastrar novo cliente",
      body: createCustomerSchema
    },
  }, customerController.createCustomerHandler.bind(customerController));

  // CONSULTAR CLIENTE POR ID
  app.get("/clientes/:id", {
    schema: {
      tags: ["Clientes"],
      summary: "Listar um cliente por ID",
      params: z.object({
        id: z.coerce.number().int().positive(),
      })
    },
  }, customerController.getCustomerHandler.bind(customerController));

  // EDITAR CLIENTE
  app.put("/clientes/:id", {
    schema: {
      tags: ["Clientes"],
      summary: "Editar um cliente",
      params: z.object({
        id: z.coerce.number().int().positive(),
      }),
      body: updateCustomerSchema
    },
  }, customerController.updateCustomerHandler.bind(customerController));

  // EXCLUIR USUÁRIO
  app.delete("/clientes/:id", {
    schema: {
      tags: ["Clientes"],
      summary: "Excluir um cliente",
      params: z.object({
        id: z.coerce.number().int().positive(),
      }),
    },
  }, customerController.deleteCustomerHandler.bind(customerController));
}
