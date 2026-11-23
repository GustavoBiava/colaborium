import type { FastifyReply, FastifyRequest } from "fastify";
import receivableService from "./receivables.service";
import { ReceivableError } from "./receivables.repository";
import type {
  CreateReceivableDTO,
  ListReceivablesQuery,
  SettleReceivableDTO,
} from "./receivables.schemas";

type ReceivableParams = {
  id: number;
};

function handleError(
  error: unknown,
  request: FastifyRequest,
  reply: FastifyReply,
) {
  if (error instanceof ReceivableError) {
    return reply.status(error.statusCode).send({ message: error.message });
  }

  request.log.error(error);
  return reply.status(500).send({ message: "Erro interno do servidor" });
}

class ReceivableController {
  async listHandler(
    request: FastifyRequest<{ Querystring: ListReceivablesQuery }>,
    reply: FastifyReply,
  ) {
    try {
      const result = await receivableService.getReceivables(request.query);
      return reply.status(200).send(result);
    } catch (error) {
      return handleError(error, request, reply);
    }
  }

  async summaryHandler(request: FastifyRequest, reply: FastifyReply) {
    try {
      const result = await receivableService.getSummary();
      return reply.status(200).send(result);
    } catch (error) {
      return handleError(error, request, reply);
    }
  }

  async createHandler(
    request: FastifyRequest<{ Body: CreateReceivableDTO }>,
    reply: FastifyReply,
  ) {
    try {
      const result = await receivableService.createReceivable(request.body);
      return reply.status(201).send(result);
    } catch (error) {
      return handleError(error, request, reply);
    }
  }

  async settleHandler(
    request: FastifyRequest<{
      Params: ReceivableParams;
      Body: SettleReceivableDTO;
    }>,
    reply: FastifyReply,
  ) {
    try {
      const result = await receivableService.settleReceivable(
        request.params.id,
        request.body,
      );
      return reply.status(200).send(result);
    } catch (error) {
      return handleError(error, request, reply);
    }
  }
}

export default new ReceivableController();
