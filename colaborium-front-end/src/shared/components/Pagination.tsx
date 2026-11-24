import { Button } from "@/shared/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import {
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
} from "lucide-react";

interface PaginationProps {
  page: number;
  totalPages: number;
  limit: number | "all";
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number | "all") => void;
}

export function Pagination({
  page,
  totalPages,
  limit,
  onPageChange,
  onLimitChange,
}: PaginationProps) {
  const isFirst = page === 1;
  const isLast = page === totalPages;

  return (
    <div className="flex items-center justify-center rounded-xl border border-neutral-200 bg-white px-4 py-1 relative">
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          aria-label="Primeira página"
          disabled={isFirst}
          onClick={() => onPageChange(1)}
          className="hover:bg-neutral-200"
        >
          <ChevronsLeft size={16} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Página anterior"
          disabled={isFirst}
          onClick={() => onPageChange(page - 1)}
          className="hover:bg-neutral-200"
        >
          <ChevronLeft size={16} />
        </Button>

        <span className="min-w-12 text-center text-sm text-neutral-600">
          {page}/{totalPages}
        </span>

        <Button
          variant="ghost"
          size="icon"
          aria-label="Próxima página"
          disabled={isLast}
          onClick={() => onPageChange(page + 1)}
          className="hover:bg-neutral-200"
        >
          <ChevronRight size={16} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Última página"
          disabled={isLast}
          onClick={() => onPageChange(totalPages)}
          className="hover:bg-neutral-200"
        >
          <ChevronsRight size={16} />
        </Button>
      </div>

      <div className="absolute right-3">
        <Select
          value={String(limit)}
          onValueChange={(v) => onLimitChange(v === "all" ? "all" : Number(v))}
        >
          <SelectTrigger aria-label="Itens por página" className="w-24">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="50">50</SelectItem>
            <SelectItem value="100">100</SelectItem>
            <SelectItem value="all">Todos</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
