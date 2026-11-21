export type RoomResponse = {
  id: number;
  nome: string;
  descricao?: string | null;
  capacidade: number;
  valor: number;
  localizacao?: string | null;
  qtd_arcondicionado: number;
  qtd_cadeira: number;
  qtd_mesa: number;
  ocupada: boolean;
};
