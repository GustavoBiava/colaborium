import { fastify } from "fastify";
import { db } from "./config/database.js";
import { registerAuth } from "./config/auth.js";
import { authRoutes } from "./features/auth/auth.routes.js";

import { roomsRoutes } from "./features/rooms/rooms.routes.js";
import { contractsRoutes } from "./features/contracts/contracts.routes.js";
import { appointmentsRoutes } from "./features/appointments/appointments.routes.js";
import { usersRoutes } from "./features/users/users.routes.js";
import { customerRoutes } from "./features/customers/customers.routes.js";

import {
  serializerCompiler,
  validatorCompiler,
  jsonSchemaTransform,
  type ZodTypeProvider,
} from "fastify-type-provider-zod";

import { fastifyCors } from "@fastify/cors";
import { fastifySwagger } from "@fastify/swagger";
import { receivablesRoutes } from "./features/receivables/receivables.routes.js";

const SWAGGER_UI_MODULE = "@fastify/swagger-ui";
const API_PREFIX = process.env.API_PREFIX ?? (process.env.VERCEL ? "/api" : "");

const app = fastify({
  logger: true,
}).withTypeProvider<ZodTypeProvider>();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(fastifyCors, {
  origin: ["https://colaborium-frontend.vercel.app"],
  methods: ["POST", "PUT", "PATCH", "OPTIONS", "GET", "DELETE"],
  credentials: true,  
});

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: "Colaborium API",
      description: "API de gerenciamento do Colaborium",
      version: "1.0.0",
    },
  },
  transform: jsonSchemaTransform,
});

await registerAuth(app);

app.register(authRoutes, { prefix: API_PREFIX });

if (process.env.NODE_ENV !== "production" && !process.env.VERCEL) {
  const { fastifySwaggerUi } = await import(/* @vite-ignore */ SWAGGER_UI_MODULE);
  app.register(fastifySwaggerUi, {
    routePrefix: `${API_PREFIX}/docs`,
  });
}

app.register(async (protectedApp) => {
  protectedApp.addHook("preHandler", protectedApp.authenticate);

  protectedApp.register(roomsRoutes);
  protectedApp.register(contractsRoutes);
  protectedApp.register(appointmentsRoutes);
  protectedApp.register(usersRoutes);
  protectedApp.register(customerRoutes);
  protectedApp.register(receivablesRoutes);
}, { prefix: API_PREFIX });

app.get(
  `${API_PREFIX}/health`,
  {
    schema: {
      tags: ["Sistema"],
      summary: "Verificar funcionamento da API",
      description: "Retorna o status do servidor",
    },
  },
  async () => {
    return {
      status: "ok",
      message: "Colaborium API funcionando!",
    };
  },
);

app.get(
  `${API_PREFIX}/health/database`,
  {
    schema: {
      tags: ["Sistema"],
      summary: "Testar conexão com PostgreSQL",
      description: "Verifica se a API consegue acessar o banco",
    },
  },
  async (request, reply) => {
    try {
      const result = await db.query(
        "SELECT CURRENT_DATABASE() AS banco, NOW() AS horario",
      );

      return {
        status: "ok",
        message: "PostgreSQL conectado com sucesso!",
        database: result.rows[0].banco,
        horario: result.rows[0].horario,
      };
    } catch (error) {
      request.log.error(error);

      return reply.status(503).send({
        status: "error",
        message: "Não foi possível conectar ao PostgreSQL",
      });
    }
  },
);

async function start() {
  try {
    await app.listen({
      port: Number(process.env.PORT ?? 3333),
      host: "0.0.0.0",
    })
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
}

await app.ready();

if (!process.env.VERCEL) {
  start();
}

export default app;