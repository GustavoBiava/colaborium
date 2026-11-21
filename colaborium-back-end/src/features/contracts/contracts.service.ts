
import * as repository from "./contracts.repository";

import {
  ContractError,
  type ContractInput,
  type ContractFilters,
} from "./contracts.repository";

function validateContract(data: ContractInput) {
  // Impede que o contrato termine antes de começar.
  if (data.data_fim < data.data_inicio) {
    throw new ContractError(
      400,
      "A data final não pode ser anterior à inicial"
    );
  }

  // Impede IDs de salas duplicados.
  const uniqueRooms = new Set(data.salas);

  if (uniqueRooms.size !== data.salas.length) {
    throw new ContractError(
      400,
      "Não é permitido repetir a mesma sala"
    );
  }

  if (data.salas.length === 0) {
    throw new ContractError(
      400,
      "Informe pelo menos uma sala"
    );
  }
}

export async function cadastrarContrato(
  data: ContractInput
) {
  validateContract(data);
  return repository.createContract(data);
}

export async function listarContratos(
  filters: ContractFilters
) {
  return repository.listContracts(filters);
}

export async function buscarContrato(id: number) {
  const contract = await repository.findContractById(id);

  if (!contract) {
    throw new ContractError(
      404,
      "Contrato não encontrado"
    );
  }

  return contract;
}

export async function alterarContrato(
  id: number,
  data: ContractInput
) {
  validateContract(data);
  return repository.updateContract(id, data);
}

export async function alterarStatusContrato(
  id: number,
  status: "F" | "C",
  motivo?: string
) {
  if (status === "C" && !motivo?.trim()) {
    throw new ContractError(
      400,
      "Informe o motivo do cancelamento"
    );
  }

  return repository.changeContractStatus(
    id,
    status,
    motivo
  );
}
