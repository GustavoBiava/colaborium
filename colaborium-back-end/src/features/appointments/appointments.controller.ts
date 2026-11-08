
import type { FastifyReply } from "fastify";
import * as service from "./appointments.service";

import {
  AppointmentError,
  type AppointmentInput,
  type AppointmentFilters,
  type AppointmentStatus,
} from "./appointments.repository";

async function execute(
  reply: FastifyReply,
  operation: () => Promise<unknown>,
  successStatus = 200
) {
  try {
    const result = await operation();

    return reply.status(successStatus).send(result);
  } catch (error) {
    if (error instanceof AppointmentError) {
      return reply.status(error.statusCode).send({
        message: error.message,
      });
    }

    throw error;
  }
}

export async function cadastrar(
  data: AppointmentInput,
  reply: FastifyReply
) {
  return execute(
    reply,
    () => service.cadastrarAgendamento(data),
    201
  );
}

export async function listar(
  filters: AppointmentFilters,
  reply: FastifyReply
) {
  return execute(
    reply,
    () => service.listarAgendamentos(filters)
  );
}

export async function buscar(
  id: number,
  reply: FastifyReply
) {
  return execute(
    reply,
    () => service.buscarAgendamento(id)
  );
}

export async function alterar(
  id: number,
  data: AppointmentInput,
  reply: FastifyReply
) {
  return execute(
    reply,
    () => service.alterarAgendamento(id, data)
  );
}

export async function alterarStatus(
  id: number,
  status: AppointmentStatus,
  reply: FastifyReply
) {
  return execute(
    reply,
    () => service.alterarStatusAgendamento(id, status)
  );
}
