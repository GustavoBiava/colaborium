import { isAxiosError } from "axios";

// tira mensagem do erro da API. se não tiver, devolve texto padrão
export function getApiErrorMessage(error: unknown): string {
  if (isAxiosError<{ message?: string }>(error)) {
    return error.response?.data?.message ?? "Erro ao comunicar com o servidor";
  }

  return "Erro inesperado";
}
