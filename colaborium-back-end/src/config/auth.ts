import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import fastifyJwt from "@fastify/jwt";

export async function registerAuth(app: FastifyInstance) {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET não configurado.");
  }

  await app.register(fastifyJwt, {
    secret: process.env.JWT_SECRET,
    sign: {
      expiresIn: process.env.JWT_EXPIRES_IN ?? "15m",
    },
  });

  app.decorate(
    "authenticate",
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        await request.jwtVerify();
      } catch {
        reply.status(401).send({ message: "Não autenticado." });
      }
    }
  );
}
