
import * as repository from "./rooms.repository";
import type { RoomInput } from "./rooms.repository";

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
