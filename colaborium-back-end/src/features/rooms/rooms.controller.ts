
import type { FastifyReply } from "fastify";
import * as service from "./rooms.service";
import type { RoomInput } from "./rooms.repository";

// CADASTRAR
export async function cadastrar(
  dados: RoomInput,
  reply: FastifyReply
) {
  const sala = await service.cadastrarSala(dados);
  return reply.status(201).send(sala);
}

// LISTAR
export async function listar(reply: FastifyReply) {
  const salas = await service.listarSalas();
  return reply.status(200).send(salas);
}

// BUSCAR POR ID
export async function buscar(
  id: number,
  reply: FastifyReply
) {
  const sala = await service.buscarSala(id);

  if (!sala) {
    return reply.status(404).send({
      message: "Sala não encontrada",
    });
  }

  return reply.status(200).send(sala);
}

// ALTERAR
export async function alterar(
  id: number,
  dados: RoomInput,
  reply: FastifyReply
) {
  const sala = await service.alterarSala(id, dados);

  if (!sala) {
    return reply.status(404).send({
      message: "Sala não encontrada",
    });
  }

  return reply.status(200).send(sala);
}

// ATIVAR / DESATIVAR
export async function alterarSituacao(
  id: number,
  ativo: boolean,
  reply: FastifyReply
) {
  const sala = await service.alterarSituacaoSala(
    id,
    ativo
  );

  if (!sala) {
    return reply.status(404).send({
      message: "Sala não encontrada",
    });
  }

  return reply.status(200).send(sala);
}
