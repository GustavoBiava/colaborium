
import * as repository from "./rooms.repository.js";
import type { RoomInput } from "./rooms.repository.js";

export async function cadastrarSala(data: RoomInput) {
  return repository.createRoom(data);
}

export async function listarSalas(incluirInativos: boolean) {
  return repository.listRooms(incluirInativos);
}

export async function listarSalasDisponiveis(
  dataInicio: string,
  dataFim: string
) {
  return repository.listAvailableRooms(dataInicio, dataFim);
}

export async function buscarSala(id: number) {
  return repository.findRoomById(id);
}

export async function alterarSala(
  id: number,
  data: RoomInput
) {
  return repository.updateRoom(id, data);
}

export async function alterarSituacaoSala(
  id: number,
  ativo: boolean
) {
  return repository.updateRoomActive(id, ativo);
}

// EXCLUIR SALA
export async function excluirSala(id: number) {
  const sala = await repository.findRoomById(id);

  if (!sala) {
    return "NAO_ENCONTRADA";
  }

  // Bloqueia se a sala já esteve vinculada a qualquer contrato
  const possuiContrato = await repository.hasAnyContract(id);

  if (possuiContrato) {
    return "POSSUI_CONTRATO";
  }

  await repository.deleteRoom(id);

  return "EXCLUIDA";
}
