import type { FastifyInstance } from "fastify";
import receivableController from "./receivables.controller";
import {
  createReceivableSchema,
  listReceivablesQuerySchema,
  receivableIdParamsSchema,
  settleReceivableSchema,
} from "./receivables.schemas";

// registrar em server.ts dentro do bloco de rotas protegidas
export async function receivablesRoutes(app: FastifyInstance) {
  // LISTAR CONTAS (paginado, filtro por status e busca)
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

  // CRIAR CONTA MANUAL
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

  // DAR BAIXA
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
