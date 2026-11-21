import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

declare module "fastify" {
    interface FastifyInstance {
        authenticate: (
            request: FastifyRequest,
            reply: FastifyReply
        ) => Promise<void>;
    }
}

type Perfil = "USUARIO" | "ADMIN";

declare module "@fastify/jwt" {
  interface FastifyJWT {
    payload: {
      sub: string;
      perfil: Perfil;
    };

    user: {
      sub: string;
      perfil: Perfil;
      iat: number;
      exp: number;
    };
  }
}