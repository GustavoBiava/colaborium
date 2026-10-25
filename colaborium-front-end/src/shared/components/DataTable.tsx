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
  sortFn_alphanumeric,
  type RowData,
  type Table as TanstackTable,
} from "@tanstack/react-table";

import {
  createSortedRowModel,
  rowSortingFeature,
  tableFeatures,
} from "@tanstack/react-table";

const dataTableFeatures = tableFeatures({
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  sortFns: { alphanumeric: sortFn_alphanumeric },
});

interface DataTableProps<TData extends RowData> {
  table: TanstackTable<typeof dataTableFeatures, TData>;
}

export function DataTable<TData extends RowData>({
  table,
}: DataTableProps<TData>) {
  return (
    <Table>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {/* here the header id is generated based on the helper.acessor. The id from column "email" is "email" */}
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
          <TableRow>
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
