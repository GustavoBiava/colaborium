export type ReceivableStatus = "pendente" | "vencido" | "recebido";

export type ReceivableStatusFilter = ReceivableStatus | "todos";

export type ReceivableResponse = {
  id: number;
  cliente_id: number;
  cliente_nome: string;
  contrato_id: number | null;
  pagamento_id: number | null;
  descricao: string | null;
  valor: number;
  data_emissao: string | null;
  data_vencimento: string | null;
  data_pagamento: string | null;
  status: ReceivableStatus;
  forma_pagamento: string | null;
  juros: number;
  multa: number;
  desconto: number;
  valor_pago: number;
};
