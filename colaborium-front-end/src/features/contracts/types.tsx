export type Contract = {
  id: number;
  cliente_id: number;
  sala_id: number;
  data_inicio: Date;
  data_fim: Date;
  valor_base: number;
  periodo: string;
  status: string;
  ativo: boolean;
  data_cancelamento: Date;
  motivo_cancelamento: string;
  observacao: string;
};