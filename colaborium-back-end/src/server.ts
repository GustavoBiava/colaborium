import { fastify } from "fastify";
import { db } from "./config/database";
import { registerAuth } from "./config/auth";
import { authRoutes } from "./features/auth/auth.routes";

import { roomsRoutes } from "./features/rooms/rooms.routes";
import { contractsRoutes } from "./features/contracts/contracts.routes";
import { appointmentsRoutes } from "./features/appointments/appointments.routes";
import { usersRoutes } from "./features/users/users.routes";
import { customerRoutes } from "./features/customers/customers.routes";

import {
  serializerCompiler,
  validatorCompiler,
  jsonSchemaTransform,
  type ZodTypeProvider,
} from "fastify-type-provider-zod";

import { fastifyCors } from "@fastify/cors";
import { fastifySwagger } from "@fastify/swagger";
import { fastifySwaggerUi } from "@fastify/swagger-ui";
import { receivablesRoutes } from "./features/receivables/receivables.routes";

const app = fastify({
  logger: true,
}).withTypeProvider<ZodTypeProvider>();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(fastifyCors, {
  origin: ["http://localhost:5173"],
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

app.register(authRoutes);

if (process.env.NODE_ENV !== "production") {
  app.register(fastifySwaggerUi, {
    routePrefix: "/docs",
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
});

app.get(
  "/health",
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
  "/health/database",
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

start();
