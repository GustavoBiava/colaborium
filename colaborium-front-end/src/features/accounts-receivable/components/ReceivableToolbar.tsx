import { Input } from "@/shared/components/ui/input";
import { useEffect, useState } from "react";
import type { ReceivableStatusFilter } from "../types/ReceivableResponse";
import { SegmentedControl } from "./SegmentedControl";

export type ReceivableView = "lista" | "kanban";

interface ReceivableToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  status: ReceivableStatusFilter;
  onStatusChange: (value: ReceivableStatusFilter) => void;
  view: ReceivableView;
  onViewChange: (value: ReceivableView) => void;
}

const STATUS_OPTIONS: { value: ReceivableStatusFilter; label: string }[] = [
  { value: "todos", label: "Todos" },
  { value: "pendente", label: "Pendente" },
  { value: "vencido", label: "Vencido" },
  { value: "recebido", label: "Recebido" },
];

const VIEW_OPTIONS: { value: ReceivableView; label: string }[] = [
  { value: "lista", label: "Lista" },
  { value: "kanban", label: "Kanban" },
];

export function ReceivableToolbar({
  search,
  onSearchChange,
  status,
  onStatusChange,
  view,
  onViewChange,
}: ReceivableToolbarProps) {
  const [text, setText] = useState(search);

  useEffect(() => {
    const timer = setTimeout(() => onSearchChange(text), 300);
    return () => clearTimeout(timer);
  }, [text, onSearchChange]);

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Buscar cliente ou documento..."
        className="min-w-64 flex-1 rounded-xs"
      />

      <SegmentedControl
        ariaLabel="Filtrar por status"
        options={STATUS_OPTIONS}
        value={status}
        onChange={onStatusChange}
      />

      <SegmentedControl
        ariaLabel="Modo de exibição"
        options={VIEW_OPTIONS}
        value={view}
        onChange={onViewChange}
      />
    </div>
  );
}
