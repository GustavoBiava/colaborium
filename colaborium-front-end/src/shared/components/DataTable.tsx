import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import {
  flexRender,
  type RowData,
  type Table as TanstackTable,
} from "@tanstack/react-table";

import type { features } from "@/features/customers/page";

interface DataTableProps<TData extends RowData & { id: number }> {
  table: TanstackTable<typeof features, TData>;
  onRowClick: (id: number) => void;
}

export function DataTable<TData extends RowData & { id: number }>({
  table,
  onRowClick,
}: DataTableProps<TData>) {
  return (
    <Table>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <TableHead
                key={header.id}
                onClick={header.column.getToggleSortingHandler?.()}
                className={`cursor-pointer select-none ${
                  header.column.id === "actions" ? "text-right pr-5" : ""
                }`}
              >
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows.map((row) => (
          <TableRow
            onClick={(e) => {
              e.stopPropagation();
              onRowClick(row.original.id);
            }}
            key={row.id}
          >
            {row.getAllCells().map((cell) => (
              <TableCell
                className={
                  cell.column.id === "actions" ? "text-right" : "text-left"
                }
              >
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
