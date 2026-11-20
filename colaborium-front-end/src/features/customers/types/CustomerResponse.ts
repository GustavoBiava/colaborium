export type CustomerResponse = {
  id: number;

  // Dados da empresa
  nome_empresa: string;
  cpf_cnpj_empresa: string;
  ie: string | null;
  email: string;
  telefone: string;

  // Endereço da empresa
  endereco_empresa: string;
  numero_empresa: string;
  complemento_empresa?: string | null;
  bairro_empresa: string;
  cidade_empresa: string;
  estado_empresa: string;
  cep_empresa: string;

  // Dados do representante
  nome_representante: string;
  cpf_representante: string;
  nacionalidade_representante?: string | null;
  estado_civil_representante: string;
  cargo_representante: string;

  // Endereço do representante
  endereco_representante: string;
  numero_representante: string;
  complemento_representante?: string | null;
  bairro_representante: string;
  cidade_representante: string;
  estado_representante: string;
  cep_representante: string;

  ativo: boolean;
};
