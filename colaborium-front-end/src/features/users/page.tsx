import { DataTable } from "@/shared/components/DataTable";
import { PageLayout } from "@/shared/components/layout/PageLayout";

import {
  createColumnHelper,
  createSortedRowModel,
  rowSortingFeature,
  sortFn_alphanumeric,
  tableFeatures,
  useTable,
  type SortingState,
} from "@tanstack/react-table";
import { useState } from "react";

// here we are using tanstack table, beacuse we already plan to use tanstack query. Basically the advantage of using tanstack table is that it already has some data tables logics built in, like sorting, pagination, global filters, etc. And its headless, so we can use our own UI
// here is a video about it https://www.youtube.com/watch?v=GtT3mRjQ7Eo

type User = { id: string; name: string; email: string };

const data: User[] = [
  { id: "1", name: "Maria", email: "maria@procer.com.br" },
  { id: "2", name: "João", email: "joao@procer.com.br" },
];

// this feature thing is pretty badass, cause basically v8 version you called the whole thing, even thoght you were not going to use it all, so know you declare features so you choose whatever you wanna use, its modular and tree-shakeable
const features = tableFeatures({
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  sortFns: { alphanumeric: sortFn_alphanumeric },
});

const helper = createColumnHelper<typeof features, User>();
// From what I understand, this is to avoid typing error. You kind of merge the data and the functions, so typescript knows what columns and features are available .

// here we define columns obviously
const columns = helper.columns([
  helper.accessor("name", { header: "Nome" }),
  helper.accessor("email", { header: "E-mail" }),
]);

export function Users() {
  const [sorting, setSorting] = useState<SortingState>([]);

  // here you basically join the whole things, the features, the columns, the data and the state
  const table = useTable({
    features,
    columns,
    data,
    state: { sorting },
    onSortingChange: setSorting,
  });

  return (
    <PageLayout pageTitle="Usuários">
      <DataTable table={table} />
    </PageLayout>
  );
}
