import type { ReceivableStatus } from "../types/ReceivableResponse";

export const RECEIVABLE_STATUS_LABEL: Record<ReceivableStatus, string> = {
  pendente: "Pendente",
  vencido: "Vencido",
  recebido: "Recebido",
};

export const RECEIVABLE_STATUS_BADGE_CLASS: Record<ReceivableStatus, string> = {
  pendente: "bg-orange-100 text-orange-700",
  vencido: "bg-red-100 text-red-700",
  recebido: "bg-green-100 text-green-700",
};

export const KANBAN_COLUMNS: {
  status: ReceivableStatus;
  title: string;
  dotClass: string;
}[] = [
  { status: "pendente", title: "A vencer", dotClass: "bg-orange-500" },
  { status: "vencido", title: "Vencido", dotClass: "bg-red-500" },
  { status: "recebido", title: "Recebido", dotClass: "bg-green-600" },
];

export const PAYMENT_METHODS: string[] = [
  "PIX",
  "Boleto",
  "Transferência",
  "Cartão",
  "Dinheiro",
];
