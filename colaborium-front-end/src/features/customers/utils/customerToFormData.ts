import type { CustomerResponse } from "../types/CustomerResponse";
import type { CustomerFormData } from "../schema/customerSchema";

export function customerToFormData(
  customer: CustomerResponse,
): CustomerFormData {
  return {
    nome_empresa: customer.nome_empresa,
    email: customer.email,
    cpf_cnpj_empresa: customer.cpf_cnpj_empresa,
    telefone: customer.telefone,
    cep_empresa: customer.cep_empresa,
    endereco_empresa: customer.endereco_empresa,
    numero_empresa: customer.numero_empresa,
    complemento_empresa: customer.complemento_empresa ?? undefined,
    bairro_empresa: customer.bairro_empresa,
    cidade_empresa: customer.cidade_empresa,
    estado_empresa: customer.estado_empresa,
    ie: customer.ie ?? null,
    isento: customer.ie === null,
    nome_representante: customer.nome_representante,
    cpf_representante: customer.cpf_representante,
    nacionalidade_representante: customer.nacionalidade_representante,
    estado_civil_representante: customer.estado_civil_representante,
    cargo_representante: customer.cargo_representante,
    endereco_representante: customer.endereco_representante,
    numero_representante: customer.numero_representante,
    complemento_representante: customer.complemento_representante ?? undefined,
    bairro_representante: customer.bairro_representante,
    cidade_representante: customer.cidade_representante,
    estado_representante: customer.estado_representante,
    cep_representante: customer.cep_representante,
  };
}
