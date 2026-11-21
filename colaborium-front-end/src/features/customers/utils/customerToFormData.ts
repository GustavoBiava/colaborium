import type { CustomerResponse } from "../types/CustomerResponse";
import type { CustomerFormData } from "../schema/customerSchema";

export function customerToFormData(
  customer: CustomerResponse,
): CustomerFormData {
  return {
    name: customer.nome_empresa,
    email: customer.email,
    cnpj_cpf: customer.cpf_cnpj_empresa,
    telefone: customer.telefone,
    cep: customer.cep_empresa,
    endereco: customer.endereco_empresa,
    numero: customer.numero_empresa,
    bairro: customer.bairro_empresa,
    cidade: customer.cidade_empresa,
    estado: customer.estado_empresa,
    ie: customer.ie ?? undefined,
    isento: customer.ie === null,
  };
}
