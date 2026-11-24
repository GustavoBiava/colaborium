import type { FastifyInstance } from "fastify";
import { z } from "zod";
import authController from "./auth.controller.js";
import { loginSchema } from "./auth.schemas.js";

export async function authRoutes(app: FastifyInstance) {
  app.post(
    "/auth/login",
    {
      schema: {
        tags: ["Autenticação"],
        summary: "Autenticar usuário",
        body: loginSchema,
      },
    },
    authController.loginHandler.bind(authController)
  );

  app.get(
    "/auth/me",
    {
      schema: {
        tags: ["Autenticação"],
        summary: "Retornar o usuário autenticado",
      },
      preHandler: [app.authenticate],
    },
    authController.meHandler.bind(authController)
  );
}