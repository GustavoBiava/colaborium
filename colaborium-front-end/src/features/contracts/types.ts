export type Contract = {
  id: number;
  cliente_id: number;
  sala_id: number;
  data_inicio: Date;
  data_fim: Date;
  valor_base: number;
  periodo: string;
  status: "A" | "F" | "C";
  ativo: boolean;
  data_cancelamento: Date | null;
  motivo_cancelamento: string | null;
  observacao: string | null;
};