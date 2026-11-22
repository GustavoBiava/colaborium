// status que a tela mostra (calculado em SQL, não é a coluna crua)
export type ReceivableStatus = "pendente" | "vencido" | "recebido";

// linha da listagem: conta + nome do cliente
export type ReceivableRow = {
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

// 4 cards do topo
export type ReceivableSummary = {
  total_a_receber: number;
  a_vencer: number;
  vencido: number;
  recebido_mes: number;
};

// envelope padrão de paginação do projeto
export type PaginatedReceivables = {
  data: ReceivableRow[];
  pagination: {
    actual_page: number;
    limit_per_page: number | "all";
    total: number;
    total_pages: number;
    has_next: boolean;
  };
};
