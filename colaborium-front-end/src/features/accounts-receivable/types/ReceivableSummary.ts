// totais dos 4 cards, vindo de GET /contas-receber/resumo
export type ReceivableSummary = {
  total_a_receber: number;
  a_vencer: number;
  vencido: number;
  recebido_mes: number;
};
