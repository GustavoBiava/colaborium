export type ContractSala = {
  sala_id: number;
  nome: string;
  valor_negociado: number;
};

export type ContractResponse = {
  id: number;
  cliente_id: number;
  data_inicio: string;
  data_fim: string;
  valor_base: number;
  periodo: number;
  status: "A" | "F" | "C";
  ativo: boolean;
  data_cancelamento: string | null;
  motivo_cancelamento: string | null;
  observacao: string | null;
  salas: ContractSala[];
};
