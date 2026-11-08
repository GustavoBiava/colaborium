
import type { FastifyReply } from "fastify";

import * as service from "./contracts.service";

import {
  ContractError,
  type ContractInput,
  type ContractFilters,
} from "./contracts.repository";

// Centraliza o tratamento de erros conhecidos.
async function execute(
  reply: FastifyReply,
  operation: () => Promise<unknown>,
  successStatus = 200
) {
  try {
    const result = await operation();

    return reply.status(successStatus).send(result);
  } catch (error) {
    if (error instanceof ContractError) {
      return reply.status(error.statusCode).send({
        message: error.message,
      });
    }

    // Erros inesperados são tratados pelo Fastify.
    throw error;
  }
}

// CADASTRAR
export async function cadastrar(
  data: ContractInput,
  reply: FastifyReply
) {
  return execute(
    reply,
    () => service.cadastrarContrato(data),
    201
  );
}

// LISTAR
export async function listar(
  filters: ContractFilters,
  reply: FastifyReply
) {
  return execute(
    reply,
    () => service.listarContratos(filters)
  );
}

// BUSCAR POR ID
export async function buscar(
  id: number,
  reply: FastifyReply
) {
  return execute(
    reply,
    () => service.buscarContrato(id)
  );
}

// ALTERAR
export async function alterar(
  id: number,
  data: ContractInput,
  reply: FastifyReply
) {
  return execute(
    reply,
    () => service.alterarContrato(id, data)
  );
}

// FINALIZAR OU CANCELAR
export async function alterarStatus(
  id: number,
  status: "F" | "C",
  motivo: string | undefined,
  reply: FastifyReply
) {
  return execute(
    reply,
    () => service.alterarStatusContrato(
      id,
      status,
      motivo
    )
  );
}
