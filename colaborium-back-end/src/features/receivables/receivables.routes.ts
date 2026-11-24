import type { FastifyInstance } from "fastify";
import receivableController from "./receivables.controller.js";
import {
  createReceivableSchema,
  listReceivablesQuerySchema,
  receivableIdParamsSchema,
  settleReceivableSchema,
} from "./receivables.schemas.js";

export async function receivablesRoutes(app: FastifyInstance) {
  // LISTAR CONTAS A RECEBER
  app.get(
    "/contas-receber",
    {
      schema: {
        tags: ["Contas a Receber"],
        summary: "Listar contas a receber",
        querystring: listReceivablesQuerySchema,
      },
    },
    receivableController.listHandler.bind(receivableController),
  );

  // TOTAIS DOS CARDS
  app.get(
    "/contas-receber/resumo",
    {
      schema: {
        tags: ["Contas a Receber"],
        summary: "Totais: a receber, a vencer, vencido, recebido no mês",
      },
    },
    receivableController.summaryHandler.bind(receivableController),
  );

  // CADASTRAR CONTA A RECEBER
  app.post(
    "/contas-receber",
    {
      schema: {
        tags: ["Contas a Receber"],
        summary: "Cadastrar conta a receber",
        body: createReceivableSchema,
      },
    },
    receivableController.createHandler.bind(receivableController),
  );

  // DAR BAIXA EM CONTA A RECEBER
  app.patch(
    "/contas-receber/:id/baixa",
    {
      schema: {
        tags: ["Contas a Receber"],
        summary: "Dar baixa em uma conta a receber",
        params: receivableIdParamsSchema,
        body: settleReceivableSchema,
      },
    },
    receivableController.settleHandler.bind(receivableController),
  );
}
