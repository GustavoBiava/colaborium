import { fastify } from "fastify";
import {
  serializerCompiler,
  validatorCompiler,
  jsonSchemaTransform,
  type ZodTypeProvider,
} from "fastify-type-provider-zod";
import { fastifyCors } from "@fastify/cors";

import { fastifySwagger } from "@fastify/swagger";

const app = fastify().withTypeProvider<ZodTypeProvider>();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(fastifyCors, {
  origin: true,
  methods: ["POST", "PUT", "PATCH", "OPTIONS", "GET", "DELETE"],
  //credentials: true, // -> permite que envie cookies do frontend diretamente para o backend
});

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: "Webhook Inspector de API",
      description: "API para capturar requisições webhook",
      version: "1.0.0",
    },
  },
  transform: jsonSchemaTransform,
});

app.listen({ port: 3333, host: "0.0.0.0" }).then(() => {
  console.log("HTTP server running");
});
