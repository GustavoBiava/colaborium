// status calculado pelo back
export type ReceivableStatus = "pendente" | "vencido" | "recebido";

// filtro da tela: um status ou todos
export type ReceivableStatusFilter = ReceivableStatus | "todos";

// conta a receber como vem do GET /contas-receber
export type ReceivableResponse = {
  id: number;
  cliente_id: number;
  cliente_nome: string;
  contrato_id: number | null;
  pagamento_id: number | null;
  descricao: string | null;
  valor: number;
  data_emissao: string | null; // YYYY-MM-DD
  data_vencimento: string | null; // YYYY-MM-DD
  data_pagamento: string | null; // YYYY-MM-DD
  status: ReceivableStatus;
  forma_pagamento: string | null;
  juros: number;
  multa: number;
  desconto: number;
  valor_pago: number;
};
