
import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { db } from "../../config/database";
import userController from "./users.controller";
import { createUserSchema, updateUserSchema } from "./users.schemas";

export async function usersRoutes(app: FastifyInstance) {

  // LISTAR USUÁRIOS
  app.get(
    "/usuarios", {
    schema: {
      tags: ["Usuários"],
      summary: "Listar todos os usuários",
      querystring: z.object({
        page: z.coerce.number().int().positive().optional().default(1),
        limit: z.coerce.number().int().positive().max(100).optional().default(10)
      })
    },
  }, userController.getUsersHandler.bind(userController));

  // CADASTRAR USUÁRIO
  app.post("/usuarios", {
    schema: {
      tags: ["Usuários"],
      summary: "Cadastrar novo usuário",
      body: createUserSchema
    },
  }, userController.createUserHandler.bind(userController));

  // EDITAR USUÁRIO
  app.get("/usuarios/:id", {
    schema: {
      tags: ["Usuários"],
      summary: "Listar um usuário por ID",
      params: z.object({
        id: z.coerce.number().int().positive(),
      })
    },
  }, userController.getUserHandler.bind(userController));

  // CONSULTAR USUÁRIO POR ID
  app.put("/usuarios/:id", {
    schema: {
      tags: ["Usuários"],
      summary: "Editar um usuário",
      params: z.object({
        id: z.coerce.number().int().positive(),
      }),
      body: updateUserSchema
    },
  }, userController.updateUserHandler.bind(userController));

  // EXCLUIR USUÁRIO
  app.delete("/usuarios/:id", {
    schema: {
      tags: ["Usuários"],
      summary: "Excluir um usuário",
      params: z.object({
        id: z.coerce.number().int().positive(),
      }),
    },
  }, userController.deleteUserHandler.bind(userController));
}
