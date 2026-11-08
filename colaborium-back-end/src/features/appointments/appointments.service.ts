
import * as repository from "./appointments.repository";

import {
  AppointmentError,
  type AppointmentInput,
  type AppointmentFilters,
  type AppointmentStatus,
} from "./appointments.repository";

function validateAppointment(data: AppointmentInput) {
  if (data.fim <= data.inicio) {
    throw new AppointmentError(
      400,
      "O horário final deve ser maior que o inicial"
    );
  }
}

export async function cadastrarAgendamento(
  data: AppointmentInput
) {
  validateAppointment(data);
  return repository.createAppointment(data);
}

export async function listarAgendamentos(
  filters: AppointmentFilters
) {
  return repository.listAppointments(filters);
}

export async function buscarAgendamento(id: number) {
  const result = await repository.findAppointmentById(id);

  if (!result) {
    throw new AppointmentError(
      404,
      "Agendamento não encontrado"
    );
  }

  return result;
}

export async function alterarAgendamento(
  id: number,
  data: AppointmentInput
) {
  validateAppointment(data);
  return repository.updateAppointment(id, data);
}

export async function alterarStatusAgendamento(
  id: number,
  status: AppointmentStatus
) {
  return repository.changeAppointmentStatus(id, status);
}
